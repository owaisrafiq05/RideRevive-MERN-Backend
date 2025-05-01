/**
 * Script to test the Stripe webhook with simulated events
 * 
 * Usage: 
 *   node test-webhook.js [event-type]
 * 
 * Example:
 *   node test-webhook.js checkout.session.completed
 */

import fetch from 'node-fetch';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const WEBHOOK_URL = 'http://localhost:3000/api/orders/webhook';

if (!WEBHOOK_SECRET) {
  console.error('❌ Error: STRIPE_WEBHOOK_SECRET is not set in .env file');
  process.exit(1);
}

// Get event type from command line arguments
const eventType = process.argv[2] || 'checkout.session.completed';

// Create a sample event object based on the event type
let eventPayload;

switch (eventType) {
  case 'checkout.session.completed':
    eventPayload = {
      id: `evt_${crypto.randomBytes(12).toString('hex')}`,
      object: 'event',
      api_version: '2023-10-16',
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: `cs_test_${crypto.randomBytes(12).toString('hex')}`,
          object: 'checkout.session',
          amount_total: 2500, // $25.00
          payment_intent: `pi_${crypto.randomBytes(12).toString('hex')}`,
          payment_status: 'paid',
          currency: 'usd',
          customer: `cus_${crypto.randomBytes(10).toString('hex')}`,
          metadata: {
            userId: '65f0123456789abcdef12345',
            carId: '65f0123456789abcdef12346',
            services: JSON.stringify([{
              service: '65f0123456789abcdef12347',
              price: 25.00
            }]),
            scheduledDate: new Date().toISOString(),
            specialInstructions: 'Test order from webhook simulation'
          }
        }
      },
      type: 'checkout.session.completed'
    };
    break;
    
  case 'payment_intent.succeeded':
    eventPayload = {
      id: `evt_${crypto.randomBytes(12).toString('hex')}`,
      object: 'event',
      api_version: '2023-10-16',
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: `pi_${crypto.randomBytes(12).toString('hex')}`,
          object: 'payment_intent',
          amount: 2500, // $25.00
          currency: 'usd',
          status: 'succeeded',
          customer: `cus_${crypto.randomBytes(10).toString('hex')}`,
          metadata: {
            userId: '65f0123456789abcdef12345',
            orderId: '65f0123456789abcdef12348'
          }
        }
      },
      type: 'payment_intent.succeeded'
    };
    break;
    
  case 'payment_intent.payment_failed':
    eventPayload = {
      id: `evt_${crypto.randomBytes(12).toString('hex')}`,
      object: 'event',
      api_version: '2023-10-16',
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: `pi_${crypto.randomBytes(12).toString('hex')}`,
          object: 'payment_intent',
          amount: 2500, // $25.00
          currency: 'usd',
          status: 'requires_payment_method',
          last_payment_error: {
            code: 'card_declined',
            message: 'Your card was declined.'
          },
          customer: `cus_${crypto.randomBytes(10).toString('hex')}`,
          metadata: {
            userId: '65f0123456789abcdef12345',
            orderId: '65f0123456789abcdef12348'
          }
        }
      },
      type: 'payment_intent.payment_failed'
    };
    break;
    
  default:
    console.error(`❌ Error: Unsupported event type: ${eventType}`);
    console.log('Supported event types: checkout.session.completed, payment_intent.succeeded, payment_intent.payment_failed');
    process.exit(1);
}

// Create a string representation of the payload
const payload = JSON.stringify(eventPayload);

// Generate a timestamp
const timestamp = Math.floor(Date.now() / 1000);

// Create a signed signature using the webhook secret
const signedPayload = `${timestamp}.${payload}`;
const signature = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(signedPayload)
  .digest('hex');

// Create the Stripe-Signature header
const stripeSignatureHeader = `t=${timestamp},v1=${signature}`;

// Function to send the webhook request
async function sendWebhook() {
  try {
    console.log(`🚀 Sending simulated Stripe webhook event: ${eventType}`);
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Stripe-Signature': stripeSignatureHeader
      },
      body: payload
    });
    
    if (response.ok) {
      console.log('✅ Webhook delivered successfully!');
      const responseBody = await response.text();
      console.log(`📋 Response: ${responseBody}`);
    } else {
      console.error(`❌ Webhook delivery failed with status: ${response.status}`);
      const responseBody = await response.text();
      console.error(`📋 Error response: ${responseBody}`);
    }
  } catch (error) {
    console.error('❌ Error sending webhook:', error.message);
  }
}

// Send the webhook
sendWebhook(); 