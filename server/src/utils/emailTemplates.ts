export const layout = (content: string, showUnsubscribe = false) => `
  <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #ffffff; padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 40px;">
        <img src="http://localhost:3000/assets/slashamlogo.png" alt="Slasham Logo" style="height: 200px; width: auto;" />
      </div>
      <div style="color: #334155; line-height: 1.6; font-size: 16px;">
        ${content}
      </div>
      <div style="margin-top: 48px; border-top: 1px solid #e2e8f0; padding-top: 24px; text-align: center;">
        <p style="margin: 0; font-size: 13px; font-weight: 800; color: #94a3b8;">
          Slasham <span style="font-weight: normal; opacity: 0.8;">| Lagos | Abuja ${showUnsubscribe ? '| <a href="#" style="color: #94a3b8; text-decoration: underline;">Unsubscribe</a>' : ''}</span>
        </p>
      </div>
    </div>
  </div>
`;

export const userWelcomeTemplate = (name: string) => layout(`
  <h2 style="font-size: 24px; font-weight: 800; color: #334155; margin-top: 0; margin-bottom: 8px;">You're officially in.</h2>
  <p style="font-size: 16px; margin-bottom: 24px;">Hi, ${name}</p>
  <p style="font-size: 16px; margin-bottom: 32px;">Welcome to Slasham—your ticket to a premium lifestyle for less. You've just unlocked access to the most exclusive deals in Nigeria, from 50% off luxury spa sessions to 2-for-1 fine dining.</p>
  
  <h3 style="font-size: 18px; font-weight: 800; color: #334155; margin-top: 0; margin-bottom: 12px;">Your First Reward</h3>
  <p style="font-size: 16px; margin-bottom: 40px;">We've automatically added <span style="background-color: #fef08a; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: #334155;">500 SlashPoints</span> to your account. Use them to get even deeper discounts on your very first purchase.</p>
  
  <a href="https://slasham.com/#/deals" style="display: block; width: 100%; box-sizing: border-box; background-color: #059669; color: #ffffff; text-align: center; padding: 18px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 16px; letter-spacing: 1px;">EXPLORE TRENDING DEALS</a>
`, true);

export const founderWelcomeTemplate = (name: string) => layout(`
  <p style="margin-bottom: 24px;">Hi ${name},</p>
  
  <p style="margin-bottom: 24px;">I wanted to personally thank you for joining the Slasham community.</p>
  
  <p style="margin-bottom: 24px;">I started Slasham because I was tired of seeing great local businesses struggle to reach customers, and tired of seeing customers pay full price for everything. I wanted to build something that felt premium, worked seamlessly, and actually saved people money.</p>
  
  <p style="margin-bottom: 24px;">We're still growing, and we're constantly adding new partners in Lagos and Abuja.</p>
  
  <p style="margin-bottom: 24px;">If you ever have feedback, a question, or a business you'd love to see on the platform—just hit reply to this email. It comes straight to my inbox, and I actually read these.</p>
  
  <p style="margin-bottom: 32px;">Enjoy the savings!</p>
  
  <p style="margin-bottom: 4px;">Best,</p>
  <div style="margin-top: 12px; margin-bottom: 12px;">
    <img src="https://readme-typing-svg.demolab.com?font=Dancing+Script&size=32&duration=3000&pause=1000&color=059669&center=false&vCenter=true&width=300&lines=Nelly+Agbogu" alt="Nelly Agbogu Signature" style="height: 40px;" />
  </div>
  <p style="margin: 0; color: #64748b;">Co-Founder, Slasham</p>
`);

export const otpTemplate = (name: string, code: string) => layout(`
  <h2 style="font-size: 24px; font-weight: 800; color: #334155; margin-top: 0; margin-bottom: 8px;">Verify your email</h2>
  <p style="font-size: 16px; margin-bottom: 16px;">Hi, ${name}</p>
  <p style="font-size: 16px; margin-bottom: 32px;">Please use the 6-digit code below to secure your account and complete your registration.</p>
  
  <div style="font-size: 40px; font-weight: 900; color: #059669; letter-spacing: 4px; margin-bottom: 32px; text-align: center; background: #f8fafc; padding: 24px; border-radius: 12px; border: 1px dashed #cbd5e1;">
    ${code}
  </div>
  
  <p style="font-size: 14px; color: #64748b; margin-bottom: 10px; text-align: center;">This code will expire in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
`);

