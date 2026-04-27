import cron from 'node-cron';
import { getSupabaseAdmin } from '../supabase';
import { sendCouponExpiring } from './email';

export const initScheduler = () => {
  // Run every day at 10:00 AM
  cron.schedule('0 10 * * *', async () => {
    console.log('Running expiring voucher check...');
    try {
      const supabase = getSupabaseAdmin();
      if (!supabase) return;

      const now = new Date();
      const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();
      const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

      // Find vouchers expiring in 24-48 hours
      // We use !inner to ensure we only get vouchers where the deal exists and matches the criteria
      const { data: expiringVouchers, error } = await supabase
        .from('vouchers')
        .select(`
          id,
          voucher_code,
          users ( email, name ),
          deals!inner (
            title,
            expiry_date
          )
        `)
        .eq('status', 'ACTIVE')
        .lt('deals.expiry_date', in48Hours)
        .gt('deals.expiry_date', in24Hours);

      if (error) {
        console.error('Error fetching expiring vouchers:', error);
        return;
      }

      console.log(`[Scheduler] Found ${expiringVouchers?.length || 0} expiring vouchers.`);

      if (expiringVouchers) {
        for (const v of expiringVouchers) {
          const user = v.users as any;
          const deal = v.deals as any;

          if (user?.email) {
            try {
              await sendCouponExpiring(user.email, user.name, deal.title, 48);
              console.log(`[Scheduler] Sent expiry reminder to ${user.email} for "${deal.title}"`);
            } catch (emailErr) {
              console.error(`[Scheduler] Failed to send email to ${user.email}:`, emailErr);
            }
          }
        }
      }
    } catch (err) {
      console.error('[Scheduler] Critical Error:', err);
    }
  });

  console.log('[Scheduler] Expiring voucher cron initialized (10:00 AM daily)');
};
