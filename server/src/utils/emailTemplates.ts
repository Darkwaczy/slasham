export const layout = (content: string, showUnsubscribe = false) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', -apple-system, sans-serif; }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff; color: #000000; font-family: 'Inter', sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 60px 20px;">
        <!-- Header -->
        <div style="margin-bottom: 60px; text-align: center;">
          <img src="https://i.ibb.co/LzdYpZ7/slasham-logo.png" alt="SLASHAM" style="height: 40px; width: auto; font-weight: 900;" />
        </div>

        <div style="line-height: 1.8; font-size: 16px;">
          ${content}
        </div>

        <!-- Divider -->
        <div style="margin-top: 60px; padding-top: 30px; border-top: 2px solid #10b981; text-align: center;">
          <p style="margin: 0; font-size: 10px; font-weight: 900; color: #000000; text-transform: uppercase; letter-spacing: 0.3em;">
            Slasham Global • Lagos • Abuja • London
          </p>
          ${showUnsubscribe ? '<p style="margin-top: 20px; font-size: 11px; color: #666666;">You received this because you are a registered member of Slasham. <a href="#" style="color: #000000; text-decoration: underline;">Unsubscribe</a></p>' : ''}
        </div>
      </div>
    </body>
  </html>
`;

export const userWelcomeTemplate = (name: string, clientUrl: string) => layout(`
  <h1 style="font-size: 32px; font-weight: 900; color: #000000; margin-top: 0; margin-bottom: 24px; letter-spacing: -1px;">Welcome to Slasham.</h1>
  <p style="font-size: 18px; color: #000000; margin-bottom: 32px;">Hi ${name}, you've just unlocked Nigeria's most exclusive lifestyle rewards platform.</p>
  
  <p style="font-size: 16px; color: #000000; margin-bottom: 32px;">
    We've credited <span style="color: #10b981; font-weight: 900;">500 SlashPoints</span> to your wallet as a founding member gift. 
    Use these points to get even bigger discounts on premium dining, beauty, and travel experiences.
  </p>
  
  <div style="border: 2px solid #10b981; padding: 2px; display: inline-block; border-radius: 12px;">
    <a href="${clientUrl}/deals" style="display: inline-block; background: #000000; color: #ffffff; padding: 18px 36px; border-radius: 10px; text-decoration: none; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em;">Start Exploring</a>
  </div>
`, true);

export const founderWelcomeTemplate = (name: string) => layout(`
  <p style="margin-bottom: 24px; font-size: 18px; font-weight: 700;">Hi ${name},</p>
  
  <p style="margin-bottom: 24px; color: #000000;">I'm Nelly, the co-founder of Slasham. I'm personally reaching out because I want to ensure your experience on our platform is nothing short of exceptional.</p>
  
  <p style="margin-bottom: 24px; color: #000000;">We built Slasham for the modern Nigerian—someone who values premium experiences but knows the power of a smart deal. Our partners are hand-picked to ensure you only ever see the best of what Lagos and Abuja have to offer.</p>
  
  <p style="margin-bottom: 40px; color: #000000;">If you ever have feedback, or if a specific business isn't meeting your expectations, please reply to this email. I read every single message.</p>
  
  <div style="margin-bottom: 10px;">
    <img src="https://readme-typing-svg.herokuapp.com?font=Dancing+Script&size=36&duration=4000&pause=1000&color=10b981&width=350&lines=Nelly+Agbogu" alt="Nelly Agbogu" style="width: 250px; height: auto;" />
  </div>
  <p style="margin: 0; font-weight: 900; color: #000000; font-size: 18px; letter-spacing: -0.5px;">Nelly Agbogu</p>
  <p style="margin: 0; color: #10b981; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">Co-Founder, Slasham</p>
