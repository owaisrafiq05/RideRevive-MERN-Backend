# Stripe Integration for RideRevive

This document outlines how to set up and test the Stripe integration for the RideRevive application.

## Prerequisites

- [Stripe CLI](https://stripe.com/docs/stripe-cli) installed
- A Stripe account (you can create one for free at [stripe.com](https://stripe.com))

## Setup

1. **Create a `.env` file in the backend directory with the following variables:**

```
MONGODB_URI=mongodb://localhost:27017/riderevive
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
FRONTEND_URL=http://localhost:5173
```

2. **Create a `.env` file in the frontend directory with the following variables:**

```
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

3. **Generate a webhook secret using Stripe CLI:**

Run one of the following commands depending on your operating system:

- For Linux/Mac: 
```bash
./scripts/generate-webhook-secret.sh
```

- For Windows: 
```powershell
./scripts/generate-webhook-secret.ps1
```

This will start a webhook listener and generate a webhook signing secret. Copy this secret and add it to your backend `.env` file as `STRIPE_WEBHOOK_SECRET`.

## Testing the Integration

1. **Start the webhook listener using Stripe CLI:**

```bash
stripe listen --forward-to http://localhost:3000/api/orders/webhook
```

2. **Start both the frontend and backend servers.**

3. **Make a test payment using one of Stripe's test cards:**

- Card number: `4242 4242 4242 4242`
- Expiration date: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

4. **Monitor the webhook listener console for events.**

## Debugging

If you encounter issues with the webhook, check the following:

1. Make sure the webhook secret is correctly set in your `.env` file
2. Ensure the webhook endpoint URL is correct in the Stripe CLI command
3. Check the server logs for any errors
4. Use the Stripe CLI to trigger test events:

```bash
stripe trigger payment_intent.succeeded
```

## Stripe Testing Resources

- [Stripe Testing Documentation](https://stripe.com/docs/testing)
- [Test Card Numbers](https://stripe.com/docs/testing#cards)
- [Test Webhook Events](https://stripe.com/docs/webhooks/test)

## Useful Commands

- Check Stripe CLI version: `stripe --version`
- Login to Stripe: `stripe login`
- List available events to trigger: `stripe trigger --help`
- View recent Stripe API requests: `stripe logs tail` 