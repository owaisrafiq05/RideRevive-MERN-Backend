# Email Notification Setup for RideRevive

This document explains how to set up email notifications for the RideRevive application.

## Overview

RideRevive sends email notifications to customers when their orders are approved. The email includes:
- Order details
- Invoice with services and pricing
- Delivery address and vehicle information
- Payment details

## Environment Variables

To enable email functionality, you need to set the following environment variables in a `.env` file in the project root:

```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Setting Up Gmail for Sending Emails

1. **Create or use an existing Gmail account**
   This will be the sender account for all notifications.

2. **Generate an App Password**
   - Go to your Google Account settings > Security
   - Enable 2-Step Verification if not already enabled
   - Go to "App passwords" (under "Signing in to Google")
   - Select "Mail" as the app and "Other" as the device
   - Enter "RideRevive" as the name
   - Click "Generate"
   - Copy the 16-character password that appears

3. **Add to Environment Variables**
   - Create or edit your `.env` file in the project root
   - Add the following lines:
     ```
     EMAIL_USER=your_gmail_address@gmail.com
     EMAIL_PASS=your_16_character_app_password
     ```

## Testing Email Functionality

You can test if the email functionality is working by:

1. Starting the backend server
2. Creating an order through the frontend
3. Going to the admin panel
4. Changing the order status to "approved"

The system will send an email to the user associated with the order.

## Troubleshooting

If emails are not being sent:

1. Check the console for error messages
2. Verify your environment variables are correctly set
3. Ensure the Gmail account allows less secure apps (if using a regular password)
4. Confirm the user's email address is valid and correctly entered in the database
5. Check your network connection

## Note on Email Template

The email template is defined in `utils/emailService.js`. If you want to modify the design or content of the email, you can edit this file. 