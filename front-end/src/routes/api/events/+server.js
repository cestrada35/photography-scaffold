// src/routes/api/events/+server.js
import { query } from '$lib/db';

export async function GET() {
  try {
    const events = await query(`
      SELECT 
        id, 
        title, 
        DATE_FORMAT(event_date, '%Y-%m-%d') AS event_date 
      FROM events 
      ORDER BY event_date
    `);
    
    // Add debug logging
    console.log('API returning events:', events.map(e => ({
      ...e,
      debug: `Parsed as: ${new Date(e.event_date).toISOString()}`
    })));
    
    return new Response(JSON.stringify(events));
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}