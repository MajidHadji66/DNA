# Deployment Guide for DNA Analyzer

This guide explains how to deploy your DNA Analyzer application to Google Cloud Run.

## Project Structure Changes
To support a smooth deployment, I have organized your project into two distinct services:
- **`backend/`**: Contains the Python FastAPI application and DNA analysis logic.
- **`frontend/`**: Contains the Next.js web application.

## Prerequisites
- **Google Cloud SDK (`gcloud`)** installed and authenticated.
- A Google Cloud Project created and billing enabled.

## Step 1: Deploy the Backend
The backend Service handles the DNA analysis logic.

1. Open your terminal and navigate to the `backend` directory:
   ```powershell
   cd backend
   ```

2. Deploy to Cloud Run:
   ```powershell
   gcloud run deploy dna-api --source . --region us-central1 --allow-unauthenticated
   ```
   *Note: If prompted to enable APIs (like Artifact Registry or Cloud Run), answer 'y'.*

3. **Copy the URL** provided in the output (e.g., `https://dna-api-luc4...run.app`). You will need this for the next step.

## Step 2: Deploy the Frontend
The frontend Service serves the UI and proxies requests to the backend.

1. Navigate to the `frontend` directory:
   ```powershell
   cd ../frontend
   ```

2. Deploy to Cloud Run, replacing `<BACKEND_URL>` with the URL you copied in Step 1:
   ```powershell
   gcloud run deploy dna-frontend --source . --region us-central1 --allow-unauthenticated --set-env-vars BACKEND_URL=<BACKEND_URL>
   ```
   *Example:*
   `... --set-env-vars BACKEND_URL=https://dna-api-xyz.a.run.app`

## Step 3: Access the App
Once the frontend deployment finishes, Google Cloud will provide a URL (e.g., `https://dna-frontend-xyz.a.run.app`). Open this URL in your browser to use your application.

---
### Local Development (Optional)
To run locally, you can use the helper script I created:
```powershell
.\start-dev.ps1
```
This script handles installing dependencies and starting both servers for you.
