// THE CORE V2.5 SOVEREIGN UPGRADE
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

let db;
let collection, addDoc, serverTimestamp, doc, setDoc;

async function getDB() {
  if (!db) {
    const core = await import("./core/db.js");
    const { getSecret } = await import("./core/v2/auth.js");
    const firestore = await import("firebase/firestore");
    collection = firestore.collection;
    addDoc = firestore.addDoc;
    serverTimestamp = firestore.serverTimestamp;
    doc = firestore.doc;
    setDoc = firestore.setDoc;
    
    // Retrieve sensitive keys from the Vault
    const apiKey = await getSecret("FB_API_KEY");

    db = core.initCoreDB({
      apiKey: apiKey,
      authDomain: process.env.FB_AUTH_DOMAIN,
      projectId: process.env.FB_PROJECT_ID,
      storageBucket: process.env.FB_STORAGE_BUCKET,
      messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
      appId: process.env.FB_APP_ID
    });
  }
  return db;
}

exports.githubWebhook = onRequest(async (req, res) => {
  // ... rest of method
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const event = req.headers["x-github-event"];
  logger.info(`Received GitHub event: ${event}`);

  try {
    const payload = req.body;
    const database = await getDB();
    
    // Imperial Telemetry
    const { trackRequest } = await import("./core/v2/telemetry.js");
    await trackRequest(database, req, process.env.FB_PROJECT_ID || 'cyber-agents');
    
    await addDoc(collection(database, "github_events"), {
      event_type: event,
      payload: payload,
      timestamp: serverTimestamp(),
      processed: false
    });

    res.status(200).send("Event recorded");
  } catch (error) {
    logger.error("Error processing webhook", error);
    res.status(500).send("Internal Server Error");
  }
});

exports.stripeWebhook = onRequest(async (req, res) => {
  const { getSecret } = await import("./core/v2/auth.js");
  const stripeKey = await getSecret("STRIPE_SECRET_KEY");
  const webhookSecret = await getSecret("STRIPE_WEBHOOK_SECRET");
  const stripe = require("stripe")(stripeKey);
  
  const sig = req.headers["stripe-signature"];
  
  let event;
  try {
    // For signature verification, we need the raw body
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    logger.error(`Webhook signature verification failed: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const customerId = session.customer;

    // Imperial Telemetry
    try {
      const database = await getDB();
      const { trackRequest } = await import("./core/v2/telemetry.js");
      await trackRequest(database, req, process.env.FB_PROJECT_ID || 'cyber-agents');
    } catch(e) { logger.warn("Telemetry failed", e); }

    if (userId) {
      logger.info(`Upgrading user ${userId} to Pro plan. Customer ID: ${customerId}`);
      try {
        const database = await getDB();
        await setDoc(doc(database, "users", userId), {
          plan: "pro",
          stripeCustomerId: customerId,
          subscriptionStatus: "active",
          updatedAt: serverTimestamp()
        }, { merge: true });
        logger.info(`Successfully upgraded user ${userId} to Pro.`);
      } catch (dbError) {
        logger.error(`Failed to update user ${userId} in Firestore:`, dbError);
      }
    } else {
      logger.warn(`No client_reference_id found for session ${session.id}. Cannot associate payment with user.`);
    }
  }

  res.status(200).send("Success");
});


