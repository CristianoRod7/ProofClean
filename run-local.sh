#!/usr/bin/env bash
set -euo pipefail

cat <<'INFO'
ProofClean local run helper

Backend:
  cd backend
  python -m venv venv
  source venv/bin/activate
  pip install -r requirements.txt
  uvicorn main:app --reload --port 8080

Frontend (new terminal):
  cd frontend
  npm install
  npm run dev

URLs:
  Frontend:     http://localhost:5173
  Backend:      http://localhost:8080
  API docs:     http://localhost:8080/docs
  Health check: http://localhost:8080/api/health
INFO
