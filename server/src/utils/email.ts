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
  otpTemplate,
  merchantRejectionTemplate
} from './emailTemplates';
import { getEnv } from '../env';
import { getSupabaseAdmin } from '../supabase';

const env = getEnv();
const resend = new Resend(env.resendApiKey);

const getDynamicTemplate = async (slug: string, variables: Record<string, string>, fallbackHtml: string) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return fallbackHtml;

    const { data } = await supabase
      .from('email_templates')
      .select('*')
      .eq('slug', slug)
      .single();

    if (!data) return fallbackHtml;

    let body = data.html_body;
    Object.keys(variables).forEach(key => {
      body = body.replace(new RegExp(`{{${key}}}`, 'g'), variables[key]);
    });

    return body;
  } catch (e) {
    return fallbackHtml;
  }
};

export const sendEmail = async ({ to, subject, html }: { to: string | string[], subject: string, html: string }) => {
  try {
    const data = await resend.emails.send({
      from: 'Slasham <hello@send.slasham.com>',
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
  const html = await getDynamicTemplate('user_welcome', { name }, userWelcomeTemplate(name));
  return sendEmail({
    to: email,
    subject: `Welcome to Slasham, ${name}! 🥂`,
    html
  });
};

export const sendFounderWelcome = async (email: string, name: string) => {
  const html = await getDynamicTemplate('founder_welcome', { name }, founderWelcomeTemplate(name));
  return sendEmail({
    to: email,
    subject: 'A personal note from the founder',
    html
  });
};

export const sendOnboardingEmail = async (email: string, name: string, tempPassword: string) => {
  const html = await getDynamicTemplate('merchant_onboarding', { name, email, tempPassword }, merchantOnboardingTemplate(name, email, tempPassword));
  return sendEmail({
    to: email,
    subject: 'Welcome Onboard! Your Slasham Partner Credentials',
    html
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
    to: process.env.ADMIN_EMAIL || 'admin@example.com',
    subject: 'URGENT: New Transaction Dispute ⚠️',
    html: adminDisputeAlertTemplate(dealTitle, reason, customerEmail)
  });
};

export const sendRejectionEmail = async (email: string, name: string, reason: string) => {
  const html = await getDynamicTemplate('merchant_rejection', { name, reason }, merchantRejectionTemplate(name, reason));
  return sendEmail({
    to: email,
    subject: 'Update on your Slasham Partner Application',
    html
  });
};

export const sendOTP = async (email: string, name: string, code: string) => {
  const html = await getDynamicTemplate('otp', { name, code }, otpTemplate(name, code));
  return sendEmail({
    to: email,
    subject: `Your Slasham Verification Code 🛡️`,
    html
  });
};
