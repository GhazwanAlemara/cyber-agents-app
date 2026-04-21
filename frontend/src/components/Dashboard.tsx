import { useState, useEffect } from 'react';

function Dashboard() {
  const [stats, setStats] = useState({
    reposScanned: 0,
    vulnerabilitiesFixed: 0,
    attacksBlocked: 0
  });

  useEffect(() => {
    // Mock data load
    setStats({
      reposScanned: 12,
      vulnerabilitiesFixed: 3,
      attacksBlocked: 147
    });
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Organization Overview</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <img src="https://img.shields.io/badge/Secured%20by-CyberAgents-3b82f6?style=for-the-badge" alt="Security Badge" />
          <button className="btn-primary">Connect New Repo</button>
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
        <ul className="activity-list">
          <li className="activity-item">
            <div className="activity-meta">
              <h4>Prompt Injection Blocked</h4>
              <p>Agent: `langchain-customer-support` • Source: Global Intel Network</p>
            </div>
            <div>
              <span className="badge attack">BLOCKED</span>
            </div>
          </li>
          <li className="activity-item">
            <div className="activity-meta">
              <h4>Dependency Vulnerability Fixed (CVE-2025-1023)</h4>
              <p>Repo: `acme-corp/frontend` • Action: Opened & Merged PR #142</p>
            </div>
            <div>
              <span className="badge safe">FIXED</span>
            </div>
          </li>
          <li className="activity-item">
            <div className="activity-meta">
              <h4>Agent Execution Audited</h4>
              <p>Agent: `sql-query-bot` • Action: Read 2 rows from production-db</p>
            </div>
            <div>
              <span className="badge safe">LOGGED</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
