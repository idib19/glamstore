// Email service for appointment notifications
// This is a mock implementation - in production, you would use a real email service like SendGrid, Mailgun, etc.

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface AppointmentEmailData {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  price: number;
  appointmentId: string;
}

interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  orderTotal: number;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  shippingAddress: string;
}

export const emailService = {
  // Send appointment confirmation email
  sendAppointmentConfirmation: async (data: AppointmentEmailData) => {
    const emailData: EmailData = {
      to: data.customerEmail,
      subject: 'Confirmation de votre rendez-vous - Queen&apos;s Glam',
      html: generateAppointmentConfirmationHTML(data),
      text: generateAppointmentConfirmationText(data)
    };

    return await sendEmail(emailData);
  },

  // Send appointment reminder email
  sendAppointmentReminder: async (data: AppointmentEmailData) => {
    const emailData: EmailData = {
      to: data.customerEmail,
      subject: 'Rappel de votre rendez-vous - Queen&apos;s Glam',
      html: generateAppointmentReminderHTML(data),
      text: generateAppointmentReminderText(data)
    };

    return await sendEmail(emailData);
  },

  // Send appointment cancellation email
  sendAppointmentCancellation: async (data: AppointmentEmailData) => {
    const emailData: EmailData = {
      to: data.customerEmail,
      subject: 'Annulation de votre rendez-vous - Queen&apos;s Glam',
      html: generateAppointmentCancellationHTML(data),
      text: generateAppointmentCancellationText(data)
    };

    return await sendEmail(emailData);
  },

  // Send order confirmation email
  sendOrderConfirmation: async (data: OrderEmailData) => {
    const emailData: EmailData = {
      to: data.customerEmail,
      subject: 'Confirmation de votre commande - Queen&apos;s Glam',
      html: generateOrderConfirmationHTML(data),
      text: generateOrderConfirmationText(data)
    };

    return await sendEmail(emailData);
  }
};

