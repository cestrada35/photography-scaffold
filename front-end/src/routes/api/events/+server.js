// src/routes/api/events/+server.js
import { query } from '$lib/db';

export async function GET() {
  try {
    const events = await query(`
      SELECT 
        id, 
        title, 
        DATE_FORMAT(event_date, '%Y-%m-%d') AS event_date,
        customer_name,
        customer_email,
        service_type,
        hours,
        notes,
        status
      FROM events 
      ORDER BY event_date
    `);
    
    return new Response(JSON.stringify(events));
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}