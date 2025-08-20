// src/routes/api/reservations/add/+server.js
import { query } from '$lib/db';

export async function POST({ request }) {
  try {
    const { 
      title, 
      event_date, 
      customer_name, 
      customer_email, 
      service_type, 
      hours, 
      notes, 
      status 
    } = await request.json();
    
    // First check if the date is already booked
    const existingEvents = await query(
      'SELECT id FROM events WHERE event_date = ?',
      [event_date]
    );
    
    if (existingEvents.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'This date is already booked. Please select another date.' 
        }), 
        { status: 400 }
      );
    }
    
    // Insert the new reservation
    await query(
      `INSERT INTO events 
       (title, event_date, customer_name, customer_email, service_type, hours, notes, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, event_date, customer_name, customer_email, service_type, hours, notes, status || 'pending']
    );
    
    return new Response(
      JSON.stringify({ success: true, message: 'Reservation created successfully' }), 
      { status: 201 }
    );
  } catch (error) {
    console.error('Reservation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500 }
    );
  }
}