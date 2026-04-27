export const layout = (content: string, showUnsubscribe = false) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Outfit', -apple-system, sans-serif;">
      <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 32px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;">
        <!-- Header with Gradient Accent -->
        <div style="height: 6px; background: linear-gradient(90deg, #10b981, #3b82f6);"></div>
        
        <div style="padding: 48px 40px;">
          <div style="margin-bottom: 40px; text-align: left;">
            <img src="https://i.ibb.co/LzdYpZ7/slasham-logo.png" alt="Slasham" style="height: 32px; width: auto;" />
          </div>

          <div style="color: #0f172a; line-height: 1.6; font-size: 16px;">
            ${content}
          </div>

          <!-- Footer Section -->
          <div style="margin-top: 48px; padding-top: 32px; border-top: 1px solid #f1f5f9; text-align: left;">
            <p style="margin: 0; font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;">
              Slasham Global <span style="font-weight: 400; opacity: 0.6; margin-left: 8px;"> Lagos • Abuja • London </span>
            </p>
            ${showUnsubscribe ? '<p style="margin-top: 12px; font-size: 11px; color: #cbd5e1;">Too many emails? <a href="#" style="color: #94a3b8; text-decoration: underline;">Adjust your preferences</a></p>' : ''}
          </div>
        </div>
      </div>
    </body>
  </html>
`;

export const userWelcomeTemplate = (name: string) => layout(`
  <h1 style="font-size: 32px; font-weight: 900; color: #0f172a; margin-top: 0; margin-bottom: 16px; tracking: -0.02em;">Welcome to the Inner Circle.</h1>
  <p style="font-size: 18px; color: #64748b; margin-bottom: 32px;">Hi ${name}, you've just unlocked Nigeria's most exclusive lifestyle rewards platform.</p>
  
  <div style="background: #f1f5f9; border-radius: 24px; padding: 32px; margin-bottom: 40px;">
    <h3 style="font-size: 14px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">Your Founding Reward</h3>
    <p style="font-size: 16px; color: #475569; margin: 0;">We've credited <span style="color: #10b981; font-weight: 900;">500 SlashPoints</span> to your wallet. Use them to shave even more off your first fine dining or spa experience.</p>
  </div>
  
  <a href="https://slasham.com/#/deals" style="display: inline-block; background: #0f172a; color: #ffffff; padding: 20px 40px; border-radius: 16px; text-decoration: none; font-weight: 700; font-size: 16px; box-shadow: 0 10px 20px rgba(15, 23, 42, 0.2);">Explore Trending Deals</a>
`, true);

export const founderWelcomeTemplate = (name: string) => layout(`
  <p style="margin-bottom: 24px; font-size: 18px;">Hi ${name},</p>
  
  <p style="margin-bottom: 24px;">I'm Nelly, the co-founder of Slasham. I'm personally reaching out because I want to ensure your experience on our platform is nothing short of exceptional.</p>
  
  <p style="margin-bottom: 24px;">We built Slasham for the modern Nigerian—someone who values premium experiences but knows the power of a smart deal. Our partners are hand-picked to ensure you only ever see the best of what Lagos and Abuja have to offer.</p>
  
  <p style="margin-bottom: 32px;">If you ever have feedback, or if a specific business isn't meeting your expectations, please reply to this email. I read every single message.</p>
  
  <div style="margin-bottom: 8px;">
    <img src="https://readme-typing-svg.demolab.com?font=Dancing+Script&size=32&duration=3000&pause=1000&color=10b981&center=false&vCenter=true&width=300&lines=Nelly+Agbogu" alt="Nelly" style="height: 48px;" />
  </div>
  <p style="margin: 0; font-weight: 700; color: #0f172a;">Nelly Agbogu</p>
  <p style="margin: 0; color: #94a3b8; font-size: 14px;">Co-Founder, Slasham</p>
