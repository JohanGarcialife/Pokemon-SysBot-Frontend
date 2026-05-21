import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://owzfcsfykvfzumfqqkjs.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93emZjc2Z5a3ZmenVtZnFxa2pzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTcwODQwOSwiZXhwIjoyMDg1Mjg0NDA5fQ.NMI_ij0T8bNTct19rv5Jr3OKIVfyYkqjx6XucV8ytOg';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  console.log('Fetching last 5 orders...');
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching orders:', error);
    return;
  }

  console.log('Orders found:', data.length);
  for (const row of data) {
    console.log('--------------------------------------------------');
    console.log(`ID: ${row.id}`);
    console.log(`Status: ${row.status}`);
    console.log(`Trade Code: ${row.trade_code}`);
    console.log(`Game Version: ${row.game_version}`);
    console.log(`Created At: ${row.created_at}`);
    console.log('Payload:', JSON.stringify(row.team_payload, null, 2));
  }
}

check();
