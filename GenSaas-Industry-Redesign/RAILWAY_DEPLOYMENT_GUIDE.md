# Deploy GenSaas to Railway (railway.com)

**Railway** is the fastest and easiest platform to deploy your FastAPI + React fullstack app.

---

## Method 1: Deploy via Railway Web Dashboard (Recommended - 2 Minutes)

1. Go to [https://railway.com](https://railway.com) and click **"Start a New Project"**.
2. Select **"Deploy from GitHub repo"** (or drag & drop your code folder).
3. **Backend Service Setup**:
   - Set Root Directory: `backend`
   - Add Environment Variable:
     - `DATABASE_URL` = your managed PostgreSQL connection string (set in Railway Variables; do not commit it)
     - `SECRET_KEY` = a unique random secret of at least 32 characters
     - `ENVIRONMENT` = `production`
     - `ALLOWED_ORIGINS` = the exact HTTPS URL of your frontend (add it after creating the frontend service)
   - Click **Deploy**. Railway will generate your backend URL (e.g. `https://gensaas-backend.up.railway.app`).

4. **Frontend Service Setup**:
   - Add a second service for `frontend`.
   - Set Root Directory: `frontend`
   - Add Environment Variable:
     - `VITE_API_URL` = (Your backend URL from step 3).
   - Click **Deploy**. Railway will generate your public website URL!

---

## Method 2: Deploy via Railway CLI in Terminal

1. Run Railway login in your terminal:
   ```bash
   npx railway login
   ```
   *(A browser page will pop up automatically. Click **Approve**).*

2. **Deploy Backend**:
   ```bash
   cd backend
   npx railway init --name gensaas-backend
   npx railway variables set DATABASE_URL="YOUR_MANAGED_POSTGRES_URL"
   npx railway variables set SECRET_KEY="YOUR_UNIQUE_RANDOM_SECRET"
   npx railway variables set ENVIRONMENT="production"
   npx railway up
   ```

3. **Deploy Frontend**:
   ```bash
   cd ../frontend
   npx railway init --name gensaas-frontend
   npx railway variables set VITE_API_URL="https://YOUR-BACKEND-URL.up.railway.app"
   npx railway up
   # Then set ALLOWED_ORIGINS on the backend service to the exact frontend HTTPS URL.
   ```
