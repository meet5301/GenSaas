# GenSaas

GenSaas is a retail management application for Kirana and neighborhood stores. The project contains a React + TypeScript + Vite frontend and a FastAPI + SQLAlchemy backend.

Repository: [meet5301/GenSaas](https://github.com/meet5301/GenSaas)

## Project structure

- `frontend/` — React application
- `backend/` — FastAPI API and SQLAlchemy models
- `SECURITY_REVIEW.md` — security changes and remaining production requirements
- `DEPLOYMENT_GUIDE.md` and `RAILWAY_DEPLOYMENT_GUIDE.md` — deployment notes

## Frontend

From the project root:

```powershell
npm install
npm run dev
npm run build
```

The root npm workspace exposes `dev`, `build`, `lint`, and `preview` scripts so you can run them without changing into a nested folder. Configure `frontend/.env` using `frontend/.env.example` if your API is not at `http://127.0.0.1:8000`.

## Backend

Use Python 3.11 or newer, create a virtual environment, and install dependencies:

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

Edit `backend/.env` before starting the API. Set `SECRET_KEY` to a unique random value of at least 32 characters. Do not use the placeholder value. For local development, `DATABASE_URL` may be omitted to use a local SQLite file. Set `ALLOWED_ORIGINS` to your frontend origin. Then run:

```powershell
uvicorn main:app --reload --port 8000
```

Never commit `.env` files, database files, backups, or customer data.

## Production note

Do not deploy until the remaining store-level authorization items in `SECURITY_REVIEW.md` have been addressed and tested. For a multi-worker production deployment, use a managed database such as PostgreSQL and configure exact HTTPS origins and secret values in the deployment platform.
