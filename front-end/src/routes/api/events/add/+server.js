// src/routes/api/events/add/+server.js
import { query } from '$lib/db';

export async function POST({ request }) {
  const { title, event_date } = await request.json();
  
  try {
    await query(
      'INSERT INTO events (title, event_date) VALUES (?, ?)',
      [title, event_date] // Already formatted as YYYY-MM-DD
    );
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}