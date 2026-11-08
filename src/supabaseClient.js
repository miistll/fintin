import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://botnydzhuozophanpnur.supabase.co'

const supabaseKey = 'sb_publishable_VjIKVa52oOqNWQAibOFN8g_iFyN5E8v'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)