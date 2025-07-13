import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend client on server side
const resend = new Resend(process.env.RESEND_API_KEY);

// Email data interfaces
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

interface AdminOrderNotificationData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderTotal: number;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  shippingAddress: string;
  orderDate: string;
}

interface AdminAppointmentNotificationData {
  appointmentId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  price: number;
}

// Send email using Resend
const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, logging email instead');
      console.log('Email would be sent:', {
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html.substring(0, 100) + '...'
      });
      return true;
    }

    const fromEmail = process.env.FROM_EMAIL || 'noreply@queensglam.com';
    
    const result = await resend.emails.send({
      from: `Queen's Glam <${fromEmail}>`,
      to: [emailData.to],
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text
    });

    console.log('Email sent successfully:', result);
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
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de rendez-vous - Queen's Glam</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background-color: #f8f9fa;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #FF69B4, #C71585); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .header h1 { 
          font-size: 28px; 
          margin-bottom: 10px;
          font-weight: 600;
        }
        .content { 
          padding: 40px 30px; 
        }
        .appointment-details { 
          background: #f8f9fa; 
          padding: 25px; 
          border-radius: 10px; 
          margin: 25px 0; 
          border-left: 4px solid #FF69B4;
        }
        .detail-row { 
          display: flex; 
          justify-content: space-between; 
          margin: 12px 0; 
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .detail-label { 
          font-weight: 600; 
          color: #495057;
        }
        .detail-value { 
          color: #2c3e50;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px 30px;
          text-align: center;
          color: #6c757d;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Confirmation de Rendez-vous</h1>
          <p>Queen's Glam</p>
        </div>
        <div class="content">
          <p>Bonjour ${data.customerName},</p>
          <p>Nous confirmons votre rendez-vous pour le service suivant :</p>
          
          <div class="appointment-details">
            <div class="detail-row">
              <span class="detail-label">Service :</span>
              <span class="detail-value">${data.serviceName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date :</span>
              <span class="detail-value">${formattedDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Heure :</span>
              <span class="detail-value">${data.appointmentTime}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Durée :</span>
              <span class="detail-value">${data.duration} minutes</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Prix :</span>
              <span class="detail-value">${data.price} CAD</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">ID Rendez-vous :</span>
              <span class="detail-value">${data.appointmentId}</span>
            </div>
          </div>
          
          <p>Merci de votre confiance. À bientôt !</p>
        </div>
        <div class="footer">
          <p>Queen's Glam - Votre beauté, notre passion</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateOrderConfirmationHTML = (data: OrderEmailData): string => {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de commande - Queen's Glam</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background-color: #f8f9fa;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #FF69B4, #C71585); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .header h1 { 
          font-size: 28px; 
          margin-bottom: 10px;
          font-weight: 600;
        }
        .content { 
          padding: 40px 30px; 
        }
        .order-details { 
          background: #f8f9fa; 
          padding: 25px; 
          border-radius: 10px; 
          margin: 25px 0; 
          border-left: 4px solid #FF69B4;
        }
        .detail-row { 
          display: flex; 
          justify-content: space-between; 
          margin: 12px 0; 
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .detail-label { 
          font-weight: 600; 
          color: #495057;
        }
        .detail-value { 
          color: #2c3e50;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px 30px;
          text-align: center;
          color: #6c757d;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Confirmation de Commande</h1>
          <p>Queen's Glam</p>
        </div>
        <div class="content">
          <p>Bonjour ${data.customerName},</p>
          <p>Nous confirmons votre commande :</p>
          
          <div class="order-details">
            <div class="detail-row">
              <span class="detail-label">Numéro de commande :</span>
              <span class="detail-value">${data.orderNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Total :</span>
              <span class="detail-value">${data.orderTotal} CAD</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Adresse de livraison :</span>
              <span class="detail-value">${data.shippingAddress}</span>
            </div>
          </div>
          
          <p>Merci de votre commande. Notre équipe vous contactera bientôt !</p>
        </div>
        <div class="footer">
          <p>Queen's Glam - Votre beauté, notre passion</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateAdminAppointmentNotificationHTML = (data: AdminAppointmentNotificationData): string => {
  const formattedDate = new Date(data.appointmentDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nouveau rendez-vous - Queen's Glam</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background-color: #f8f9fa;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #FF69B4, #C71585); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .header h1 { 
          font-size: 28px; 
          margin-bottom: 10px;
          font-weight: 600;
        }
        .content { 
          padding: 40px 30px; 
        }
        .appointment-details { 
          background: #f8f9fa; 
          padding: 25px; 
          border-radius: 10px; 
          margin: 25px 0; 
          border-left: 4px solid #FF69B4;
        }
        .detail-row { 
          display: flex; 
          justify-content: space-between; 
          margin: 12px 0; 
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .detail-label { 
          font-weight: 600; 
          color: #495057;
        }
        .detail-value { 
          color: #2c3e50;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px 30px;
          text-align: center;
          color: #6c757d;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nouveau Rendez-vous</h1>
          <p>Queen's Glam</p>
        </div>
        <div class="content">
          <p>Un nouveau rendez-vous a été réservé :</p>
          
          <div class="appointment-details">
            <div class="detail-row">
              <span class="detail-label">ID Rendez-vous :</span>
              <span class="detail-value">${data.appointmentId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Client :</span>
              <span class="detail-value">${data.customerName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email :</span>
              <span class="detail-value">${data.customerEmail}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Téléphone :</span>
              <span class="detail-value">${data.customerPhone || 'Non fourni'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Service :</span>
              <span class="detail-value">${data.serviceName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date :</span>
              <span class="detail-value">${formattedDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Heure :</span>
              <span class="detail-value">${data.appointmentTime}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Durée :</span>
              <span class="detail-value">${data.duration} minutes</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Prix :</span>
              <span class="detail-value">${data.price} CAD</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <p>Queen's Glam - Votre beauté, notre passion</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateAdminOrderNotificationHTML = (data: AdminOrderNotificationData): string => {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nouvelle commande - Queen's Glam</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background-color: #f8f9fa;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #FF69B4, #C71585); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .header h1 { 
          font-size: 28px; 
          margin-bottom: 10px;
          font-weight: 600;
        }
        .content { 
          padding: 40px 30px; 
        }
        .order-details { 
          background: #f8f9fa; 
          padding: 25px; 
          border-radius: 10px; 
          margin: 25px 0; 
          border-left: 4px solid #FF69B4;
        }
        .detail-row { 
          display: flex; 
          justify-content: space-between; 
          margin: 12px 0; 
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .detail-label { 
          font-weight: 600; 
          color: #495057;
        }
        .detail-value { 
          color: #2c3e50;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px 30px;
          text-align: center;
          color: #6c757d;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nouvelle Commande</h1>
          <p>Queen's Glam</p>
        </div>
        <div class="content">
          <p>Une nouvelle commande a été passée :</p>
          
          <div class="order-details">
            <div class="detail-row">
              <span class="detail-label">Numéro de commande :</span>
              <span class="detail-value">${data.orderNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Client :</span>
              <span class="detail-value">${data.customerName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email :</span>
              <span class="detail-value">${data.customerEmail}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Téléphone :</span>
              <span class="detail-value">${data.customerPhone || 'Non fourni'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Total :</span>
              <span class="detail-value">${data.orderTotal} CAD</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Adresse de livraison :</span>
              <span class="detail-value">${data.shippingAddress}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date de commande :</span>
              <span class="detail-value">${data.orderDate}</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <p>Queen's Glam - Votre beauté, notre passion</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Appointment reminder email template
const generateAppointmentReminderHTML = (data: AppointmentEmailData): string => {
  const formattedDate = new Date(data.appointmentDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rappel de rendez-vous - Queen's Glam</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background-color: #f8f9fa;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #FF69B4, #C71585); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .header h1 { 
          font-size: 28px; 
          margin-bottom: 10px;
          font-weight: 600;
        }
        .content { 
          padding: 40px 30px; 
        }
        .appointment-details { 
          background: #f8f9fa; 
          padding: 25px; 
          border-radius: 10px; 
          margin: 25px 0; 
          border-left: 4px solid #FF69B4;
        }
        .detail-row { 
          display: flex; 
          justify-content: space-between; 
          margin: 12px 0; 
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .detail-label { 
          font-weight: 600; 
          color: #495057;
        }
        .detail-value { 
          color: #2c3e50;
        }
        .reminder-note {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          color: #856404;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px 30px;
          text-align: center;
          color: #6c757d;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Rappel de Rendez-vous</h1>
          <p>Queen's Glam</p>
        </div>
        <div class="content">
          <p>Bonjour ${data.customerName},</p>
          <p>Ceci est un rappel amical pour votre rendez-vous :</p>
          
          <div class="appointment-details">
            <div class="detail-row">
              <span class="detail-label">Service :</span>
              <span class="detail-value">${data.serviceName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date :</span>
              <span class="detail-value">${formattedDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Heure :</span>
              <span class="detail-value">${data.appointmentTime}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Durée :</span>
              <span class="detail-value">${data.duration} minutes</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Prix :</span>
              <span class="detail-value">${data.price} CAD</span>
            </div>
          </div>
          
          <div class="reminder-note">
            <strong>Rappel :</strong> Veuillez arriver 10 minutes avant votre rendez-vous. 
            Si vous devez annuler ou reporter, contactez-nous au moins 24h à l'avance.
          </div>
          
          <p>Nous avons hâte de vous voir !</p>
        </div>
        <div class="footer">
          <p>Queen's Glam - Votre beauté, notre passion</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Admin appointment reminder notification template
const generateAdminAppointmentReminderHTML = (data: AdminAppointmentNotificationData): string => {
  const formattedDate = new Date(data.appointmentDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rappel de rendez-vous - Queen's Glam</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background-color: #f8f9fa;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #FF69B4, #C71585); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .header h1 { 
          font-size: 28px; 
          margin-bottom: 10px;
          font-weight: 600;
        }
        .content { 
          padding: 40px 30px; 
        }
        .appointment-details { 
          background: #f8f9fa; 
          padding: 25px; 
          border-radius: 10px; 
          margin: 25px 0; 
          border-left: 4px solid #FF69B4;
        }
        .detail-row { 
          display: flex; 
          justify-content: space-between; 
          margin: 12px 0; 
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .detail-label { 
          font-weight: 600; 
          color: #495057;
        }
        .detail-value { 
          color: #2c3e50;
        }
        .reminder-note {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          color: #856404;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px 30px;
          text-align: center;
          color: #6c757d;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Rappel de Rendez-vous</h1>
          <p>Queen's Glam</p>
        </div>
        <div class="content">
          <p>Rappel automatique envoyé pour le rendez-vous suivant :</p>
          
          <div class="appointment-details">
            <div class="detail-row">
              <span class="detail-label">ID Rendez-vous :</span>
              <span class="detail-value">${data.appointmentId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Client :</span>
              <span class="detail-value">${data.customerName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email :</span>
              <span class="detail-value">${data.customerEmail}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Téléphone :</span>
              <span class="detail-value">${data.customerPhone || 'Non fourni'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Service :</span>
              <span class="detail-value">${data.serviceName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date :</span>
              <span class="detail-value">${formattedDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Heure :</span>
              <span class="detail-value">${data.appointmentTime}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Durée :</span>
              <span class="detail-value">${data.duration} minutes</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Prix :</span>
              <span class="detail-value">${data.price} CAD</span>
            </div>
          </div>
          
          <div class="reminder-note">
            <strong>Note :</strong> Un rappel a été envoyé au client. Préparez-vous pour ce rendez-vous.
          </div>
        </div>
        <div class="footer">
          <p>Queen's Glam - Votre beauté, notre passion</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Appointment cancellation email template
const generateAppointmentCancellationHTML = (data: AppointmentEmailData): string => {
  const formattedDate = new Date(data.appointmentDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Annulation de rendez-vous - Queen's Glam</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background-color: #f8f9fa;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #dc3545, #c82333); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .header h1 { 
          font-size: 28px; 
          margin-bottom: 10px;
          font-weight: 600;
        }
        .content { 
          padding: 40px 30px; 
        }
        .appointment-details { 
          background: #f8f9fa; 
          padding: 25px; 
          border-radius: 10px; 
          margin: 25px 0; 
          border-left: 4px solid #dc3545;
        }
        .detail-row { 
          display: flex; 
          justify-content: space-between; 
          margin: 12px 0; 
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .detail-label { 
          font-weight: 600; 
          color: #495057;
        }
        .detail-value { 
          color: #2c3e50;
        }
        .cancellation-note {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          color: #721c24;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px 30px;
          text-align: center;
          color: #6c757d;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Annulation de Rendez-vous</h1>
          <p>Queen's Glam</p>
        </div>
        <div class="content">
          <p>Bonjour ${data.customerName},</p>
          <p>Votre rendez-vous a été annulé :</p>
          
          <div class="appointment-details">
            <div class="detail-row">
              <span class="detail-label">Service :</span>
              <span class="detail-value">${data.serviceName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date :</span>
              <span class="detail-value">${formattedDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Heure :</span>
              <span class="detail-value">${data.appointmentTime}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Durée :</span>
              <span class="detail-value">${data.duration} minutes</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Prix :</span>
              <span class="detail-value">${data.price} CAD</span>
            </div>
          </div>
          
          <div class="cancellation-note">
            <strong>Note :</strong> Si vous souhaitez reprogrammer votre rendez-vous, 
            n'hésitez pas à nous contacter. Nous serons ravis de vous accueillir à nouveau.
          </div>
          
          <p>Merci de votre compréhension.</p>
        </div>
        <div class="footer">
          <p>Queen's Glam - Votre beauté, notre passion</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Admin appointment cancellation notification template
const generateAdminAppointmentCancellationHTML = (data: AdminAppointmentNotificationData): string => {
  const formattedDate = new Date(data.appointmentDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Annulation de rendez-vous - Queen's Glam</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background-color: #f8f9fa;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #dc3545, #c82333); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .header h1 { 
          font-size: 28px; 
          margin-bottom: 10px;
          font-weight: 600;
        }
        .content { 
          padding: 40px 30px; 
        }
        .appointment-details { 
          background: #f8f9fa; 
          padding: 25px; 
          border-radius: 10px; 
          margin: 25px 0; 
          border-left: 4px solid #dc3545;
        }
        .detail-row { 
          display: flex; 
          justify-content: space-between; 
          margin: 12px 0; 
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .detail-label { 
          font-weight: 600; 
          color: #495057;
        }
        .detail-value { 
          color: #2c3e50;
        }
        .cancellation-note {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          color: #721c24;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px 30px;
          text-align: center;
          color: #6c757d;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Annulation de Rendez-vous</h1>
          <p>Queen's Glam</p>
        </div>
        <div class="content">
          <p>Un rendez-vous a été annulé :</p>
          
          <div class="appointment-details">
            <div class="detail-row">
              <span class="detail-label">ID Rendez-vous :</span>
              <span class="detail-value">${data.appointmentId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Client :</span>
              <span class="detail-value">${data.customerName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email :</span>
              <span class="detail-value">${data.customerEmail}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Téléphone :</span>
              <span class="detail-value">${data.customerPhone || 'Non fourni'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Service :</span>
              <span class="detail-value">${data.serviceName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date :</span>
              <span class="detail-value">${formattedDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Heure :</span>
              <span class="detail-value">${data.appointmentTime}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Durée :</span>
              <span class="detail-value">${data.duration} minutes</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Prix :</span>
              <span class="detail-value">${data.price} CAD</span>
            </div>
          </div>
          
          <div class="cancellation-note">
            <strong>Note :</strong> Ce créneau est maintenant disponible pour d'autres clients.
          </div>
        </div>
        <div class="footer">
          <p>Queen's Glam - Votre beauté, notre passion</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// API route handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing type or data parameter' },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.warn('ADMIN_EMAIL not configured, skipping admin notifications');
    }

    let emailData: EmailData;
    let success = false;

    switch (type) {
      case 'appointment_confirmation':
        // Send to customer
        emailData = {
          to: data.customerEmail,
          subject: 'Confirmation de votre rendez-vous - Queen\'s Glam',
          html: generateAppointmentConfirmationHTML(data),
          text: `Confirmation de rendez-vous pour ${data.serviceName} le ${data.appointmentDate} à ${data.appointmentTime}`
        };
        success = await sendEmail(emailData);
        
        // Also send to admin
        if (adminEmail) {
          const adminEmailData: EmailData = {
            to: adminEmail,
            subject: `Nouveau rendez-vous #${data.appointmentId.slice(0, 8)} - Queen's Glam`,
            html: generateAdminAppointmentNotificationHTML(data),
            text: `Nouveau rendez-vous pour ${data.customerName} - ${data.serviceName}`
          };
          await sendEmail(adminEmailData);
        }
        break;

      case 'appointment_reminder':
        // Send to customer
        emailData = {
          to: data.customerEmail,
          subject: 'Rappel de votre rendez-vous - Queen\'s Glam',
          html: generateAppointmentReminderHTML(data),
          text: `Rappel: Rendez-vous pour ${data.serviceName} le ${data.appointmentDate} à ${data.appointmentTime}`
        };
        success = await sendEmail(emailData);
        
        // Also send to admin
        if (adminEmail) {
          const adminEmailData: EmailData = {
            to: adminEmail,
            subject: `Rappel de rendez-vous #${data.appointmentId.slice(0, 8)} - Queen's Glam`,
            html: generateAdminAppointmentReminderHTML(data),
            text: `Rappel de rendez-vous pour ${data.customerName} - ${data.serviceName}`
          };
          await sendEmail(adminEmailData);
        }
        break;

      case 'appointment_cancellation':
        // Send to customer
        emailData = {
          to: data.customerEmail,
          subject: 'Annulation de votre rendez-vous - Queen\'s Glam',
          html: generateAppointmentCancellationHTML(data),
          text: `Annulation de rendez-vous pour ${data.serviceName} le ${data.appointmentDate} à ${data.appointmentTime}`
        };
        success = await sendEmail(emailData);
        
        // Also send to admin
        if (adminEmail) {
          const adminEmailData: EmailData = {
            to: adminEmail,
            subject: `Annulation de rendez-vous #${data.appointmentId.slice(0, 8)} - Queen's Glam`,
            html: generateAdminAppointmentCancellationHTML(data),
            text: `Annulation de rendez-vous pour ${data.customerName} - ${data.serviceName}`
          };
          await sendEmail(adminEmailData);
        }
        break;

      case 'order_confirmation':
        // Send to customer
        emailData = {
          to: data.customerEmail,
          subject: 'Confirmation de votre commande - Queen\'s Glam',
          html: generateOrderConfirmationHTML(data),
          text: `Confirmation de commande #${data.orderNumber} - Total: ${data.orderTotal} CAD`
        };
        success = await sendEmail(emailData);
        
        // Also send to admin
        if (adminEmail) {
          const adminEmailData: EmailData = {
            to: adminEmail,
            subject: `Nouvelle commande #${data.orderNumber} - Queen's Glam`,
            html: generateAdminOrderNotificationHTML(data),
            text: `Nouvelle commande #${data.orderNumber} de ${data.customerName}`
          };
          await sendEmail(adminEmailData);
        }
        break;

      // Legacy admin-only notifications (for backward compatibility)
      case 'admin_appointment_notification':
        if (!adminEmail) {
          return NextResponse.json({ success: true, skipped: true });
        }
        emailData = {
          to: adminEmail,
          subject: `Nouveau rendez-vous #${data.appointmentId.slice(0, 8)} - Queen's Glam`,
          html: generateAdminAppointmentNotificationHTML(data),
          text: `Nouveau rendez-vous pour ${data.customerName} - ${data.serviceName}`
        };
        success = await sendEmail(emailData);
        break;

      case 'admin_order_notification':
        if (!adminEmail) {
          return NextResponse.json({ success: true, skipped: true });
        }
        emailData = {
          to: adminEmail,
          subject: `Nouvelle commande #${data.orderNumber} - Queen's Glam`,
          html: generateAdminOrderNotificationHTML(data),
          text: `Nouvelle commande #${data.orderNumber} de ${data.customerName}`
        };
        success = await sendEmail(emailData);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error in email API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 