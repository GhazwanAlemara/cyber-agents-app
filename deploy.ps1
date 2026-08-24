# Deploy Script for CyberAgents Platform
Write-Host "Deploying CyberAgents Platform..." -ForegroundColor Green

# 1. Build Frontend
Write-Host "Building Frontend..." -ForegroundColor Cyan
cd frontend
npm install --silent
npm run build
cd ..

# 2. Deploy Firebase Hosting & Functions
Write-Host "Deploying Firebase Hosting & Functions..." -ForegroundColor Cyan
cd firebase-functions
npm install --silent
cd ..
firebase deploy --only "hosting,functions"

# 3. Deploy AI Engine to Google Cloud Run
Write-Host "Deploying AI Engine to Cloud Run..." -ForegroundColor Cyan
cd ai-engine
gcloud run deploy cyber-agents-ai-engine `
  --source . `
  --region us-central1 `
  --allow-unauthenticated `
  --project cyber-agents-app
cd ..

Write-Host "Deployment Complete! 🚀" -ForegroundColor Green
