import { getSupabaseAdmin } from '../supabase';
import { sendCouponExpiring } from './email';

/**
 * Logic to check for vouchers expiring in the next 24-48 hours
 * and send email reminders to users.
 */
export const checkExpiringVouchers = async () => {
  console.log('[Cron] Running expiring voucher check...');
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      console.error('[Cron] DB not configured');
      return { success: false, error: 'DB not configured' };
    }

    const now = new Date();
    const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

    // Find vouchers expiring in 24-48 hours
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
      console.error('[Cron] Error fetching expiring vouchers:', error);
      return { success: false, error: error.message };
    }

    const count = expiringVouchers?.length || 0;
    console.log(`[Cron] Found ${count} expiring vouchers.`);

    if (expiringVouchers) {
      for (const v of expiringVouchers) {
        const user = v.users as any;
        const deal = v.deals as any;

        if (user?.email) {
          try {
            await sendCouponExpiring(user.email, user.name, deal.title, 48);
            console.log(`[Cron] Sent expiry reminder to ${user.email} for "${deal.title}"`);
          } catch (emailErr) {
            console.error(`[Cron] Failed to send email to ${user.email}:`, emailErr);
          }
        }
      }
    }
    
    return { success: true, processed: count };
  } catch (err: any) {
    console.error('[Cron] Critical Error:', err);
    return { success: false, error: err.message };
  }
};
