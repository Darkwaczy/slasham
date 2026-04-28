import { getSupabaseAdmin } from './supabase';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

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
