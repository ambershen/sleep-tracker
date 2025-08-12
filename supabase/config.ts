import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ntrumjfllzlxtvcdzqwh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50cnVtamZsbHpseHR2Y2R6cXdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NjYzODEsImV4cCI6MjA3MDA0MjM4MX0.Pu7Tuu7X3uS-36kTE0183xT-GTFpBar3q8Q8ilowlwQ'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50cnVtamZsbHpseHR2Y2R6cXdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQ2NjM4MSwiZXhwIjoyMDcwMDQyMzgxfQ.xU_pnmyW75Y0PtFgbtRqGoZGfrxq_wVISLX7imNKiOw'

// Client for frontend use (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client for backend use (service role key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export { supabaseUrl, supabaseAnonKey, supabaseServiceKey }