export const couponPurchasedTemplate = (name: string, dealTitle: string, voucherCode: string, price: string) => layout(`
  <h2 style="color: #334155; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 10px;">Hi, ${name}!</h2>
  <p style="font-size: 16px; margin-bottom: 24px;">Your purchase of <strong>${dealTitle}</strong> was successful. Here is your digital voucher.</p>
  
  <div style="background-color: #f8fafc; border: 2px dashed #e2e8f0; padding: 32px; border-radius: 12px; text-align: center; margin-bottom: 32px; position: relative;">
    <p style="margin: 0; font-size: 12px; color: #94a3b8; text-transform: uppercase; font-weight: 800; letter-spacing: 0.1em; margin-bottom: 8px;">Voucher Code</p>
    <h3 style="margin: 0; font-size: 32px; font-weight: 900; color: #059669; letter-spacing: 2px; font-family: monospace;">${voucherCode}</h3>
    <p style="margin-top: 16px; font-size: 14px; color: #64748b;">Paid: <strong>₦${price}</strong></p>
  </div>

  <div style="margin-bottom: 32px;">
    <h4 style="font-size: 14px; font-weight: 800; color: #334155; margin-bottom: 12px; text-transform: uppercase;">How to redeem:</h4>
    <ol style="font-size: 14px; color: #64748b; padding-left: 20px; margin: 0;">
      <li style="margin-bottom: 8px;">Visit the venue and show this code to the staff.</li>
      <li style="margin-bottom: 8px;">They will verify the code and apply your discount.</li>
      <li>Enjoy your experience!</li>
    </ol>
  </div>

  <a href="https://slasham.com/#/my-coupons" style="display: block; background-color: #059669; color: #ffffff; text-align: center; padding: 18px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 16px;">View My Wallet</a>
`);

export const couponRedeemedTemplate = (name: string, dealTitle: string) => layout(`
  <h2 style="color: #334155; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 20px;">Hi, ${name}!</h2>
  <div style="text-align: left; margin-bottom: 32px;">
    <div style="width: 64px; height: 64px; background-color: #f0fdf4; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: #166534; padding: 0;">
        <span style="font-size: 32px;">✅</span>
    </div>
  </div>
  <p style="font-size: 16px; text-align: left; margin-bottom: 24px;">Your voucher for <strong>${dealTitle}</strong> has been successfully redeemed. We hope you had a fantastic experience!</p>
  
  <div style="background-color: #fff7ed; padding: 24px; border-radius: 8px; text-align: left;">
    <p style="color: #9a3412; font-size: 14px; margin-bottom: 16px;">How was it? Leave a review and earn <span style="background-color: #fef08a; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: #334155;">100 SlashPoints</span>!</p>
    <a href="https://slasham.com/#/my-coupons" style="color: #c2410c; font-weight: 800; text-decoration: underline; font-size: 14px;">Leave a Review</a>
  </div>
`);

export const merchantOnboardingTemplate = (name: string, email: string, tempPassword: string) => layout(`
  <h2 style="color: #334155; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 20px;">Hi, ${name}! 🚀</h2>
  <p style="font-size: 16px; margin-bottom: 24px;">Your application has been verified and approved. Welcome to the Slasham Partner Network.</p>
  
  <div style="background-color: #f8fafc; padding: 24px; border-radius: 8px; margin-bottom: 32px;">
    <p style="font-size: 15px; margin-bottom: 8px;"><strong>Login Email:</strong> ${email}</p>
    <p style="font-size: 15px; margin: 0;"><strong>Password:</strong> <code style="background-color: #e2e8f0; padding: 4px 8px; border-radius: 4px; color: #334155;">${tempPassword}</code></p>
  </div>

  <a href="https://slasham.com/#/merchant/login" style="display: block; background-color: #0f172a; color: #ffffff; text-align: center; padding: 18px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 16px;">Access Merchant Console</a>
`);