`);

export const otpTemplate = (name: string, code: string) => layout(`
  <h1 style="font-size: 32px; font-weight: 900; color: #000000; margin-top: 0; margin-bottom: 24px; letter-spacing: -1px;">Verify your identity.</h1>
  <p style="font-size: 16px; color: #000000; margin-bottom: 32px;">Hi ${name}, please use the secure code below to complete your Slasham registration.</p>
  
  <div style="border: 2px solid #000000; padding: 40px; border-radius: 4px; text-align: center; margin-bottom: 32px;">
    <div style="font-size: 56px; font-weight: 900; color: #10b981; letter-spacing: 12px; font-family: monospace;">${code}</div>
  </div>
  
  <p style="font-size: 12px; color: #666666; text-align: center; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">This code expires in 10 minutes.</p>
`);

export const merchantOnboardingTemplate = (name: string, email: string, tempPassword: string, clientUrl: string) => layout(`
  <h1 style="font-size: 32px; font-weight: 900; color: #000000; margin-top: 0; margin-bottom: 24px; letter-spacing: -1px;">Welcome to the Network. 🚀</h1>
  <p style="font-size: 18px; color: #000000; margin-bottom: 32px; font-weight: 700;">Hi ${name}, your application has been verified. You are now a certified Slasham Partner.</p>
  
  <p style="font-size: 16px; color: #000000; margin-bottom: 32px; line-height: 1.8;">
    Congratulations! Your business is now part of Nigeria's premier lifestyle marketplace. We've created your partner account with the following credentials:
  </p>

  <div style="border: 1px solid #000000; padding: 30px; margin-bottom: 40px; border-radius: 4px;">
    <p style="font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; color: #10b981; margin-bottom: 20px;">Secure Access Credentials</p>
    <p style="font-size: 16px; margin-bottom: 12px;"><strong>Login Email:</strong> <span style="color: #000000;">${email}</span></p>
    <p style="font-size: 16px; margin: 0;"><strong>Temporary Password:</strong> <span style="background: #10b981; color: #ffffff; padding: 4px 8px; font-weight: 900; border-radius: 4px;">${tempPassword}</span></p>
  </div>

  <h3 style="font-size: 14px; font-weight: 900; text-transform: uppercase; color: #000000; letter-spacing: 0.1em; margin-bottom: 20px;">Next Steps for Success</h3>
  <div style="font-size: 15px; color: #000000; margin-bottom: 40px; line-height: 1.8;">
    <strong style="color: #10b981;">1. Secure Your Account:</strong> Log in and immediately change your temporary password to something secure.<br>
    <strong style="color: #10b981;">2. Complete Your Profile:</strong> Upload your high-resolution business logo and a captivating banner to attract customers.<br>
    <strong style="color: #10b981;">3. Create Your First Campaign:</strong> Submit your deal for review. Once approved, it goes live to thousands of Slasham users.<br>
    <strong style="color: #10b981;">4. Download the Scanner:</strong> Prepare your staff to scan customer vouchers using our digital terminal.
  </div>

  <div style="border: 2px solid #10b981; padding: 2px; display: inline-block; border-radius: 12px;">
    <a href="${clientUrl}/merchant/login" style="display: inline-block; background: #000000; color: #ffffff; padding: 20px 40px; border-radius: 10px; text-decoration: none; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em;">Launch Partner Console</a>
  </div>
`);

export const merchantApplicationReceivedTemplate = (name: string) => layout(`
  <h1 style="font-size: 32px; font-weight: 900; color: #000000; margin-top: 0; margin-bottom: 24px; letter-spacing: -1px;">Application Received. 📥</h1>
  <p style="font-size: 18px; color: #000000; margin-bottom: 32px;">Hi ${name}, thank you for your interest in joining the Slasham Partner Network.</p>
  
  <p style="font-size: 16px; color: #000000; margin-bottom: 24px; line-height: 1.8;">Our verification team has received your application and is currently reviewing your business details. This process typically takes 24-48 hours.</p>
  
  <div style="border-left: 4px solid #10b981; padding: 30px; margin-bottom: 40px;">
    <h3 style="font-size: 14px; font-weight: 900; color: #000000; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px;">What happens next?</h3>
    <ul style="font-size: 15px; color: #000000; padding-left: 20px; margin: 0; line-height: 2;">
      <li>We verify your business registration and social presence.</li>
      <li>Once approved, you'll receive your login credentials via email.</li>
      <li>You can then start listing your first deals!</li>
    </ul>
  </div>
  
  <p style="font-size: 15px; color: #000000; font-weight: 700;">If we need any additional information, a member of our team will reach out to you directly.</p>
