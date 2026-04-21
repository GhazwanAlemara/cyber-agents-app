const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

admin.initializeApp();

exports.githubWebhook = onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  // TODO: Verify GitHub Webhook signature
  const event = req.headers["x-github-event"];
  logger.info(`Received GitHub event: ${event}`);

  try {
    const payload = req.body;
    
    // Log the event in Firestore for the AI engine to pick up or for dashboard display
    await admin.firestore().collection("github_events").add({
      event_type: event,
      payload: payload,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      processed: false
    });

    res.status(200).send("Event recorded");
  } catch (error) {
    logger.error("Error processing webhook", error);
    res.status(500).send("Internal Server Error");
  }
});
