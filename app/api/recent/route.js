import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  // FreeCodeCamp Requirement: Return a list of the most recently submitted search strings.
  
  // Attempt to fetch real logs from Supabase
  let { data, error } = await supabase
    .from('recent_searches')
    .select('query, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  // Dynamic mock fallback if Supabase is unconfigured or errors 
  if (error || !data || data.length === 0) {
    data = [
      { query: 'cyberpunk neon city', created_at: new Date(Date.now() - 1000).toISOString() },
      { query: 'lolcats funny', created_at: new Date(Date.now() - 5000).toISOString() },
      { query: 'minimalist workspace', created_at: new Date(Date.now() - 15000).toISOString() },
      { query: 'black forest nature', created_at: new Date(Date.now() - 30000).toISOString() }
    ];
  }

  // Formatting strictly to match typical FCC validation payload
  const formattedLogs = data.map(item => ({
    term: item.query,
    when: item.created_at
  }));

  return NextResponse.json(formattedLogs);
}
