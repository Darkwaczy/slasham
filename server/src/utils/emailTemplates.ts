export const layout = (content: string, showUnsubscribe = false) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    
    <!-- Wrapper -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:40px 20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
            
            <!-- Header -->
            <tr>
              <td style="background-color:#ffffff;border-radius:16px 16px 0 0;padding:32px 40px;border-bottom:3px solid #16a34a;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <img src="https://www.slasham.com/assets/slashamlogo.png" 
                           alt="Slasham" 
                           style="height:36px;width:auto;" />
                    </td>
                    <td align="right">
                      <span style="font-size:11px;font-weight:900;color:#16a34a;text-transform:uppercase;letter-spacing:0.15em;">Nigeria's #1 Deal Platform</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="background-color:#ffffff;padding:40px;font-size:15px;line-height:1.8;color:#111827;">
                ${content}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:#111827;border-radius:0 0 16px 16px;padding:32px 40px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <img src="https://www.slasham.com/assets/slashamlogo.png" 
                           alt="Slasham" 
                           style="height:28px;width:auto;filter:brightness(0) invert(1);opacity:0.9;" />
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:16px;">
                      <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
                        Save More. Live Better. Nigeria's premium verified deals marketplace.
                      </p>
                      <p style="margin:8px 0 0;font-size:11px;font-weight:900;color:#16a34a;text-transform:uppercase;letter-spacing:0.2em;">
                        Lagos • Abuja
                      </p>
                    </td>
                  </tr>
                  ${showUnsubscribe ? `
                  <tr>
                    <td style="padding-top:20px;border-top:1px solid #1f2937;margin-top:20px;">
                      <p style="margin:0;font-size:11px;color:#6b7280;">
                        You received this because you're a registered Slasham member.
                        <a href="#" style="color:#16a34a;text-decoration:underline;">Unsubscribe</a>
                      </p>
                    </td>
                  </tr>` : ''}
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>

  </body>
</html>
`;

export const userWelcomeTemplate = (name: string, clientUrl: string) => layout(`
  <div style="background:#f0fdf4;border-radius:12px;padding:24px;margin-bottom:32px;text-align:center;">
    <p style="margin:0;font-size:40px;">🎉</p>
    <h1 style="font-size:28px;font-weight:900;color:#111827;margin:12px 0 8px;letter-spacing:-0.5px;">
      Welcome to Slasham!
    </h1>
    <p style="margin:0;font-size:14px;color:#16a34a;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">
      You're now a verified member
    </p>
  </div>

  <p style="font-size:15px;color:#374151;margin:0 0 24px;line-height:1.8;">
    Hi <strong>${name}</strong>, welcome to Nigeria's #1 verified deals platform. 
    You now have exclusive access to premium deals in Lagos and Abuja.
  </p>

  <div style="border-left:4px solid #16a34a;padding:16px 24px;margin-bottom:32px;background:#f9fafb;border-radius:0 8px 8px 0;">
    <p style="margin:0;font-size:15px;color:#111827;font-weight:700;">
      🎁 500 SlashPoints credited to your wallet
    </p>
    <p style="margin:8px 0 0;font-size:13px;color:#6b7280;">
      Use these points for extra discounts on your first purchase.
    </p>
  </div>

  <table cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:#16a34a;border-radius:10px;padding:2px;">
        <a href="${clientUrl}/deals" 
           style="display:inline-block;background:#16a34a;color:#ffffff;padding:16px 32px;border-radius:8px;text-decoration:none;font-weight:900;font-size:14px;text-transform:uppercase;letter-spacing:0.1em;">
          Explore Deals →
        </a>
      </td>
    </tr>
  </table>
`, true);

export const founderWelcomeTemplate = (name: string) => layout(`
  <p style="margin-bottom: 24px; font-size: 18px; font-weight: 700; color: #111827;">Hi ${name},</p>
  
  <p style="margin-bottom: 24px; color: #374151;">I'm Nelly, the co-founder of Slasham. I'm personally reaching out because I want to ensure your experience on our platform is nothing short of exceptional.</p>
  
  <p style="margin-bottom: 24px; color: #374151;">We built Slasham for the modern Nigerian—someone who values premium experiences but knows the power of a smart deal. Our partners are hand-picked to ensure you only ever see the best of what Lagos and Abuja have to offer.</p>
  
  <p style="margin-bottom: 40px; color: #374151;">If you ever have feedback, or if a specific business isn't meeting your expectations, please reply to this email. I read every single message.</p>
  
  <div style="margin-bottom: 10px;">
    <img src="https://readme-typing-svg.herokuapp.com?font=Dancing+Script&size=36&duration=4000&pause=1000&color=16a34a&width=350&lines=Nelly+Agbogu" alt="Nelly Agbogu" style="width: 250px; height: auto;" />
  </div>
  <p style="margin: 0; font-weight: 900; color: #111827; font-size: 18px; letter-spacing: -0.5px;">Nelly Agbogu</p>
  <p style="margin: 0; color: #16a34a; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">Co-Founder, Slasham</p>