// Mock email sending function
const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    // In production, this would call your email service API
    console.log('Sending email:', {
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html.substring(0, 100) + '...'
    });

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For now, we'll just log the email and return success
    // In production, you would integrate with a real email service
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// HTML email templates
const generateAppointmentConfirmationHTML = (data: AppointmentEmailData): string => {
  const formattedDate = new Date(data.appointmentDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirmation de rendez-vous</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FF69B4, #C71585); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .btn { display: inline-block; background: #FF69B4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✨ Rendez-vous Confirmé !</h1>
          <p>Queen&apos;s Glam - Votre moment beauté</p>
        </div>
        
        <div class="content">
          <p>Bonjour ${data.customerName},</p>
          
          <p>Nous sommes ravis de confirmer votre rendez-vous chez Queen&apos;s Glam !</p>
          
          <div class="appointment-details">
            <h3>📅 Détails de votre rendez-vous</h3>
            <div class="detail-row">
              <strong>Service :</strong>
              <span>${data.serviceName}</span>
            </div>
            <div class="detail-row">
              <strong>Date :</strong>
              <span>${formattedDate}</span>
            </div>
            <div class="detail-row">
              <strong>Heure :</strong>
              <span>${data.appointmentTime}</span>
            </div>
            <div class="detail-row">
              <strong>Durée :</strong>
              <span>${data.duration} minutes</span>
            </div>
            <div class="detail-row">
              <strong>Prix :</strong>
              <span>${data.price}€</span>
            </div>
            <div class="detail-row">
              <strong>Numéro de RDV :</strong>
              <span>#${data.appointmentId.slice(0, 8)}</span>
            </div>
          </div>
          
          <p><strong>📍 Adresse :</strong> Queen&apos;s Glam, Gatineau (adresse précise communiquée par SMS)</p>
          
          <p><strong>📱 Contact :</strong> Pour toute modification ou question, contactez-nous par téléphone ou email.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="/rendez-vous/mes-rendez-vous" class="btn">Voir mes rendez-vous</a>
          </div>
          
          <p>Nous avons hâte de vous accueillir pour votre moment glam !</p>
          
          <p>Cordialement,<br>L&apos;équipe Queen&apos;s Glam</p>
        </div>
        
        <div class="footer">
          <p>Queen&apos;s Glam - Votre institut de beauté à Gatineau</p>
          <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateAppointmentReminderHTML = (data: AppointmentEmailData): string => {
  const formattedDate = new Date(data.appointmentDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Rappel de rendez-vous</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FFB6C1, #FF69B4); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .reminder-box { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Rappel de rendez-vous</h1>
          <p>Queen&apos;s Glam - Votre moment beauté</p>
        </div>
        
        <div class="content">
          <p>Bonjour ${data.customerName},</p>
          
          <div class="reminder-box">
            <h3>🔔 Rappel : Votre rendez-vous est demain !</h3>
            <p><strong>Service :</strong> ${data.serviceName}</p>
            <p><strong>Date :</strong> ${formattedDate}</p>
            <p><strong>Heure :</strong> ${data.appointmentTime}</p>
          </div>
          
          <p>Nous vous attendons avec impatience !</p>
          
          <p>Cordialement,<br>L&apos;équipe Queen&apos;s Glam</p>
        </div>
        
        <div class="footer">
          <p>Queen&apos;s Glam - Votre institut de beauté à Gatineau</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateAppointmentCancellationHTML = (data: AppointmentEmailData): string => {
  const formattedDate = new Date(data.appointmentDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Annulation de rendez-vous</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b6b, #ee5a52); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .cancellation-box { background: #ffe6e6; border: 1px solid #ffcccc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>❌ Annulation de rendez-vous</h1>
          <p>Queen&apos;s Glam</p>
        </div>
        
        <div class="content">
          <p>Bonjour ${data.customerName},</p>
          
          <div class="cancellation-box">
            <h3>Votre rendez-vous a été annulé</h3>
            <p><strong>Service :</strong> ${data.serviceName}</p>
            <p><strong>Date :</strong> ${formattedDate}</p>
            <p><strong>Heure :</strong> ${data.appointmentTime}</p>
          </div>
          
          <p>Nous espérons vous revoir bientôt !</p>
          
          <p>Cordialement,<br>L&apos;équipe Queen&apos;s Glam</p>
        </div>
        
        <div class="footer">
          <p>Queen&apos;s Glam - Votre institut de beauté à Gatineau</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Plain text versions for email clients that don't support HTML
const generateAppointmentConfirmationText = (data: AppointmentEmailData): string => {
  const formattedDate = new Date(data.appointmentDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
Confirmation de votre rendez-vous - Queen&apos;s Glam

Bonjour ${data.customerName},

Nous sommes ravis de confirmer votre rendez-vous chez Queen&apos;s Glam !

Détails de votre rendez-vous :
- Service : ${data.serviceName}
- Date : ${formattedDate}
- Heure : ${data.appointmentTime}
- Durée : ${data.duration} minutes
- Prix : ${data.price}€
- Numéro de RDV : #${data.appointmentId.slice(0, 8)}

Adresse : Queen&apos;s Glam, Gatineau (adresse précise communiquée par SMS)

Pour toute modification ou question, contactez-nous par téléphone ou email.

Nous avons hâte de vous accueillir pour votre moment glam !

Cordialement,
L&apos;équipe Queen&apos;s Glam
  `;
};

const generateAppointmentReminderText = (data: AppointmentEmailData): string => {
  const formattedDate = new Date(data.appointmentDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
Rappel de votre rendez-vous - Queen&apos;s Glam

Bonjour ${data.customerName},

Rappel : Votre rendez-vous est demain !

- Service : ${data.serviceName}
- Date : ${formattedDate}
- Heure : ${data.appointmentTime}

Nous vous attendons avec impatience !

Cordialement,
L&apos;équipe Queen&apos;s Glam
  `;
};

const generateAppointmentCancellationText = (data: AppointmentEmailData): string => {
  const formattedDate = new Date(data.appointmentDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
Annulation de votre rendez-vous - Queen&apos;s Glam

Bonjour ${data.customerName},

Votre rendez-vous a été annulé :

- Service : ${data.serviceName}
- Date : ${formattedDate}
- Heure : ${data.appointmentTime}

Nous espérons vous revoir bientôt !

Cordialement,
L&apos;équipe Queen&apos;s Glam
  `;
};

const generateOrderConfirmationHTML = (data: OrderEmailData): string => {
  const orderItemsHTML = data.orderItems.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toFixed(2)}€</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.total.toFixed(2)}€</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirmation de commande</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FF69B4, #C71585); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .order-table th { background: #f8f9fa; padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6; }
        .order-table td { padding: 10px; border-bottom: 1px solid #eee; }
        .total-row { font-weight: bold; background: #f8f9fa; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .btn { display: inline-block; background: #FF69B4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✨ Commande Confirmée !</h1>
          <p>Queen&apos;s Glam - Votre moment beauté</p>
        </div>
        
        <div class="content">
          <p>Bonjour ${data.customerName},</p>
          
          <p>Nous sommes ravis de confirmer votre commande chez Queen&apos;s Glam !</p>
          
          <div class="order-details">
            <h3>📦 Détails de votre commande</h3>
            <p><strong>Numéro de commande :</strong> #${data.orderNumber}</p>
            <p><strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
            
            <table class="order-table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th style="text-align: center;">Quantité</th>
                  <th style="text-align: right;">Prix unitaire</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderItemsHTML}
                <tr class="total-row">
                  <td colspan="3" style="text-align: right; padding: 15px;"><strong>Total</strong></td>
                  <td style="text-align: right; padding: 15px;"><strong>${data.orderTotal.toFixed(2)}€</strong></td>
                </tr>
              </tbody>
            </table>
            
            <p><strong>Adresse de livraison :</strong></p>
            <p style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 10px 0;">${data.shippingAddress}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="/panier" class="btn">Suivre ma commande</a>
          </div>
          
          <p>Nous vous remercions pour votre confiance !</p>
          
          <p>Cordialement,<br>L&apos;équipe Queen&apos;s Glam</p>
        </div>
        
        <div class="footer">
          <p>Queen&apos;s Glam - Votre institut de beauté à Gatineau</p>
          <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateOrderConfirmationText = (data: OrderEmailData): string => {
  const orderItemsText = data.orderItems.map(item => 
    `- ${item.name} (x${item.quantity}) - ${item.total.toFixed(2)}€`
  ).join('\n');

  return `
Confirmation de votre commande - Queen&apos;s Glam

Bonjour ${data.customerName},

Nous sommes ravis de confirmer votre commande chez Queen&apos;s Glam !

Détails de votre commande :
- Numéro de commande : #${data.orderNumber}
- Date : ${new Date().toLocaleDateString('fr-FR')}

Articles commandés :
${orderItemsText}

Total : ${data.orderTotal.toFixed(2)}€

Adresse de livraison :
${data.shippingAddress}

Nous vous remercions pour votre confiance !

Cordialement,
L&apos;équipe Queen&apos;s Glam
  `;
}; 