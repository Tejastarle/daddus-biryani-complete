import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message?: string;
  status: 'new' | 'contacted' | 'qualified';
  created_at: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
};
