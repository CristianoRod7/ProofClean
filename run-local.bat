@echo off
echo ProofClean local run helper
echo.
echo Backend:
echo   cd backend
echo   python -m venv venv
echo   venv\Scripts\activate
echo   pip install -r requirements.txt
echo   uvicorn main:app --reload --port 8080
echo.
echo Frontend (new terminal):
echo   cd frontend
echo   npm install
echo   npm run dev
echo.
echo URLs:
echo   Frontend:     http://localhost:5173
echo   Backend:      http://localhost:8080
echo   API docs:     http://localhost:8080/docs
echo   Health check: http://localhost:8080/api/health
