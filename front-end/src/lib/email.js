import nodemailer from 'nodemailer';
import { EMAIL_USER, EMAIL_PASS } from '$env/static/private';

// Configure your email service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// Function to send reservation notification
export async function sendReservationEmail(reservationDetails) {
  const adminEmail = 'xueqingqing2020@gmail.com'; // Your email for testing
  
  const confirmLink = `${process.env.SITE_URL || 'https://helenstudioservices.com'}/admin/confirm/${reservationDetails.id}`;
  const rejectLink = `${process.env.SITE_URL || 'https://helenstudioservices.com'}/admin/reject/${reservationDetails.id}`;
  
  const mailOptions = {
    from: EMAIL_USER,
    to: adminEmail,
    subject: `📸 New Photo Session Request: ${reservationDetails.service_type} on ${reservationDetails.event_date}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4a6fa5;">Helen Studio Photography</h1>
      <h2 style="color: #4a6fa5;"><a>helenstudiophotography.com</a></h2>
      <h2 style="color: #4a6fa5;">New Booking Request</h2>
        
        <div style="background: #f8fafd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Customer:</strong> ${reservationDetails.customer_name}</p>
          <p><strong>Email:</strong> ${reservationDetails.customer_email}</p>
          <p><strong>Service:</strong> ${reservationDetails.service_type}</p>
          <p><strong>Date:</strong> ${reservationDetails.event_date}</p>
          <p><strong>Duration:</strong> ${reservationDetails.hours} hours</p>
          <p><strong>Total:</strong> $${reservationDetails.hours * getRate(reservationDetails.service_type)}</p>
          ${reservationDetails.notes ? `<p><strong>Notes:</strong> ${reservationDetails.notes}</p>` : ''}
        </div>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${confirmLink}" style="background: #4a6fa5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-right: 10px;">
            ✅ Approve Booking
          </a>
          <a href="${rejectLink}" style="background: #d9534f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            ❌ Reject Booking
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          <em>Clicking either button will immediately update the booking system.</em>
        </p>
      </div>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    // console.log('Notification email sent');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

function getRate(serviceType) {
  const rates = { personal: 260, event: 300, commercial: 350 };
  return rates[serviceType] || 0;
}