# GenSaas security and deployment notes

## Changes in this handoff

- Removed startup behavior that reset a Super Admin password to a known hardcoded value.
- Removed automatic creation of demo stores, users, and sales from backend startup. Existing database records are not deleted by this change.
- Added optional administrator bootstrap through environment variables; it runs only when no Super Admin exists and requires a 14-character password.
- Removed the legacy login aliases that mapped known email/phone values to the first Super Admin account.
- Removed the permissive wildcard CORS origin regex. Production CORS origins must be explicitly configured with `ALLOWED_ORIGINS`.
- Removed the fallback JWT signing secret. The backend now refuses to start if `SECRET_KEY` is missing or too short.
- Removed the client-side role-switch dropdown from the main navigation; UI selection is not an authorization mechanism.
- Added environment examples without credentials or customer data.

## Required before production

1. Set a new, unique `SECRET_KEY` (at least 32 characters) in the deployment secret manager. Rotate any key that was ever committed or shared.
2. Set `ENVIRONMENT=production` and `ALLOWED_ORIGINS` to only the exact HTTPS frontend origin(s).
3. Use a managed database such as PostgreSQL for multi-worker production deployments; SQLite is intended for local/single-process use.
4. Remove any previously seeded demo/test users and reset passwords for any accounts created with old known credentials. Review the live database manually before deleting records.
5. Review every `/api/stores/{store_id}/...` route for authenticated store ownership and role authorization. Several legacy store CRUD routes still need an authorization migration before this app should be considered production-secure. Do not expose this API publicly until that review is complete.
6. Review OTP and refresh-token storage/rotation, backup/restore authorization, AI endpoint rate limits, audit logging, dependency vulnerabilities, and database backups.
7. Run tests against a staging copy, including cross-store isolation and role escalation attempts, before deploying.

## Local setup

- Copy `backend/.env.example` to `backend/.env`, generate a unique `SECRET_KEY`, and fill in local values.
- Copy `frontend/.env.example` to `frontend/.env` if needed.
- Never commit `.env`, SQLite databases, backups, or real customer data.

This document is not a claim that the application has passed a complete security audit. The remaining authorization work must be completed and tested before production use.

## Additional cleanup in this redesign

- Added IP-based rate limits to the AI prompt preview and store-generation endpoints.
- Removed an unused demo seeding script that contained a predictable password and personal sample data.
- Replaced a local-only contact form that claimed to send an inquiry without submitting it to a backend with a clear store-creation call to action.
- Removed unsupported public pricing claims and fabricated rating structured data from the page metadata.
- Redacted database credentials from deployment instructions. Because the original archive included a live-looking database connection string and a backend `.env` file, rotate any database password, API key, or signing secret that may have been shared in that archive.
- Removed fixed OTP verification bypasses from production behavior; test codes are accepted only when `ENVIRONMENT` is not `production`.
- Generated OTPs use a cryptographically secure random generator, are stored as SHA-256 digests, are not written to logs, and are not returned to production clients. OTP verification is rate-limited, and signup checks expiry and consumes a verified OTP.
