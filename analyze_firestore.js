const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const projectId = process.env.FB_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'cyber-agents-app';

async function analyze() {
  try {
    const admin = require('firebase-admin');
    admin.initializeApp({
      projectId: projectId
    });
    const db = admin.firestore();

    const collections = ['users', 'github_events', 'threat_intel'];
    console.log('--- Firestore Traffic Analysis ---');
    
    for (const collName of collections) {
      const snapshot = await db.collection(collName).get();
      console.log(`${collName}: ${snapshot.size} documents`);
      
      if (collName === 'threat_intel' && snapshot.size > 0) {
        console.log('\n--- Recent Threats ---');
        snapshot.docs.slice(0, 5).forEach(doc => {
          const data = doc.data();
          console.log(`- Reason: ${data.reason}, Agent: ${data.agent_id}, Time: ${data.timestamp?.toDate()}`);
        });
      }
      
      if (collName === 'users' && snapshot.size > 0) {
        console.log('\n--- Recent Users ---');
        snapshot.docs.slice(0, 5).forEach(doc => {
          const data = doc.data();
          console.log(`- User ID: ${doc.id}, Plan: ${data.plan || 'free'}`);
        });
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

analyze();
