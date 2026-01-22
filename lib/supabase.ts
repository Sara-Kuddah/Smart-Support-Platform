import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nfebbtgbjuebpigzvcyf.supabase.co';
const supabaseKey = 'sb_publishable_iRMCKTKe_b-rtQvzkfvZkA_g6_DYc9z';

export const supabase = createClient(supabaseUrl, supabaseKey);