`);

export const otpTemplate = (name: string, code: string) => layout(`
  <h1 style="font-size:28px;font-weight:900;color:#111827;margin:0 0 16px;letter-spacing:-0.5px;">
    Verify your identity.
  </h1>
  <p style="font-size:15px;color:#374151;margin:0 0 32px;">
    Hi <strong>${name}</strong>, use the code below to complete your Slasham verification.
  </p>

  <div style="background:#f0fdf4;border:2px solid #16a34a;border-radius:12px;padding:40px;text-align:center;margin-bottom:32px;">
    <p style="margin:0 0 8px;font-size:11px;font-weight:900;color:#16a34a;text-transform:uppercase;letter-spacing:0.2em;">
      Your Verification Code
    </p>
    <div style="font-size:52px;font-weight:900;color:#111827;letter-spacing:12px;font-family:monospace;">
      ${code}
    </div>
  </div>

  <p style="font-size:12px;color:#9ca3af;text-align:center;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">
    ⏱ This code expires in 10 minutes. Do not share it with anyone.
  </p>
`);

export const merchantOnboardingTemplate = (name: string, email: string, tempPassword: string, clientUrl: string) => layout(`
  <h1 style="font-size: 28px; font-weight: 900; color: #111827; margin-top: 0; margin-bottom: 24px; letter-spacing: -1px;">Welcome to the Network. 🚀</h1>
  <p style="font-size: 18px; color: #374151; margin-bottom: 32px; font-weight: 700;">Hi ${name}, your application has been verified. You are now a certified Slasham Partner.</p>
  
  <p style="font-size: 15px; color: #374151; margin-bottom: 32px; line-height: 1.8;">
    Congratulations! Your business is now part of Nigeria's premier lifestyle marketplace. We've created your partner account with the following credentials:
  </p>

  <div style="background:#f0fdf4; border: 2px solid #16a34a; padding: 30px; margin-bottom: 40px; border-radius: 12px;">
    <p style="font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; color: #16a34a; margin-bottom: 20px;">Secure Access Credentials</p>
    <p style="font-size: 16px; margin-bottom: 12px; color: #111827;"><strong>Login Email:</strong> <span>${email}</span></p>
    <p style="font-size: 16px; margin: 0; color: #111827;"><strong>Temporary Password:</strong> <span style="background: #16a34a; color: #ffffff; padding: 4px 8px; font-weight: 900; border-radius: 4px;">${tempPassword}</span></p>
  </div>

  <h3 style="font-size: 14px; font-weight: 900; text-transform: uppercase; color: #111827; letter-spacing: 0.1em; margin-bottom: 20px;">Next Steps for Success</h3>
  <div style="font-size: 15px; color: #374151; margin-bottom: 40px; line-height: 1.8;">
    <strong style="color: #16a34a;">1. Secure Your Account:</strong> Log in and immediately change your temporary password to something secure.<br>
    <strong style="color: #16a34a;">2. Complete Your Profile:</strong> Upload your high-resolution business logo and a captivating banner to attract customers.<br>
    <strong style="color: #16a34a;">3. Create Your First Campaign:</strong> Submit your deal for review. Once approved, it goes live to thousands of Slasham users.<br>
    <strong style="color: #16a34a;">4. Download the Scanner:</strong> Prepare your staff to scan customer vouchers using our digital terminal.
  </div>

  <table cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:#16a34a;border-radius:10px;padding:2px;">
        <a href="${clientUrl}/merchant/login" 
           style="display:inline-block;background:#16a34a;color:#ffffff;padding:18px 36px;border-radius:8px;text-decoration:none;font-weight:900;font-size:14px;text-transform:uppercase;letter-spacing:0.1em;">
          Launch Partner Console →
        </a>
      </td>
    </tr>
  </table>
