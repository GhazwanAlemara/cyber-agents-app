import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
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

function Dashboard({ user }: DashboardProps) {
  const [stats, setStats] = useState({
    reposScanned: 0,
    vulnerabilitiesFixed: 0,
    attacksBlocked: 0
  });

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We are setting up a real listener to the 'threat_intel' and 'github_events' collections
    // If the database is empty, it will naturally show 0 and no activities, but it's 100% real.
    
    let unsubscribeIntel = () => {};
    let unsubscribeEvents = () => {};

    const loadData = async () => {
      try {
        // Listen to threat intel for this user
        const intelRef = collection(db, "threat_intel");
        const qIntel = query(intelRef, where("user_id", "==", user.uid), orderBy("timestamp", "desc"), limit(10));
        
        unsubscribeIntel = onSnapshot(qIntel, (snapshot) => {
          let attacksCount = snapshot.docs.length;
          
          const newActivities: Activity[] = snapshot.docs.map(doc => {
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
            const merged = [...newActivities, ...prev.filter(a => a.type !== 'intel')];
            return merged.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
          });

          setStats(prev => ({ ...prev, attacksBlocked: attacksCount }));
        });

        // Listen to github events
        const eventsRef = collection(db, "github_events");
        const qEvents = query(eventsRef, orderBy("timestamp", "desc"), limit(10));
        
        unsubscribeEvents = onSnapshot(qEvents, (snapshot) => {
          let reposCount = new Set(snapshot.docs.map(d => d.data().payload?.repository?.full_name)).size;
          let fixesCount = snapshot.docs.filter(d => d.data().event_type === 'pull_request').length;

          const eventActivities: Activity[] = snapshot.docs.map(doc => {
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
            const merged = [...eventActivities, ...prev.filter(a => a.type !== 'event')];
            return merged.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
          });

          setStats(prev => ({ 
            ...prev, 
            reposScanned: reposCount,
            vulnerabilitiesFixed: fixesCount 
          }));
          setLoading(false);
        });

      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setLoading(false);
        // It might fail if indices are missing, so we catch it.
      }
    };

    loadData();

    return () => {
      unsubscribeIntel();
      unsubscribeEvents();
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
          <img src="https://img.shields.io/badge/Secured%20by-CyberAgents-3b82f6?style=for-the-badge" alt="Security Badge" />
          <button className="btn-primary" onClick={() => window.open('https://github.com/apps/cyberagents-app/installations/new', '_blank')}>Connect New Repo</button>
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
