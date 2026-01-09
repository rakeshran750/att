# Manual Vite Installation Script
# This script downloads and installs Vite manually to bypass SSL issues

Write-Host "=== Manual Vite Installation ===" -ForegroundColor Cyan
Write-Host "`nThis script will help you install Vite manually" -ForegroundColor Yellow

$viteVersion = "5.4.21"
$nodeModulesPath = ".\node_modules\vite"
$viteBinPath = "$nodeModulesPath\bin\vite.js"

# Check if vite already exists
if (Test-Path $viteBinPath) {
    Write-Host "`nVite is already installed!" -ForegroundColor Green
    exit 0
}

Write-Host "`nVite is not installed. Please follow these steps:" -ForegroundColor Red
Write-Host "`n1. Update Node.js to latest LTS from: https://nodejs.org/" -ForegroundColor Yellow
Write-Host "2. After updating Node.js, run: npm install" -ForegroundColor Yellow
Write-Host "`nOR" -ForegroundColor Yellow
Write-Host "`n3. Try using a different terminal (Command Prompt instead of PowerShell)" -ForegroundColor Yellow
Write-Host "4. Or restart your computer and try again" -ForegroundColor Yellow

Write-Host "`nThe SSL cipher error indicates Node.js OpenSSL needs to be updated." -ForegroundColor Red
Write-Host "Updating Node.js is the recommended solution." -ForegroundColor Green



