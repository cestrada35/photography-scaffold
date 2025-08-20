// src/routes/api/events/debug/+server.js
import { query } from '$lib/db';

export async function GET() {
  try {
    const [result] = await query('SHOW CREATE TABLE events');
    const tableInfo = result[0]['Create Table'];
    
    const events = await query('SELECT * FROM events');
    
    return new Response(JSON.stringify({
      table_structure: tableInfo,
      events: events
    }, null, 2));
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}