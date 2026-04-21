# Deploy Script for CyberAgents Platform
Write-Host "Deploying CyberAgents Platform..." -ForegroundColor Green

# 1. Build Frontend
Write-Host "Building Frontend..." -ForegroundColor Cyan
cd frontend
& "G:\Other computers\My Laptop\TheCompany\Sentinel\shadow_run.ps1" "npm run build"
cd ..

# 2. Deploy Firebase Hosting & Functions
Write-Host "Deploying Firebase Hosting & Functions..." -ForegroundColor Cyan
& "C:\Users\ghazw\AppData\Roaming\npm\firebase.cmd" deploy --only hosting,functions

# 3. Deploy AI Engine to Google Cloud Run
Write-Host "Deploying AI Engine to Cloud Run..." -ForegroundColor Cyan
cd ai-engine
& "C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" run deploy cyber-agents-ai-engine `
  --source . `
  --region us-central1 `
  --allow-unauthenticated `
  --project cyber-agents-app
cd ..

Write-Host "Deployment Complete! 🚀" -ForegroundColor Green
