// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Adjust the 'import.meta.env' syntax if you are using Create React App 
// instead of Vite (use 'process.env.REACT_APP_...' for CRA)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);