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
  
  const githubAppUrls = [
    "https://github.com/apps/cyberagents-app/installations/new",
    "https://github.com/apps/cyber-agents-app/installations/new"
  ];
  const webAppUrl = "https://cyberagents.app";
  
  for (const url of githubAppUrls) {
    const status = await checkUrl(url);
    if (status === 200 || status === 302) {
      console.log(`✅ GitHub App URL is valid: ${url}`);
    } else {
      console.log(`❌ GitHub App URL failed (Status ${status}): ${url}`);
    }
  }

  const webStatus = await checkUrl(webAppUrl);
  if (webStatus === 200) {
    console.log("✅ Main website is live.");
  }

  console.log("Tests completed.");
}

runTests();
