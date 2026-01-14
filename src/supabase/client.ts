import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sbzhhhjovutfbzmbxtyn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiemhoaGpvdnV0ZmJ6bWJ4dHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNTE2MDIsImV4cCI6MjA4MDkyNzYwMn0.tmLb19ojKozSJtKjHRirdXrekWlEVf_TKTWA8KxdEng"

export const supabase = createClient(supabaseUrl, supabaseAnonKey);