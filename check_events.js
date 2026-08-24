const admin = require('firebase-admin');
const projectId = process.env.FB_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'cyber-agents-app';
admin.initializeApp({ projectId: projectId });
const db = admin.firestore();

async function checkEvents() {
  const snapshot = await db.collection('github_events').get();
  snapshot.forEach(doc => {
    console.log('Event:', doc.data().event_type);
    console.log('Payload Snippet:', JSON.stringify(doc.data().payload).substring(0, 200));
  });
}
checkEvents();
