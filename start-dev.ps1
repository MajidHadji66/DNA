# Check if Node.js and Python are installed
$nodeVersion = node -v
$pythonVersion = python --version

if (!$nodeVersion) {
    Write-Host "Error: Node.js is not installed." -ForegroundColor Red
    exit 1
}
if (!$pythonVersion) {
    Write-Host "Error: Python is not installed." -ForegroundColor Red
    exit 1
}

Write-Host "Setting up Backend..." -ForegroundColor Green
cd backend
# Create venv if not exists (optional but good practice, skipping for simplicity to match user env)
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install backend requirements" -ForegroundColor Red
    exit 1
}

Write-Host "Starting Backend Server..." -ForegroundColor Green
# Start uvicorn in a new independent window
Start-Process -FilePath "uvicorn" -ArgumentList "api:app --reload --port 8000" -WorkingDirectory "$PWD"

cd ..

Write-Host "Setting up Frontend..." -ForegroundColor Green
cd frontend
if (!(Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..."
    npm install
}

Write-Host "Starting Frontend Server..." -ForegroundColor Green
npm run dev