`);

export const merchantApplicationReceivedTemplate = (name: string) => layout(`
  <h1 style="font-size: 28px; font-weight: 900; color: #111827; margin-top: 0; margin-bottom: 24px; letter-spacing: -1px;">Application Received. 📥</h1>
  <p style="font-size: 15px; color: #374151; margin-bottom: 32px;">Hi <strong>${name}</strong>, thank you for your interest in joining the Slasham Partner Network.</p>
  
  <p style="font-size: 15px; color: #374151; margin-bottom: 24px; line-height: 1.8;">Our verification team has received your application and is currently reviewing your business details. This process typically takes 24-48 hours.</p>
  
  <div style="border-left: 4px solid #16a34a; padding: 24px; margin-bottom: 40px; background: #f9fafb; border-radius: 0 12px 12px 0;">
    <h3 style="font-size: 12px; font-weight: 900; color: #111827; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 16px;">What happens next?</h3>
    <ul style="font-size: 14px; color: #374151; padding-left: 18px; margin: 0; line-height: 1.8;">
      <li>We verify your business registration and social presence.</li>
      <li>Once approved, you'll receive your login credentials via email.</li>
      <li>You can then start listing your first deals!</li>
    </ul>
  </div>
  
  <p style="font-size: 14px; color: #374151; font-weight: 700;">If we need any additional information, a member of our team will reach out to you directly.</p>
`);

export const merchantRejectionTemplate = (name: string, reason: string, clientUrl: string) => layout(`
  <h1 style="font-size: 28px; font-weight: 900; color: #111827; margin-top: 0; margin-bottom: 24px; letter-spacing: -1px;">Application Update.</h1>
  <p style="font-size: 15px; color: #374151; margin-bottom: 32px;">Hi <strong>${name}</strong>, thank you for your interest in joining the Slasham Partner Network.</p>
  
  <p style="font-size: 15px; color: #374151; margin-bottom: 24px; line-height: 1.8;">After reviewing your submission, our verification team is unable to approve your application at this time for the following reason:</p>
  
  <div style="border-left: 4px solid #ef4444; padding: 24px; margin-bottom: 32px; background: #fef2f2; border-radius: 0 12px 12px 0;">
    <p style="font-size: 14px; color: #991b1b; font-weight: 700; margin: 0; line-height: 1.6;">"${reason}"</p>
  </div>
  
  <p style="font-size: 14px; color: #374151; margin-bottom: 32px; line-height: 1.8;">You are welcome to re-apply once these requirements have been met. If you believe this is an error, please reach out to our support team.</p>
  
  <table cellpadding="0" cellspacing="0">
    <tr>
      <td style="border: 2px solid #111827; border-radius: 10px;">
        <a href="${clientUrl}/contact" 
           style="display:inline-block;background:#ffffff;color:#111827;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:900;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">
          Contact Support
        </a>
      </td>
    </tr>
  </table>
`);

export const couponPurchasedTemplate = (name: string, dealTitle: string, voucherCode: string, price: string, clientUrl: string) => layout(`
  <h1 style="font-size: 28px; font-weight: 900; color: #111827; margin-top: 0; margin-bottom: 24px; letter-spacing: -1px;">It's Yours. 🎟️</h1>
  <p style="font-size: 15px; color: #374151; margin-bottom: 32px;">Hi <strong>${name}</strong>, your voucher for <strong>${dealTitle}</strong> is ready for use.</p>
  
  <div style="background:#f0fdf4; border: 2px dashed #16a34a; padding: 48px; text-align: center; margin-bottom: 40px; border-radius: 16px;">
    <p style="font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; color: #16a34a; margin-bottom: 12px;">Secure Voucher Code</p>
    <div style="font-size: 52px; font-weight: 900; color: #111827; letter-spacing: 4px; font-family: monospace; margin-bottom: 16px;">${voucherCode}</div>
    <p style="font-size: 14px; color: #374151; font-weight: 700;">Paid: <span style="color: #16a34a;">₦${price}</span></p>
  </div>

  <h3 style="font-size: 14px; font-weight: 900; color: #111827; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px;">How to Redeem</h3>
  <div style="font-size: 14px; color: #374151; margin-bottom: 40px; line-height: 2;">
    1. Visit the venue and present this code.<br>
    2. Staff will verify and apply your discount.<br>
    3. Enjoy the Slasham experience.
  </div>

  <table cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:#16a34a;border-radius:10px;padding:2px;">
        <a href="${clientUrl}/user/coupons" 
           style="display:inline-block;background:#16a34a;color:#ffffff;padding:18px 36px;border-radius:8px;text-decoration:none;font-weight:900;font-size:14px;text-transform:uppercase;letter-spacing:0.1em;">
          View My Wallet →
        </a>
      </td>
    </tr>
  </table>