`);

export const otpTemplate = (name: string, code: string) => layout(`
  <h1 style="font-size: 32px; font-weight: 900; color: #0f172a; margin-top: 0; margin-bottom: 16px;">Verify your identity</h1>
  <p style="font-size: 16px; color: #64748b; margin-bottom: 32px;">Hi ${name}, please use the secure code below to complete your Slasham registration.</p>
  
  <div style="background: #f8fafc; border: 2px solid #f1f5f9; padding: 40px; border-radius: 24px; text-align: center; margin-bottom: 32px;">
    <div style="font-size: 48px; font-weight: 900; color: #10b981; letter-spacing: 8px; font-family: monospace;">${code}</div>
  </div>
  
  <p style="font-size: 13px; color: #94a3b8; text-align: center;">This code expires in 10 minutes. If you didn't request this, you're safe to ignore it.</p>
`);

export const merchantOnboardingTemplate = (name: string, email: string, tempPassword: string) => layout(`
  <h1 style="font-size: 32px; font-weight: 900; color: #0f172a; margin-top: 0; margin-bottom: 16px;">Welcome Onboard. 🚀</h1>
  <p style="font-size: 18px; color: #64748b; margin-bottom: 32px;">Hi ${name}, your application has been verified. You are now a certified Slasham Partner.</p>
  
  <div style="background: #0f172a; border-radius: 24px; padding: 40px; margin-bottom: 40px; color: #ffffff; box-shadow: 0 20px 40px rgba(15, 23, 42, 0.3);">
    <p style="font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #10b981; margin-bottom: 16px;">Partner Credentials</p>
    <p style="font-size: 16px; margin-bottom: 12px; opacity: 0.8;"><strong>Email:</strong> ${email}</p>
    <p style="font-size: 16px; margin: 0;"><strong>Temp Password:</strong> <code style="background: #1e293b; padding: 6px 12px; border-radius: 8px; color: #10b981; margin-left: 8px;">${tempPassword}</code></p>
  </div>

  <a href="https://slasham.com/#/merchant/login" style="display: inline-block; background: #10b981; color: #ffffff; padding: 20px 40px; border-radius: 16px; text-decoration: none; font-weight: 700; font-size: 16px; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);">Launch Merchant Dashboard</a>
`);

export const merchantApplicationReceivedTemplate = (name: string) => layout(`
  <h1 style="font-size: 32px; font-weight: 900; color: #0f172a; margin-top: 0; margin-bottom: 16px;">Application Received. 📥</h1>
  <p style="font-size: 18px; color: #64748b; margin-bottom: 32px;">Hi ${name}, thank you for your interest in joining the Slasham Partner Network.</p>
  
  <p style="font-size: 16px; color: #475569; margin-bottom: 24px;">Our verification team has received your application and is currently reviewing your business details. This process typically takes 24-48 hours.</p>
  
  <div style="background: #f1f5f9; border-radius: 24px; padding: 32px; margin-bottom: 40px;">
    <h3 style="font-size: 14px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">What happens next?</h3>
    <ul style="font-size: 15px; color: #475569; padding-left: 20px; margin: 0;">
      <li style="margin-bottom: 12px;">We verify your business registration and social presence.</li>
      <li style="margin-bottom: 12px;">Once approved, you'll receive your login credentials via email.</li>
      <li>You can then start listing your first deals!</li>
    </ul>
  </div>
  
  <p style="font-size: 15px; color: #64748b;">If we need any additional information, a member of our team will reach out to you directly.</p>
`);

export const merchantRejectionTemplate = (name: string, reason: string) => layout(`
  <h1 style="font-size: 32px; font-weight: 900; color: #0f172a; margin-top: 0; margin-bottom: 16px;">Application Status Update</h1>
  <p style="font-size: 18px; color: #64748b; margin-bottom: 32px;">Hi ${name}, thank you for your interest in joining the Slasham Partner Network.</p>
  
  <p style="font-size: 16px; color: #475569; margin-bottom: 24px;">After reviewing your submission, our verification team is unable to approve your application at this time for the following reason:</p>
  
  <div style="background: #fff1f2; border-left: 4px solid #e11d48; padding: 24px; border-radius: 12px; margin-bottom: 32px;">
    <p style="font-size: 15px; color: #be123c; font-weight: 700; margin: 0;">"${reason}"</p>
  </div>
  
  <p style="font-size: 15px; color: #64748b; margin-bottom: 32px;">You are welcome to re-apply once these requirements have been met. If you believe this is an error, please reach out to our support team.</p>
  
  <a href="https://slasham.com/#/support" style="display: inline-block; border: 2px solid #e2e8f0; color: #0f172a; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px;">Contact Support</a>