`);

export const merchantRejectionTemplate = (name: string, reason: string, clientUrl: string) => layout(`
  <h1 style="font-size: 32px; font-weight: 900; color: #000000; margin-top: 0; margin-bottom: 24px; letter-spacing: -1px;">Application Update.</h1>
  <p style="font-size: 18px; color: #000000; margin-bottom: 32px;">Hi ${name}, thank you for your interest in joining the Slasham Partner Network.</p>
  
  <p style="font-size: 16px; color: #000000; margin-bottom: 24px; line-height: 1.8;">After reviewing your submission, our verification team is unable to approve your application at this time for the following reason:</p>
  
  <div style="border-left: 4px solid #e11d48; padding: 24px; margin-bottom: 32px; background: #ffffff;">
    <p style="font-size: 15px; color: #000000; font-weight: 700; margin: 0; line-height: 1.6;">"${reason}"</p>
  </div>
  
  <p style="font-size: 15px; color: #000000; margin-bottom: 32px; line-height: 1.8;">You are welcome to re-apply once these requirements have been met. If you believe this is an error, please reach out to our support team.</p>
  
  <div style="border: 2px solid #000000; padding: 2px; display: inline-block; border-radius: 12px;">
    <a href="${clientUrl}/contact" style="display: inline-block; background: #ffffff; color: #000000; padding: 16px 32px; border-radius: 10px; text-decoration: none; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em;">Contact Support</a>
  </div>
`);

export const couponPurchasedTemplate = (name: string, dealTitle: string, voucherCode: string, price: string, clientUrl: string) => layout(`
  <h1 style="font-size: 32px; font-weight: 900; color: #000000; margin-top: 0; margin-bottom: 24px; letter-spacing: -1px;">It's Yours. 🎟️</h1>
  <p style="font-size: 18px; color: #000000; margin-bottom: 32px;">Hi ${name}, your voucher for <strong>${dealTitle}</strong> is ready for use.</p>
  
  <div style="border: 2px dashed #000000; padding: 48px; text-align: center; margin-bottom: 40px;">
    <p style="font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; color: #10b981; margin-bottom: 12px;">Secure Voucher Code</p>
    <div style="font-size: 56px; font-weight: 900; color: #000000; letter-spacing: 4px; font-family: monospace; margin-bottom: 16px;">${voucherCode}</div>
    <p style="font-size: 14px; color: #000000; font-weight: 700;">Paid: <span style="color: #10b981;">₦${price}</span></p>
  </div>

  <h3 style="font-size: 14px; font-weight: 900; color: #000000; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px;">How to Redeem</h3>
  <div style="font-size: 15px; color: #000000; margin-bottom: 40px; line-height: 2;">
    1. Visit the venue and present this code.<br>
    2. Staff will verify and apply your discount.<br>
    3. Enjoy the Slasham experience.
  </div>

  <div style="border: 2px solid #10b981; padding: 2px; display: inline-block; border-radius: 12px;">
    <a href="${clientUrl}/user/coupons" style="display: inline-block; background: #000000; color: #ffffff; padding: 20px 40px; border-radius: 10px; text-decoration: none; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em;">View My Wallet</a>
  </div>
