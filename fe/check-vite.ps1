# Check if Vite is running
Write-Host "Checking if Vite is running..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

$port = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port) {
    Write-Host "`n✓ SUCCESS! Vite is running on port 3000!" -ForegroundColor Green
    Write-Host "`nOpen http://localhost:3000 in your browser" -ForegroundColor Cyan
} else {
    Write-Host "`n✗ Vite is not running" -ForegroundColor Red
    Write-Host "`nThe SSL error is blocking the download." -ForegroundColor Yellow
    Write-Host "You MUST update Node.js to fix this." -ForegroundColor Red
    Write-Host "`nDownload from: https://nodejs.org/" -ForegroundColor Cyan
}



