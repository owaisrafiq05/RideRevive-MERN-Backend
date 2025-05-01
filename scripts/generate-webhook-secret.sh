#!/bin/bash

# Check if Stripe CLI is installed
if ! command -v stripe &> /dev/null; then
  echo "Stripe CLI is not installed. Please install it first:"
  echo "https://stripe.com/docs/stripe-cli"
  exit 1
fi

# Check if user is logged in to Stripe CLI
stripe whoami &> /dev/null
if [ $? -ne 0 ]; then
  echo "You are not logged in to Stripe CLI. Please login first:"
  echo "stripe login"
  exit 1
fi

echo "Starting Stripe webhook listener..."
echo "This will generate a webhook signing secret that you should add to your .env file."
echo "Press Ctrl+C to stop after you've copied the webhook secret."
echo ""
echo "Events will be forwarded to http://localhost:3000/api/orders/webhook"
echo ""

# Start Stripe listener and forward to localhost
stripe listen --forward-to http://localhost:3000/api/orders/webhook

echo ""
echo "Please copy the webhook signing secret and add it to your .env file as STRIPE_WEBHOOK_SECRET" 