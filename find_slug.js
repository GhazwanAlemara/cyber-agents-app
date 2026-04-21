const https = require('https');

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve(res.statusCode);
    }).on('error', (e) => {
      resolve(500);
    });
  });
}

async function findSlug() {
  const commonSlugs = [
    "cyber-agents-app",
    "cyberagents-app",
    "cyber-agents",
    "cyberagents",
    "cyber-agents-sec",
    "cyberagents-sec",
    "cyberagents-app-2026",
    "aegis-core",
    "aegiscore"
  ];
  
  console.log("Searching for the correct GitHub App slug...");
  
  for (const slug of commonSlugs) {
    const url = `https://github.com/apps/${slug}/installations/new`;
    const status = await checkUrl(url);
    console.log(`Trying: ${slug} -> Status: ${status}`);
    if (status === 200 || status === 302) {
      console.log(`\n✅ FOUND IT! The correct slug is: ${slug}`);
      process.exit(0);
    }
  }
  
  console.log("\n❌ Could not find the slug. Please provide it manually.");
}

findSlug();
