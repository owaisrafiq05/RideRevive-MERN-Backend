import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Send an order confirmation email to the customer
 * @param {Object} order - The order object with populated user, car, and service information
 * @returns {Promise} - A promise that resolves when the email is sent
 */
export const sendOrderApprovedEmail = async (order) => {
  if (!order || !order.user || !order.user.email) {
    throw new Error('Order or user email not provided');
  }

  const formatCurrency = (amount) => {
    return parseFloat(amount).toFixed(2);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Generate HTML for services table
  const servicesHtml = order.services.map(service => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #EEE;">${service.serviceName}</td>
      <td style="padding: 12px; border-bottom: 1px solid #EEE; text-align: right;">$${formatCurrency(service.price)}</td>
    </tr>
  `).join('');

  // Generate address information
  const addressInfo = order.address && order.address.fullAddress 
    ? `<p style="margin: 0; color: #555; line-height: 1.5;">Delivery Address: ${order.address.fullAddress}</p>` 
    : '';

  // Generate vehicle information
  const vehicleInfo = order.car 
    ? `<p style="margin: 0; color: #555; line-height: 1.5;">Vehicle: ${order.car.year} ${order.car.make} ${order.car.model} (${order.car.licensePlate || 'No plate'})</p>` 
    : '';

  // Create the email HTML
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your Order Has Been Approved</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #F59E0B; margin-bottom: 10px;">Order Approved</h1>
        <p style="font-size: 16px; color: #666;">Your order has been approved and is being processed.</p>
      </div>

      <div style="background-color: #F9FAFB; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-top: 0; border-bottom: 1px solid #E5E7EB; padding-bottom: 10px;">Order Details</h2>
        <p style="margin: 0; color: #555; line-height: 1.5;">Order ID: <strong>${order._id}</strong></p>
        <p style="margin: 0; color: #555; line-height: 1.5;">Date: ${formatDate(order.createdAt)}</p>
        <p style="margin: 0; color: #555; line-height: 1.5;">Scheduled Date: ${formatDate(order.scheduledDate)}</p>
        <p style="margin: 0; color: #555; line-height: 1.5;">Status: <span style="color: #10B981; font-weight: bold;">Approved</span></p>
        ${vehicleInfo}
        ${addressInfo}
      </div>

      <div style="margin-bottom: 20px;">
        <h2 style="color: #333; margin-top: 0; border-bottom: 1px solid #E5E7EB; padding-bottom: 10px;">Invoice</h2>
        
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #F3F4F6;">
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #E5E7EB;">Service</th>
              <th style="padding: 12px; text-align: right; border-bottom: 1px solid #E5E7EB;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${servicesHtml}
          </tbody>
          <tfoot>
            <tr style="background-color: #F9FAFB;">
              <td style="padding: 12px; border-top: 2px solid #E5E7EB; font-weight: bold;">Total</td>
              <td style="padding: 12px; border-top: 2px solid #E5E7EB; text-align: right; font-weight: bold;">$${formatCurrency(order.totalAmount)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style="background-color: #F9FAFB; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-top: 0; border-bottom: 1px solid #E5E7EB; padding-bottom: 10px;">Payment Information</h2>
        <p style="margin: 0; color: #555; line-height: 1.5;">Payment Method: ${order.paymentMethod.replace('_', ' ').toUpperCase()}</p>
        <p style="margin: 0; color: #555; line-height: 1.5;">Payment Status: ${order.paymentStatus.toUpperCase()}</p>
        ${order.paymentDetails && order.paymentDetails.transactionId ? `<p style="margin: 0; color: #555; line-height: 1.5;">Transaction ID: ${order.paymentDetails.transactionId}</p>` : ''}
      </div>

      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 14px;">
        <p>Thank you for choosing RideRevive for your vehicle services.</p>
        <p>If you have any questions about your order, please contact our support team.</p>
        <p>&copy; ${new Date().getFullYear()} RideRevive. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  // Email options
  const mailOptions = {
    from: `"RideRevive Services" <${process.env.EMAIL_USER}>`,
    to: order.user.email,
    subject: 'Your RideRevive Order Has Been Approved',
    html: emailHtml
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default { sendOrderApprovedEmail }; 