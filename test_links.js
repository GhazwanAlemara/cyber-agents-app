const https = require('https');

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      console.log(`URL: ${url} -> Status: ${res.statusCode}`);
      resolve(res.statusCode);
    }).on('error', (e) => {
      console.error(`Error checking ${url}: ${e.message}`);
      resolve(500);
    });
  });
}

async function runTests() {
  console.log("Running platform link health checks...");
  
  const githubAppUrl = "https://github.com/apps/cyber-agents-app/installations/new";
  const webAppUrl = "https://cyberagents.app";
  
  const githubStatus = await checkUrl(githubAppUrl);
  const webStatus = await checkUrl(webAppUrl);

  if (githubStatus === 404) {
    console.error("❌ GitHub App URL is returning 404. Check the app slug in GitHub settings.");
  } else if (githubStatus === 302 || githubStatus === 200) {
    console.log("✅ GitHub App URL is valid.");
  }

  if (webStatus === 200) {
    console.log("✅ Main website is live.");
  }

  console.log("Tests completed.");
}

runTests();