`);

export const couponRedeemedTemplate = (name: string, dealTitle: string, clientUrl: string) => layout(`
  <h1 style="font-size: 28px; font-weight: 900; color: #111827; margin-top: 0; margin-bottom: 24px; letter-spacing: -1px;">Experience Complete. ✅</h1>
  <p style="font-size: 15px; color: #374151; margin-bottom: 32px;">Hi <strong>${name}</strong>, your voucher for <strong>${dealTitle}</strong> has been successfully redeemed.</p>
  
  <div style="background:#f0fdf4; border: 2px solid #16a34a; padding: 32px; text-align: center; margin-bottom: 40px; border-radius: 12px;">
    <p style="font-size: 15px; color: #111827; margin-bottom: 24px; line-height: 1.6;">We hope you enjoyed it! Leave a review now to earn <strong style="color: #16a34a;">100 SlashPoints</strong>.</p>
    <a href="${clientUrl}/user/coupons" style="display: inline-block; background: #16a34a; color: #ffffff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; font-size: 13px;">Rate Your Experience</a>
  </div>
`);

export const couponExpiringTemplate = (name: string, dealTitle: string, hoursLeft: number, clientUrl: string) => layout(`
  <h1 style="font-size: 28px; font-weight: 900; color: #111827; margin-top: 0; margin-bottom: 24px; letter-spacing: -1px;">Don't miss out. ⏳</h1>
  <p style="font-size: 15px; color: #374151; margin-bottom: 32px;">Hi <strong>${name}</strong>, your voucher for <strong>${dealTitle}</strong> expires in less than ${hoursLeft} hours.</p>
  
  <div style="border-left: 4px solid #111827; padding: 24px; margin-bottom: 40px; background: #f9fafb; border-radius: 0 12px 12px 0;">
    <p style="font-size: 15px; color: #111827; font-weight: 700; margin: 0; line-height: 1.6;">Use it today to claim your exclusive discount before it's gone.</p>
  </div>

  <table cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:#111827;border-radius:10px;padding:2px;">
        <a href="${clientUrl}/user/coupons" 
           style="display:inline-block;background:#111827;color:#ffffff;padding:16px 32px;border-radius:8px;text-decoration:none;font-weight:900;font-size:14px;text-transform:uppercase;letter-spacing:0.1em;">
          View Voucher →
        </a>
      </td>
    </tr>
  </table>
`);

export const merchantReviewAlertTemplate = (merchantName: string, rating: number, comment: string, clientUrl: string) => layout(`
  <h1 style="font-size: 28px; font-weight: 900; color: #111827; margin-top: 0; margin-bottom: 24px; letter-spacing: -1px;">New Customer Voice. ⭐</h1>
  <p style="font-size: 15px; color: #374151; margin-bottom: 32px;">Hi <strong>${merchantName}</strong>, you've just received a new review on Slasham.</p>
  
  <div style="background:#f9fafb; border: 1px solid #e2e8f0; padding: 32px; margin-bottom: 32px; border-radius: 16px;">
    <div style="font-size: 24px; margin-bottom: 16px;">${Array(rating).fill('⭐').join('')}</div>
    <p style="font-size: 16px; color: #111827; font-style: italic; margin: 0; line-height: 1.6;">"${comment}"</p>
  </div>

  <table cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:#111827;border-radius:10px;padding:2px;">
        <a href="${clientUrl}/merchant/reviews" 
           style="display:inline-block;background:#111827;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:900;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">
          Respond to Customer
        </a>
      </td>
    </tr>
  </table>
`);

export const merchantPurchaseAlertTemplate = (merchantName: string, dealTitle: string, customerName: string, clientUrl: string) => layout(`
  <h1 style="font-size: 28px; font-weight: 900; color: #111827; margin-top: 0; margin-bottom: 24px; letter-spacing: -1px;">Incoming Revenue. 💰</h1>
  <p style="font-size: 15px; color: #374151; margin-bottom: 32px;">Hi <strong>${merchantName}</strong>, <strong>${customerName}</strong> just purchased <strong>${dealTitle}</strong>.</p>
  
  <div style="border-left: 4px solid #16a34a; padding: 24px; margin-bottom: 40px; background: #f0fdf4; border-radius: 0 12px 12px 0;">
    <p style="font-size: 15px; color: #111827; font-weight: 700; margin: 0; line-height: 1.6;">Prepare for their visit! You can track all purchases in your partner console.</p>
  </div>

  <table cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:#16a34a;border-radius:10px;padding:2px;">
        <a href="${clientUrl}/merchant/dashboard" 
           style="display:inline-block;background:#16a34a;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:900;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">
          View Dashboard
        </a>
      </td>
    </tr>
  </table>
