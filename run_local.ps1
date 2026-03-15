# ClariWeaveAI Local Startup Script
# This will start both the backend and frontend for local testing.

# Load GEMINI_API_KEY from .env file if it exists
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^([^#][^=]*)=(.*)$") {
            [System.Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), "Process")
        }
    }
    Write-Host "Loaded environment variables from .env"
}

# Start Backend (in new window) on port 8082 (matches useAudioStream.ts dev config)
Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$PWD'; `$env:GEMINI_API_KEY='$env:GEMINI_API_KEY'; uvicorn backend.app.main:app --host 0.0.0.0 --port 8082`""

# Start Frontend (in new window)
Start-Process powershell -ArgumentList "-NoExit -Command 'cd frontend; npm run dev'"

Write-Host "ClariWeaveAI is starting..."
Write-Host "Backend: http://localhost:8082"
Write-Host "Frontend: Check the output of the npm window (usually http://localhost:5173)"
