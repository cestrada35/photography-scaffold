import { query } from '$lib/db';
import { sendReservationEmail } from '$lib/email';

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
      'SELECT id FROM events WHERE event_date = ? AND status = "confirmed"',
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
    const result = await query(
      `INSERT INTO events 
       (title, event_date, customer_name, customer_email, service_type, hours, notes, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, event_date, customer_name, customer_email, service_type, hours, notes, status || 'pending']
    );
    
    
    // Send email notification
    const reservationId = result.insertId;
    await sendReservationEmail({
      id: reservationId,
      customer_name,
      customer_email,
      service_type,
      event_date,
      hours,
      notes
    });
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Reservation created successfully. We will contact you to confirm.' 
      }), 
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