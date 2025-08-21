import { query } from '$lib/db';
import { json } from '@sveltejs/kit';

export async function POST({ params }) {
  try {
    const { id } = params;
    
    await query(
      'DELETE FROM events WHERE id = ?',
      [id]
    );
    
    return json({ success: true, message: 'Reservation rejected' });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}