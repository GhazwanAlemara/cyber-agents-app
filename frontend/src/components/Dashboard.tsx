import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, limit, onSnapshot, doc, type QuerySnapshot, type DocumentData } from 'firebase/firestore';
import type { User } from 'firebase/auth';

interface DashboardProps {
  user: User;
}

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  status: 'safe' | 'attack';
  timestamp: Date;
}

const GITHUB_APP_SLUG = "cyberagents-app";
const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/cNi00jfmxftvedpeAq9R60b";

function Dashboard({ user }: DashboardProps) {
  const [stats, setStats] = useState({
    reposScanned: 0,
    vulnerabilitiesFixed: 0,
    attacksBlocked: 0
  });

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<'free' | 'pro'>('free');

  useEffect(() => {
    let unsubscribeIntel = () => {};
    let unsubscribeEvents = () => {};
    let unsubscribeUser = () => {};

    const loadData = async () => {
      try {
        console.log("Setting up Firestore listeners for user:", user.uid);
        
        // 0. Listen to user plan status
        const userDocRef = doc(db, "users", user.uid);
        unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setPlan(userData.plan === 'pro' ? 'pro' : 'free');
          }
        });

        // 1. Listen to threat intel for this user
        const intelRef = collection(db, "threat_intel");
        // NOTE: This query requires a COMPOSITE INDEX in Firestore: user_id (ASC) + timestamp (DESC)
        const qIntel = query(intelRef, where("user_id", "==", user.uid), orderBy("timestamp", "desc"), limit(10));
        
        unsubscribeIntel = onSnapshot(qIntel, 
          (snapshot: QuerySnapshot<DocumentData>) => {
            console.log("Threat intel updated:", snapshot.docs.length);
            const attacksCount = snapshot.docs.length;
            const newActivities: Activity[] = snapshot.docs.map((doc: DocumentData) => {
              const data = doc.data();
              return {
                id: doc.id,
                type: 'intel',
                title: 'Prompt Injection Blocked',
                description: `Agent: ${data.agent_id || 'Unknown'} • Source: Global Intel Network`,
                status: 'attack',
                timestamp: data.timestamp?.toDate() || new Date()
              };
            });
            setActivities(prev => {
              const filtered = prev.filter(a => a.type !== 'intel');
              return [...newActivities, ...filtered].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
            });
            setStats(prev => ({ ...prev, attacksBlocked: attacksCount }));
            setLoading(false); // Clear loading on first successful catch
          },
          (error: any) => {
            console.error("Firestore Intel error:", error);
            setLoading(false); // Stop hanging on error
          }
        );

        // 2. Listen to github events
        const eventsRef = collection(db, "github_events");
        const qEvents = query(eventsRef, orderBy("timestamp", "desc"), limit(10));
        
        unsubscribeEvents = onSnapshot(qEvents, 
          (snapshot: QuerySnapshot<DocumentData>) => {
            console.log("GitHub events updated:", snapshot.docs.length);
            const reposCount = new Set(snapshot.docs.map((d: DocumentData) => d.data().payload?.repository?.full_name)).size;
            const fixesCount = snapshot.docs.filter((d: DocumentData) => d.data().event_type === 'pull_request').length;

            const eventActivities: Activity[] = snapshot.docs.map((doc: DocumentData) => {
              const data = doc.data();
              return {
                id: doc.id,
                type: 'event',
                title: data.event_type === 'pull_request' ? 'Dependency Vulnerability Fixed' : 'Codebase Scanned',
                description: `Repo: ${data.payload?.repository?.full_name || 'Unknown'} • Action: ${data.event_type}`,
                status: 'safe',
                timestamp: data.timestamp?.toDate() || new Date()
              };
            });
            setActivities(prev => {
              const filtered = prev.filter(a => a.type !== 'event');
              return [...eventActivities, ...filtered].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
            });
            setStats(prev => ({ ...prev, reposScanned: reposCount, vulnerabilitiesFixed: fixesCount }));
            setLoading(false);
          },
          (error: any) => {
            console.error("Firestore Events error:", error);
            setLoading(false);
          }
        );

      } catch (error: any) {
        console.error("Critical Data Load error:", error);
        setLoading(false);
      }
    };

    loadData();
    return () => {
      unsubscribeIntel();
      unsubscribeEvents();
      unsubscribeUser();
    };
  }, [user.uid]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Organization Overview</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Welcome back, {user.displayName || user.email}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '1rem' }}>
             <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Plan</span>
             <span style={{ fontWeight: 'bold', color: plan === 'pro' ? '#10b981' : 'var(--text-primary)' }}>{plan.toUpperCase()}</span>
          </div>
          {plan === 'free' && (
            <button className="btn-primary" onClick={() => window.location.href = `${STRIPE_CHECKOUT_URL}?client_reference_id=${user.uid}`}>Upgrade to Pro</button>
          )}
          <button className="btn-secondary" onClick={() => window.open(`https://github.com/apps/${GITHUB_APP_SLUG}/installations/new`, '_blank')}>Connect Repo</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-title">Repositories Protected</span>
          <span className="stat-value">{stats.reposScanned}</span>
        </div>
        <div className="stat-card success">
          <span className="stat-title">PRs Auto-Merged</span>
          <span className="stat-value">{stats.vulnerabilitiesFixed}</span>
        </div>
        <div className="stat-card success">
          <span className="stat-title">Threats Blocked</span>
          <span className="stat-value">{stats.attacksBlocked}</span>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Agent Activity</h3>
        {loading ? (
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Loading live data...</p>
        ) : activities.length > 0 ? (
          <ul className="activity-list">
            {activities.map(activity => (
              <li className="activity-item" key={activity.id}>
                <div className="activity-meta">
                  <h4>{activity.title}</h4>
                  <p>{activity.description}</p>
                </div>
                <div>
                  <span className={`badge ${activity.status}`}>
                    {activity.status === 'attack' ? 'BLOCKED' : 'SAFE'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', padding: '2rem', border: '1px dashed var(--border)', borderRadius: 'var(--radius)' }}>
            <p>No activity recorded yet.</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Connect a repository or deploy an AI agent to see live events.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
