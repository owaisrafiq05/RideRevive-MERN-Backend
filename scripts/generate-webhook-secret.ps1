# Check if Stripe CLI is installed
$stripeExists = Get-Command stripe -ErrorAction SilentlyContinue
if (-not $stripeExists) {
    Write-Host "Stripe CLI is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "https://stripe.com/docs/stripe-cli" -ForegroundColor Yellow
    exit 1
}

# Check if user is logged in to Stripe CLI
try {
    $whoami = Invoke-Expression "stripe whoami" 2>&1
    if ($whoami -match "error") {
        throw "Not logged in"
    }
} catch {
    Write-Host "You are not logged in to Stripe CLI. Please login first:" -ForegroundColor Red
    Write-Host "stripe login" -ForegroundColor Yellow
    exit 1
}

Write-Host "Starting Stripe webhook listener..." -ForegroundColor Green
Write-Host "This will generate a webhook signing secret that you should add to your .env file." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop after you've copied the webhook secret." -ForegroundColor Cyan
Write-Host ""
Write-Host "Events will be forwarded to http://localhost:3000/api/orders/webhook" -ForegroundColor White
Write-Host ""

# Start Stripe listener and forward to localhost
Invoke-Expression "stripe listen --forward-to http://localhost:3000/api/orders/webhook"

Write-Host ""
Write-Host "Please copy the webhook signing secret and add it to your .env file as STRIPE_WEBHOOK_SECRET" -ForegroundColor Yellow 