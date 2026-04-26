import { Resend } from 'resend';
import { 
  userWelcomeTemplate, 
  founderWelcomeTemplate, 
  merchantOnboardingTemplate,
  couponPurchasedTemplate,
  couponRedeemedTemplate,
  couponExpiringTemplate,
  merchantReviewAlertTemplate,
  merchantPurchaseAlertTemplate,
  adminDisputeAlertTemplate,
  otpTemplate
} from './emailTemplates';
import { getEnv } from '../env';

const env = getEnv();
const resend = new Resend(env.resendApiKey);

export const sendEmail = async ({ to, subject, html }: { to: string | string[], subject: string, html: string }) => {
  try {
    const data = await resend.emails.send({
      from: 'Slasham <hello@send.slasham.com>', // Using the new subdomain
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

export const sendUserWelcome = async (email: string, name: string) => {
  return sendEmail({
    to: email,
    subject: `Welcome to Slasham, ${name}! 🥂`,
    html: userWelcomeTemplate(name)
  });
};

export const sendFounderWelcome = async (email: string, name: string) => {
  return sendEmail({
    to: email,
    subject: 'A personal note from the founder',
    html: founderWelcomeTemplate(name)
  });
};

export const sendOnboardingEmail = async (email: string, name: string, tempPassword: string) => {
  return sendEmail({
    to: email,
    subject: 'Welcome Onboard! Your Slasham Partner Credentials',
    html: merchantOnboardingTemplate(name, email, tempPassword)
  });
};

export const sendCouponPurchased = async (email: string, name: string, dealTitle: string, voucherCode: string, price: string) => {
  return sendEmail({
    to: email,
    subject: `Your Voucher: ${dealTitle} 🎟️`,
    html: couponPurchasedTemplate(name, dealTitle, voucherCode, price)
  });
};

export const sendCouponRedeemed = async (email: string, name: string, dealTitle: string) => {
  return sendEmail({
    to: email,
    subject: 'Voucher Redeemed! How was it? ✅',
    html: couponRedeemedTemplate(name, dealTitle)
  });
};

export const sendCouponExpiring = async (email: string, name: string, dealTitle: string, hoursLeft: number) => {
  return sendEmail({
    to: email,
    subject: 'Hurry! Your voucher is expiring ⏳',
    html: couponExpiringTemplate(name, dealTitle, hoursLeft)
  });
};

export const sendMerchantReviewAlert = async (email: string, merchantName: string, rating: number, comment: string) => {
  return sendEmail({
    to: email,
    subject: 'New Customer Review! ⭐',
    html: merchantReviewAlertTemplate(merchantName, rating, comment)
  });
};

export const sendMerchantPurchaseAlert = async (email: string, merchantName: string, dealTitle: string, customerName: string) => {
  return sendEmail({
    to: email,
    subject: 'New Purchase Alert! 💰',
    html: merchantPurchaseAlertTemplate(merchantName, dealTitle, customerName)
  });
};

export const sendAdminDisputeAlert = async (dealTitle: string, reason: string, customerEmail: string) => {
  return sendEmail({
    to: 'admin@slasham.com', // Replace with admin email
    subject: 'URGENT: New Transaction Dispute ⚠️',
    html: adminDisputeAlertTemplate(dealTitle, reason, customerEmail)
  });
};

export const sendOTP = async (email: string, name: string, code: string) => {
  return sendEmail({
    to: email,
    subject: `Your Slasham Verification Code 🛡️`,
    html: otpTemplate(name, code)
  });
};
