import { getSupabaseAdmin } from '../supabase';
import { randomUUID } from 'crypto';

async function checkAdmin() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error('Admin client not initialized');
    return;
  }

  const testId = randomUUID();
  console.log('Testing insert with ID:', testId);

  const { data, error } = await supabase.from('users').insert({
    id: testId,
    email: `test_${Date.now()}@example.com`,
    name: 'Test Admin Insert',
    role: 'USER'
  }).select();

  if (error) {
    console.error('Insert failed:', error);
  } else {
    console.log('Insert succeeded:', data);
    // Cleanup
    await supabase.from('users').delete().eq('id', testId);
    console.log('Cleanup successful');
  }
}

checkAdmin();