export const couponExpiringTemplate = (name: string, dealTitle: string, hoursLeft: number) => layout(`
  <h2 style="color: #334155; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 20px;">Hi, ${name}! ⏳</h2>
  <p style="font-size: 16px; margin-bottom: 24px;">Don't let your savings vanish! Your voucher for <strong>${dealTitle}</strong> is set to expire in less than <strong>${hoursLeft} hours</strong>.</p>
  
  <div style="background-color: #fff1f2; padding: 24px; border-radius: 8px; text-align: left; margin-bottom: 32px;">
    <p style="color: #e11d48; font-size: 14px; font-weight: 800; margin: 0;">Use it or lose it! Visit the venue today to claim your deal.</p>
  </div>

  <a href="https://slasham.com/#/my-coupons" style="display: block; background-color: #e11d48; color: #ffffff; text-align: center; padding: 18px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 16px;">View Voucher Details</a>
`);

export const merchantReviewAlertTemplate = (merchantName: string, rating: number, comment: string) => layout(`
  <h2 style="color: #334155; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 20px;">Hi, ${merchantName}! ⭐</h2>
  <p style="font-size: 16px; margin-bottom: 24px;">A customer just left a new review for your business.</p>
  
  <div style="background-color: #f8fafc; padding: 24px; border-radius: 8px; margin-bottom: 32px;">
    <div style="margin-bottom: 12px; font-size: 20px;">
       ${Array(rating).fill('⭐').join('')}
    </div>
    <p style="font-size: 15px; color: #334155; font-style: italic; margin: 0;">"${comment}"</p>
  </div>

  <p style="font-size: 14px; color: #64748b; margin-bottom: 24px;">Responding to reviews increases customer loyalty by up to 30%. Head over to your dashboard to reply.</p>

  <a href="https://slasham.com/#/merchant/reviews" style="display: block; background-color: #0f172a; color: #ffffff; text-align: center; padding: 18px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 16px;">Reply to Review</a>
`);

export const merchantPurchaseAlertTemplate = (merchantName: string, dealTitle: string, customerName: string) => layout(`
  <h2 style="color: #334155; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 20px;">Hi, ${merchantName}! 💰</h2>
  <p style="font-size: 16px; margin-bottom: 24px;">Great news! <strong>${customerName}</strong> just purchased a voucher for <strong>${dealTitle}</strong>.</p>
  
  <div style="background-color: #f0fdf4; padding: 24px; border-radius: 8px; text-align: left; margin-bottom: 32px;">
    <p style="color: #166534; font-size: 14px; font-weight: 800; margin: 0;">New revenue confirmed. Expect them to visit soon!</p>
  </div>

  <a href="https://slasham.com/#/merchant/dashboard" style="display: block; background-color: #059669; color: #ffffff; text-align: center; padding: 18px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 16px;">View Dashboard</a>
`);

export const adminDisputeAlertTemplate = (dealTitle: string, reason: string, customerEmail: string) => layout(`
  <h2 style="color: #334155; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 20px;">Hi, Admin! ⚠️</h2>
  <p style="font-size: 16px; margin-bottom: 24px;">A new dispute has been filed regarding a transaction.</p>
  
  <div style="background-color: #fff1f2; padding: 24px; border-radius: 8px; margin-bottom: 32px;">
    <p style="font-size: 14px; margin-bottom: 8px;"><strong>Deal:</strong> ${dealTitle}</p>
    <p style="font-size: 14px; margin-bottom: 8px;"><strong>Customer:</strong> ${customerEmail}</p>
    <p style="font-size: 14px; margin: 0;"><strong>Reason:</strong> ${reason}</p>
  </div>

  <a href="https://slasham.com/#/admin/reports" style="display: block; background-color: #e11d48; color: #ffffff; text-align: center; padding: 18px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 16px;">Review Dispute</a>
`);