`);

export const couponRedeemedTemplate = (name: string, dealTitle: string, clientUrl: string) => layout(`
  <h1 style="font-size: 32px; font-weight: 900; color: #000000; margin-top: 0; margin-bottom: 24px; letter-spacing: -1px;">Experience Complete. ✅</h1>
  <p style="font-size: 18px; color: #000000; margin-bottom: 32px;">Hi ${name}, your voucher for <strong>${dealTitle}</strong> has been successfully redeemed.</p>
  
  <div style="border: 2px solid #10b981; padding: 32px; text-align: center; margin-bottom: 40px; border-radius: 4px;">
    <p style="font-size: 16px; color: #000000; margin-bottom: 24px; line-height: 1.6;">We hope you enjoyed it! Leave a review now to earn <strong style="color: #10b981;">100 SlashPoints</strong>.</p>
    <a href="${clientUrl}/user/coupons" style="display: inline-block; background: #000000; color: #ffffff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; font-size: 14px;">Rate Your Experience</a>
  </div>
`);

export const couponExpiringTemplate = (name: string, dealTitle: string, hoursLeft: number, clientUrl: string) => layout(`
  <h1 style="font-size: 32px; font-weight: 900; color: #000000; margin-top: 0; margin-bottom: 24px; letter-spacing: -1px;">Don't miss out. ⏳</h1>
  <p style="font-size: 18px; color: #000000; margin-bottom: 32px;">Hi ${name}, your voucher for <strong>${dealTitle}</strong> expires in less than ${hoursLeft} hours.</p>
  
  <div style="border-left: 4px solid #000000; padding: 24px; margin-bottom: 40px;">
    <p style="font-size: 16px; color: #000000; font-weight: 700; margin: 0; line-height: 1.6;">Use it today to claim your exclusive discount before it's gone.</p>
  </div>

  <div style="border: 2px solid #000000; padding: 2px; display: inline-block; border-radius: 12px;">
    <a href="${clientUrl}/user/coupons" style="display: inline-block; background: #000000; color: #ffffff; padding: 20px 40px; border-radius: 10px; text-decoration: none; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em;">View Voucher</a>
  </div>
`);

export const merchantReviewAlertTemplate = (merchantName: string, rating: number, comment: string, clientUrl: string) => layout(`
  <h1 style="font-size: 32px; font-weight: 900; color: #000000; margin-top: 0; margin-bottom: 24px; letter-spacing: -1px;">New Customer Voice. ⭐</h1>
  <p style="font-size: 18px; color: #000000; margin-bottom: 32px;">Hi ${merchantName}, you've just received a new review on Slasham.</p>
  
  <div style="border: 2px solid #000000; padding: 32px; margin-bottom: 32px; border-radius: 4px;">
    <div style="font-size: 24px; margin-bottom: 16px;">${Array(rating).fill('⭐').join('')}</div>
    <p style="font-size: 18px; color: #000000; font-style: italic; margin: 0; line-height: 1.6;">"${comment}"</p>
  </div>

  <a href="${clientUrl}/merchant/reviews" style="display: inline-block; background: #000000; color: #ffffff; padding: 18px 32px; border-radius: 8px; text-decoration: none; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; font-size: 14px;">Respond to Customer</a>
`);

export const merchantPurchaseAlertTemplate = (merchantName: string, dealTitle: string, customerName: string, clientUrl: string) => layout(`
  <h1 style="font-size: 32px; font-weight: 900; color: #000000; margin-top: 0; margin-bottom: 24px; letter-spacing: -1px;">Incoming Revenue. 💰</h1>
  <p style="font-size: 18px; color: #000000; margin-bottom: 32px;">Hi ${merchantName}, <strong>${customerName}</strong> just purchased <strong>${dealTitle}</strong>.</p>
  
  <div style="border-left: 4px solid #10b981; padding: 24px; margin-bottom: 40px;">
    <p style="font-size: 16px; color: #000000; font-weight: 700; margin: 0; line-height: 1.6;">Prepare for their visit! You can track all purchases in your partner console.</p>
  </div>

  <a href="${clientUrl}/merchant/dashboard" style="display: inline-block; background: #000000; color: #ffffff; padding: 18px 32px; border-radius: 8px; text-decoration: none; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; font-size: 14px;">View Dashboard</a>
