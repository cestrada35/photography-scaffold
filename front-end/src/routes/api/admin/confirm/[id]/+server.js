import { query } from '$lib/db';
import { json } from '@sveltejs/kit';

export async function POST({ params }) {
  try {
    const { id } = params;
    
    await query(
      'UPDATE events SET status = "confirmed" WHERE id = ?',
      [id]
    );
    
    return json({ success: true, message: 'Reservation confirmed' });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
