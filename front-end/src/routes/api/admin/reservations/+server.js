import { query } from '$lib/db';

export async function GET() {
  try {
    // Get all reservations, ordered by most recent first
    const reservations = await query(`
      SELECT * FROM events 
      ORDER BY created_at DESC
    `);
    
    return new Response(JSON.stringify(reservations), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500 }
    );
  }
}

export async function PATCH({ request, params }) {
  try {
    const { status } = await request.json();
    const reservationId = params.id;
    
    if (!reservationId || !status) {
      return new Response(
        JSON.stringify({ error: 'Missing reservation ID or status' }), 
        { status: 400 }
      );
    }
    
    // Update the reservation status
    await query(
      'UPDATE events SET status = ? WHERE id = ?',
      [status, reservationId]
    );
    
    return new Response(
      JSON.stringify({ success: true, message: 'Reservation updated successfully' }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating reservation:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500 }
    );
  }
}


// Wait a sec DS, I've