`);

export const adminDisputeAlertTemplate = (dealTitle: string, reason: string, customerEmail: string, clientUrl: string) => layout(`
  <h1 style="font-size: 32px; font-weight: 900; color: #000000; margin-top: 0; margin-bottom: 24px; letter-spacing: -1px;">Dispute Alert. ⚠️</h1>
  <p style="font-size: 18px; color: #000000; margin-bottom: 32px;">A new dispute requires your immediate attention.</p>
  
  <div style="border: 2px solid #000000; padding: 32px; margin-bottom: 32px; border-radius: 4px;">
    <p style="font-size: 15px; color: #000000; margin-bottom: 8px;"><strong>Deal:</strong> ${dealTitle}</p>
    <p style="font-size: 15px; color: #000000; margin-bottom: 8px;"><strong>Customer:</strong> ${customerEmail}</p>
    <p style="font-size: 15px; color: #000000; margin: 0;"><strong>Reason:</strong> ${reason}</p>
  </div>

  <a href="${clientUrl}/admin/reports" style="display: inline-block; background: #000000; color: #ffffff; padding: 18px 32px; border-radius: 8px; text-decoration: none; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; font-size: 14px;">Review Dispute</a>
`);

export const campaignStatusUpdateTemplate = (merchantName: string, campaignTitle: string, status: string, notes: string | undefined, clientUrl: string) => layout(`
  <h1 style="font-size: 32px; font-weight: 900; color: #000000; margin-top: 0; margin-bottom: 24px; letter-spacing: -1px;">
    Campaign ${status === 'APPROVED' ? 'Approved! 🚀' : 'Update 📥'}
  </h1>
  <p style="font-size: 18px; color: #000000; margin-bottom: 32px;">Hi ${merchantName}, your campaign request for <strong>${campaignTitle}</strong> has been ${status.toLowerCase()}.</p>
  
  <div style="border-left: 4px solid ${status === 'APPROVED' ? '#10b981' : '#000000'}; padding: 24px; margin-bottom: 40px;">
    <p style="font-size: 16px; color: #000000; font-weight: 700; margin-bottom: ${notes ? '12px' : '0'}; line-height: 1.6;">Status: ${status}</p>
    ${notes ? `<p style="font-size: 14px; color: #000000; margin: 0; line-height: 1.6;"><strong>Admin Notes:</strong> ${notes}</p>` : ''}
  </div>

  <div style="border: 2px solid #10b981; padding: 2px; display: inline-block; border-radius: 12px;">
    <a href="${clientUrl}/merchant/campaigns" style="display: inline-block; background: #000000; color: #ffffff; padding: 20px 40px; border-radius: 10px; text-decoration: none; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em;">Go to My Campaigns</a>
  </div>
`);

export const campaignSubmittedTemplate = (merchantName: string, campaignTitle: string) => layout(`
  <h1 style="font-size: 32px; font-weight: 900; color: #000000; margin-top: 0; margin-bottom: 24px; letter-spacing: -1px;">Campaign Submitted. ⚡</h1>
  <p style="font-size: 18px; color: #000000; margin-bottom: 32px; font-weight: 700;">Hi ${merchantName}, your campaign is now under review.</p>

  <p style="font-size: 16px; color: #000000; margin-bottom: 24px; line-height: 1.8;">
    We've received your campaign submission for <strong>${campaignTitle}</strong>. Our team will review it within 24 hours and notify you once it's approved or if any changes are needed.
  </p>

  <div style="border-left: 4px solid #10b981; padding: 30px; margin-bottom: 40px;">
    <h3 style="font-size: 14px; font-weight: 900; color: #000000; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px;">What happens next?</h3>
    <ul style="margin: 0; padding: 0; list-style: none;">
      <li style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #000000;">
        <strong>1. Review</strong> — Our team checks your campaign details (24hrs)
      </li>
      <li style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #000000;">
        <strong>2. Approval</strong> — You'll receive an email once approved or rejected
      </li>
      <li style="padding: 10px 0; font-size: 14px; color: #000000;">
        <strong>3. Live</strong> — Approved campaigns go live to thousands of Slasham users
      </li>
    </ul>
  </div>
`);
