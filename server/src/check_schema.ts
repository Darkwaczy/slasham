import { getSupabaseAdmin } from './supabase';
import dotenv from 'dotenv';
dotenv.config();

async function checkSchema() {
    const supabase = getSupabaseAdmin();
    if (!supabase) return console.log("Supabase not found");
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .limit(1);
    
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Columns:', Object.keys(data[0] || {}));
    }
}

checkSchema();
