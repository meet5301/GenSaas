# GenSaas - Google Cloud Deployment Guide

This repository contains a full-stack **FastAPI Backend** and **React Frontend (Vite)** for **GenSaas**. Follow the steps below to deploy your application to **Google Cloud Run**.

---

## Prerequisites

1. **Google Cloud SDK (`gcloud` CLI)** installed on your machine.
   - Install from: [https://cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)
2. A **Google Cloud Project** created with billing enabled.
3. Authenticate `gcloud`:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

---

## Step 1: Deploy Backend to Google Cloud Run

1. Open terminal in `Saas-main/backend`.
2. Run the deployment command (which builds the Docker container and deploys it automatically):

```bash
gcloud run deploy gensaas-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL="postgresql://neondb_owner:npg_Kb2ZFOeJS6Wj@ep-small-surf-aus4z3ay-pooler.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

3. Once deployment finishes, Google Cloud will provide a URL like:
   `https://gensaas-backend-xyz-uc.a.run.app`

   Save this backend URL for the next step.

---

## Step 2: Deploy Frontend to Google Cloud Run

1. Open terminal in `Saas-main/frontend`.
2. Deploy the frontend container passing your backend URL as an argument:

```bash
gcloud run deploy gensaas-frontend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-build-env-vars VITE_API_URL="https://gensaas-backend-xyz-uc.a.run.app"
```

3. Copy the output frontend URL (e.g. `https://gensaas-frontend-xyz-uc.a.run.app`).

---

## Alternative: Deploy Frontend to Firebase Hosting (Free & Fast)

Google's Firebase Hosting offers a free global CDN for static React sites:

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Login to Firebase:
   ```bash
   firebase login
   ```
3. In `Saas-main/frontend`, set `.env.production`:
   ```env
   VITE_API_URL=https://gensaas-backend-xyz-uc.a.run.app
   ```
4. Build and deploy:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

---

## Summary of Environment Variables

- **Backend**: `DATABASE_URL` (PostgreSQL connection string), `ALLOWED_ORIGINS` (optional list of frontend URLs).
- **Frontend**: `VITE_API_URL` (points to deployed backend URL).
