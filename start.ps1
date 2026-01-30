# start.ps1
# Script to start Travel Decision Platform
# Modes: 
# 1. Docker (Default, Backend+DB in Docker, Frontend local)
# 2. Local (No Docker, Backend local with SQLite, Frontend local)

Write-Host "--- Starting Travel Decision Platform ---" -ForegroundColor Cyan

# 1. Check prerequisites
Write-Host "[1/4] Checking prerequisites..." -ForegroundColor Yellow

$dockerRunning = $false
if (Get-Command docker -ErrorAction SilentlyContinue) {
    docker info >$null 2>&1
    if ($LASTEXITCODE -eq 0) {
        $dockerRunning = $true
    }
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js/npm is not installed or not in PATH. Please install Node.js."
    exit 1
}

# 2. Start Backend and DB
if ($dockerRunning) {
    Write-Host "[2/4] Docker detected. Starting Backend and DB in Docker..." -ForegroundColor Yellow
    docker-compose up -d db backend
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to start Docker containers. Falling back to local run..."
        $dockerRunning = $false
    }
}

if (-not $dockerRunning) {
    Write-Host "[2/4] Docker NOT running. Starting Backend locally with SQLite..." -ForegroundColor Yellow
    
    Set-Location backend
    
    # Create venv if not exists
    if (-not (Test-Path venv)) {
        Write-Host "Creating Python virtual environment..." -ForegroundColor Gray
        $pythonCmd = "python"
        if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
            if (Get-Command py -ErrorAction SilentlyContinue) { $pythonCmd = "py" }
            elseif (Get-Command python3 -ErrorAction SilentlyContinue) { $pythonCmd = "python3" }
            else { Write-Error "Python not found. Please install Python."; exit 1 }
        }
        & $pythonCmd -m venv venv
    }
    
    # Install dependencies
    Write-Host "Installing backend dependencies..." -ForegroundColor Gray
    .\venv\Scripts\pip install -r requirements.txt
    
    # Run migrations
    Write-Host "Running database migrations (SQLite)..." -ForegroundColor Gray
    # Note: We need to handle postgres-specific parts of migrations manually or make them conditional
    # For MVP simplicity, we assume migrations are mostly compatible or the user will fix them.
    $env:DATABASE_URL = "sqlite:///./travel_decision.db"
    .\venv\Scripts\alembic upgrade head
    
    # Seed data
    Write-Host "Seeding data..." -ForegroundColor Gray
    .\venv\Scripts\python seed.py
    
    # Start backend in background
    Write-Host "Starting Backend API..." -ForegroundColor Gray
    Start-Process -FilePath ".\venv\Scripts\python.exe" -ArgumentList "-m uvicorn app.main:app --host 0.0.0.0 --port 8000" -NoNewWindow
    
    Set-Location ..
}

# 3. Setup Frontend
Write-Host "[3/4] Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to install frontend dependencies."
    Set-Location ..
    exit $LASTEXITCODE
}

# 4. Start Frontend
Write-Host "[4/4] Starting Frontend locally..." -ForegroundColor Yellow
Write-Host "Frontend will be available at http://localhost:3000" -ForegroundColor Green
Write-Host "Backend API is running at http://localhost:8000" -ForegroundColor Green

# Set environment variables for local run (both Client and Server side)
$env:NEXT_PUBLIC_API_URL = "http://localhost:8000"
$env:API_URL = "http://localhost:8000"

npm run dev