`);

export const couponPurchasedTemplate = (name: string, dealTitle: string, voucherCode: string, price: string) => layout(`
  <h1 style="font-size: 32px; font-weight: 900; color: #0f172a; margin-top: 0; margin-bottom: 16px;">It's Yours. 🎟️</h1>
  <p style="font-size: 18px; color: #64748b; margin-bottom: 32px;">Hi ${name}, your voucher for <strong>${dealTitle}</strong> is ready for use.</p>
  
  <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 2px dashed #cbd5e1; padding: 48px; border-radius: 24px; text-align: center; margin-bottom: 40px;">
    <p style="font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 12px;">Secure Voucher Code</p>
    <div style="font-size: 48px; font-weight: 900; color: #0f172a; letter-spacing: 4px; font-family: monospace; margin-bottom: 16px;">${voucherCode}</div>
    <p style="font-size: 14px; color: #64748b;">Paid: <strong style="color: #0f172a;">₦${price}</strong></p>
  </div>

  <p style="font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; margin-bottom: 16px;">How to Redeem</p>
  <div style="font-size: 15px; color: #64748b; margin-bottom: 40px;">
    1. Visit the venue and present this code.<br>
    2. Staff will verify and apply your discount.<br>
    3. Enjoy the Slasham experience.
  </div>

  <a href="https://slasham.com/#/my-coupons" style="display: inline-block; background: #0f172a; color: #ffffff; padding: 20px 40px; border-radius: 16px; text-decoration: none; font-weight: 700; font-size: 16px;">View My Wallet</a>
`);

export const couponRedeemedTemplate = (name: string, dealTitle: string) => layout(`
  <h1 style="font-size: 32px; font-weight: 900; color: #0f172a; margin-top: 0; margin-bottom: 16px;">Experience Complete. ✅</h1>
  <p style="font-size: 18px; color: #64748b; margin-bottom: 32px;">Hi ${name}, your voucher for <strong>${dealTitle}</strong> has been successfully redeemed.</p>
  
  <div style="background: #f0fdf4; border-radius: 24px; padding: 32px; text-align: center; margin-bottom: 40px;">
    <p style="font-size: 16px; color: #166534; margin-bottom: 24px;">We hope you enjoyed it! Leave a review now to earn <strong style="color: #10b981;">100 SlashPoints</strong>.</p>
    <a href="https://slasham.com/#/my-coupons" style="display: inline-block; background: #166534; color: #ffffff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700;">Rate Your Experience</a>
  </div>
`);

export const couponExpiringTemplate = (name: string, dealTitle: string, hoursLeft: number) => layout(`
  <h1 style="font-size: 32px; font-weight: 900; color: #0f172a; margin-top: 0; margin-bottom: 16px;">Don't miss out. ⏳</h1>
  <p style="font-size: 18px; color: #64748b; margin-bottom: 32px;">Hi ${name}, your voucher for <strong>${dealTitle}</strong> expires in less than ${hoursLeft} hours.</p>
  
  <div style="background: #fff1f2; border-radius: 24px; padding: 32px; margin-bottom: 40px;">
    <p style="font-size: 16px; color: #be123c; font-weight: 700; margin: 0;">Use it today to claim your exclusive discount before it's gone.</p>
  </div>

  <a href="https://slasham.com/#/my-coupons" style="display: inline-block; background: #e11d48; color: #ffffff; padding: 20px 40px; border-radius: 16px; text-decoration: none; font-weight: 700;">View Voucher</a>
`);

export const merchantReviewAlertTemplate = (merchantName: string, rating: number, comment: string) => layout(`
  <h1 style="font-size: 32px; font-weight: 900; color: #0f172a; margin-top: 0; margin-bottom: 16px;">New Customer Voice. ⭐</h1>
  <p style="font-size: 18px; color: #64748b; margin-bottom: 32px;">Hi ${merchantName}, you've just received a new review on Slasham.</p>
  
  <div style="background: #f8fafc; border-radius: 24px; padding: 32px; margin-bottom: 32px;">
    <div style="font-size: 24px; margin-bottom: 16px;">${Array(rating).fill('⭐').join('')}</div>
    <p style="font-size: 18px; color: #0f172a; font-style: italic; margin: 0; line-height: 1.6;">"${comment}"</p>
  </div>

  <a href="https://slasham.com/#/merchant/reviews" style="display: inline-block; background: #0f172a; color: #ffffff; padding: 18px 32px; border-radius: 12px; text-decoration: none; font-weight: 700;">Respond to Customer</a>
