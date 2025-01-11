import nodemailer from 'nodemailer';
import { CheckoutFormData } from '@/components/Checkout/CheckoutForm';

interface SendOrderEmailProps {
    pdfBuffer: Buffer;
    customerInfo: CheckoutFormData;
    orderNumber: string;
}

export const sendOrderEmail = async ({
    pdfBuffer,
    customerInfo,
    orderNumber
}: SendOrderEmailProps): Promise<void> => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const emailStyle = `
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      h1, h2, h3 { color: #2c3e50; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .info { background-color: #f8f9fa; padding: 15px; border-radius: 5px; }
    </style>
  `;

    try {
        // Email to owner
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: 'toushikahmmed@gmail.com',
            subject: `Neue Bestellung #${orderNumber}`,
            html: `
        ${emailStyle}
        <div class="container">
          <h1>Neue Bestellung eingegangen</h1>
          <p><strong>Bestellnummer:</strong> ${orderNumber}</p>
          <h2>Kundeninformationen:</h2>
          <div class="info">
            <p>
              <strong>Name:</strong> ${customerInfo.firstName} ${customerInfo.lastName}<br>
              <strong>Email:</strong> ${customerInfo.email}<br>
              <strong>Telefon:</strong> ${customerInfo.phone}<br>
              <strong>Adresse:</strong> ${customerInfo.address}<br>
              ${customerInfo.postalCode} ${customerInfo.city}
            </p>
          </div>
        </div>
      `,
            attachments: [{
                filename: `Bestellung-${orderNumber}.pdf`,
                content: pdfBuffer
            }]
        });

        // Email to customer
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: customerInfo.email,
            subject: `Ihre Bestellung #${orderNumber} bei Grindel Restaurant`,
            html: `
        ${emailStyle}
        <div class="container">
          <h1>Vielen Dank für Ihre Bestellung!</h1>
          <p><strong>Ihre Bestellnummer:</strong> ${orderNumber}</p>
          <div class="info">
            <p>Wir haben Ihre Bestellung erhalten und werden sie schnellstmöglich bearbeiten.</p>
            <p>Eine Zusammenfassung Ihrer Bestellung finden Sie im angehängten PDF-Dokument.</p>
          </div>
          <p>Bei Fragen kontaktieren Sie uns bitte unter: <a href="mailto:info@grindel-restaurant.de">info@grindel-restaurant.de</a></p>
        </div>
      `,
            attachments: [{
                filename: `Bestellung-${orderNumber}.pdf`,
                content: pdfBuffer
            }]
        });

        console.log(`Order emails sent successfully for order #${orderNumber}`);
    } catch (error) {
        console.error(`Error sending order emails for order #${orderNumber}:`, error);
        throw new Error('Failed to send order emails');
    }
};

