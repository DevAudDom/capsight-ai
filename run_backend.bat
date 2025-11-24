@echo off
REM Simple launcher for CapsightAI FastAPI backend
REM Usage: double-click or run from cmd within repo root

SETLOCAL ENABLEDELAYEDEXPANSION

REM Detect Backend directory
SET BACKEND_DIR=%~dp0Backend
IF NOT EXIST "%BACKEND_DIR%" (
  echo [error] Backend directory not found at %BACKEND_DIR%
  exit /b 1
)

REM Check virtual environment
IF NOT EXIST "%BACKEND_DIR%\.venv\Scripts\activate.bat" (
  echo [info] Python venv not found. Creating one...
  pushd "%BACKEND_DIR%"
  python -m venv .venv || (
    echo [error] Failed to create virtual environment.
    popd
    exit /b 1
  )
  popd
)

REM Activate venv
CALL "%BACKEND_DIR%\.venv\Scripts\activate.bat"

REM Install requirements if uvicorn not present
WHERE uvicorn >NUL 2>&1
IF ERRORLEVEL 1 (
  echo [info] Installing backend requirements...
  pip install --upgrade pip
  pip install -r "%BACKEND_DIR%\requirements.txt" || (
    echo [error] Failed to install requirements.
    exit /b 1
  )
)

REM Start server
pushd "%BACKEND_DIR%"
ECHO [start] uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
popd

ENDLOCAL