`);

export const adminDisputeAlertTemplate = (dealTitle: string, reason: string, customerEmail: string, clientUrl: string) => layout(`
  <h1 style="font-size: 28px; font-weight: 900; color: #111827; margin-top: 0; margin-bottom: 24px; letter-spacing: -1px;">Dispute Alert. ⚠️</h1>
  <p style="font-size: 15px; color: #374151; margin-bottom: 32px;">A new dispute requires your immediate attention.</p>
  
  <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 32px; margin-bottom: 32px; border-radius: 16px;">
    <p style="font-size: 14px; color: #111827; margin-bottom: 8px;"><strong>Deal:</strong> ${dealTitle}</p>
    <p style="font-size: 14px; color: #111827; margin-bottom: 8px;"><strong>Customer:</strong> ${customerEmail}</p>
    <p style="font-size: 14px; color: #991b1b; margin: 0;"><strong>Reason:</strong> ${reason}</p>
  </div>

  <table cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:#ef4444;border-radius:10px;padding:2px;">
        <a href="${clientUrl}/admin/reports" 
           style="display:inline-block;background:#ef4444;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:900;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">
          Review Dispute
        </a>
      </td>
    </tr>
  </table>
`);

export const campaignStatusUpdateTemplate = (merchantName: string, campaignTitle: string, status: string, notes: string | undefined, clientUrl: string) => layout(`
  <h1 style="font-size: 28px; font-weight: 900; color: #111827; margin-top: 0; margin-bottom: 24px; letter-spacing: -1px;">
    Campaign ${status === 'APPROVED' ? 'Approved! 🚀' : 'Update 📥'}
  </h1>
  <p style="font-size: 15px; color: #374151; margin-bottom: 32px;">Hi <strong>${merchantName}</strong>, your campaign request for <strong>${campaignTitle}</strong> has been ${status.toLowerCase()}.</p>
  
  <div style="border-left: 4px solid ${status === 'APPROVED' ? '#16a34a' : '#111827'}; padding: 24px; margin-bottom: 40px; background: ${status === 'APPROVED' ? '#f0fdf4' : '#f9fafb'}; border-radius: 0 12px 12px 0;">
    <p style="font-size: 14px; color: #111827; font-weight: 700; margin-bottom: ${notes ? '12px' : '0'}; line-height: 1.6;">Status: ${status}</p>
    ${notes ? `<p style="font-size: 13px; color: #374151; margin: 0; line-height: 1.6;"><strong>Admin Notes:</strong> ${notes}</p>` : ''}
  </div>

  <table cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:#16a34a;border-radius:10px;padding:2px;">
        <a href="${clientUrl}/merchant/campaigns" 
           style="display:inline-block;background:#16a34a;color:#ffffff;padding:16px 32px;border-radius:8px;text-decoration:none;font-weight:900;font-size:13px;text-transform:uppercase;letter-spacing:0.1em;">
          Go to My Campaigns
        </a>
      </td>
    </tr>
  </table>
`);

export const campaignSubmittedTemplate = (merchantName: string, campaignTitle: string) => layout(`
  <h1 style="font-size: 28px; font-weight: 900; color: #111827; margin-top: 0; margin-bottom: 24px; letter-spacing: -1px;">Campaign Submitted. ⚡</h1>
  <p style="font-size: 15px; color: #374151; margin-bottom: 32px; font-weight: 700;">Hi <strong>${merchantName}</strong>, your campaign is now under review.</p>
 
  <p style="font-size: 15px; color: #374151; margin-bottom: 24px; line-height: 1.8;">
    We've received your campaign submission for <strong>${campaignTitle}</strong>. Our team will review it within 24 hours and notify you once it's approved or if any changes are needed.
  </p>
 
  <div style="border-left: 4px solid #16a34a; padding: 24px; margin-bottom: 40px; background: #f9fafb; border-radius: 0 12px 12px 0;">
    <h3 style="font-size: 12px; font-weight: 900; color: #111827; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 20px;">What happens next?</h3>
    <ul style="margin: 0; padding: 0; list-style: none;">
      <li style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #374151;">
        <strong style="color: #16a34a;">1. Review</strong> — Our team checks your campaign details (24hrs)
      </li>
      <li style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #374151;">
        <strong style="color: #16a34a;">2. Approval</strong> — You'll receive an email once approved or rejected
      </li>
      <li style="padding: 12px 0; font-size: 14px; color: #374151;">
        <strong style="color: #16a34a;">3. Live</strong> — Approved campaigns go live to thousands of Slasham users
      </li>
    </ul>
  </div>
`);