`);

export const merchantPurchaseAlertTemplate = (merchantName: string, dealTitle: string, customerName: string) => layout(`
  <h1 style="font-size: 32px; font-weight: 900; color: #0f172a; margin-top: 0; margin-bottom: 16px;">Incoming Revenue. 💰</h1>
  <p style="font-size: 18px; color: #64748b; margin-bottom: 32px;">Hi ${merchantName}, <strong>${customerName}</strong> just purchased <strong>${dealTitle}</strong>.</p>
  
  <div style="background: #f0fdf4; border-radius: 24px; padding: 32px; margin-bottom: 40px;">
    <p style="font-size: 16px; color: #166534; font-weight: 700; margin: 0;">Prepare for their visit! You can track all purchases in your partner console.</p>
  </div>

  <a href="https://slasham.com/#/merchant/dashboard" style="display: inline-block; background: #059669; color: #ffffff; padding: 18px 32px; border-radius: 12px; text-decoration: none; font-weight: 700;">View Dashboard</a>
`);

export const adminDisputeAlertTemplate = (dealTitle: string, reason: string, customerEmail: string) => layout(`
  <h1 style="font-size: 32px; font-weight: 900; color: #0f172a; margin-top: 0; margin-bottom: 16px;">Dispute Alert. ⚠️</h1>
  <p style="font-size: 18px; color: #64748b; margin-bottom: 32px;">A new dispute requires your immediate attention.</p>
  
  <div style="background: #fff1f2; border-radius: 24px; padding: 32px; margin-bottom: 32px; border: 1px solid #fecaca;">
    <p style="font-size: 15px; margin-bottom: 8px;"><strong>Deal:</strong> ${dealTitle}</p>
    <p style="font-size: 15px; margin-bottom: 8px;"><strong>Customer:</strong> ${customerEmail}</p>
    <p style="font-size: 15px; margin: 0;"><strong>Reason:</strong> ${reason}</p>
  </div>

  <a href="https://slasham.com/#/admin/reports" style="display: inline-block; background: #e11d48; color: #ffffff; padding: 18px 32px; border-radius: 12px; text-decoration: none; font-weight: 700;">Review Dispute</a>
`);

export const campaignStatusUpdateTemplate = (merchantName: string, campaignTitle: string, status: string, notes?: string) => layout(`
  <h1 style="font-size: 32px; font-weight: 900; color: #0f172a; margin-top: 0; margin-bottom: 16px;">
    Campaign ${status === 'APPROVED' ? 'Approved! 🚀' : 'Update 📥'}
  </h1>
  <p style="font-size: 18px; color: #64748b; margin-bottom: 32px;">Hi ${merchantName}, your campaign request for <strong>${campaignTitle}</strong> has been ${status.toLowerCase()}.</p>
  
  <div style="background: ${status === 'APPROVED' ? '#f0fdf4' : '#fff1f2'}; border-radius: 24px; padding: 32px; margin-bottom: 40px;">
    <p style="font-size: 16px; color: ${status === 'APPROVED' ? '#166534' : '#be123c'}; font-weight: 700; margin-bottom: 12px;">Status: ${status}</p>
    ${notes ? `<p style="font-size: 14px; color: ${status === 'APPROVED' ? '#166534' : '#be123c'}; opacity: 0.8; margin: 0;"><strong>Admin Notes:</strong> ${notes}</p>` : ''}
  </div>

  <a href="https://slasham.com/#/merchant/campaigns" style="display: inline-block; background: #0f172a; color: #ffffff; padding: 20px 40px; border-radius: 16px; text-decoration: none; font-weight: 700; font-size: 16px;">Go to My Campaigns</a>
`);

