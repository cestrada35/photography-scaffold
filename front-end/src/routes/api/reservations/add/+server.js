import { query } from '$lib/db';
import { sendReservationEmail } from '$lib/email';

export async function POST({ request }) {
  try {
    const reservationData = await request.json();

    // Validate required fields
    if (!reservationData.customer_name || !reservationData.customer_email || !reservationData.service_type) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    // Handle both single date and date range
    let dates = [];
    let isDateRange = false;

    if (reservationData.date_range) {
      // Date range booking
      if (!reservationData.start_date || !reservationData.end_date) {
        return new Response(
          JSON.stringify({ error: 'Missing start_date or end_date for date range booking' }),
          { status: 400 }
        );
      }

      // FIX: Use local date strings instead of UTC
      const start = new Date(reservationData.start_date + 'T00:00:00'); // Force local time
      const end = new Date(reservationData.end_date + 'T00:00:00'); // Force local time
      const current = new Date(start);

      while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      isDateRange = true;
    } else {
      // Single date booking
      if (!reservationData.event_date) {
        return new Response(
          JSON.stringify({ error: 'Missing event_date for single date booking' }),
          { status: 400 }
        );
      }
      // FIX: Use local date instead of UTC
      const eventDate = new Date(reservationData.event_date + 'T00:00:00');
      dates = [eventDate];
      isDateRange = false;
    }

    // Validate dates are in the future and check availability
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const date of dates) {
      date.setHours(0, 0, 0, 0);
      if (date < today) {
        return new Response(
          JSON.stringify({ error: 'Cannot book dates in the past' }),
          { status: 400 }
        );
      }

      // FIX: Use local date string for database
      const dateStr = formatDateForDB(date);

      // Check if date is already booked
      const existingEvents = await query(
        'SELECT id FROM events WHERE event_date = ? AND status = "confirmed"',
        [dateStr]
      );

      if (existingEvents.length > 0) {
        return new Response(
          JSON.stringify({
            error: `The date ${dateStr} is already booked. Please select another date.`
          }),
          { status: 400 }
        );
      }
    }

    // Insert reservations for all dates
    const reservationIds = [];

    for (const date of dates) {
      // FIX: Use local date string for database
      const dateStr = formatDateForDB(date);
      const title = isDateRange
        ? `${reservationData.service_type} session for ${reservationData.customer_name} (${reservationData.start_date} to ${reservationData.end_date})`
        : `${reservationData.service_type} session for ${reservationData.customer_name}`;

      const result = await query(
        `INSERT INTO events
         (title, event_date, customer_name, customer_email, service_type, hours, notes, status, is_date_range, start_date, end_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          dateStr,
          reservationData.customer_name,
          reservationData.customer_email,
          reservationData.service_type,
          reservationData.hours,
          reservationData.notes,
          reservationData.status || 'pending',
          isDateRange,
          isDateRange ? reservationData.start_date : null,
          isDateRange ? reservationData.end_date : null
        ]
      );

      reservationIds.push(result.insertId);
    }

    // Send email notification for the first reservation
    if (reservationIds.length > 0) {
      await sendReservationEmail({
        id: reservationIds[0],
        customer_name: reservationData.customer_name,
        customer_email: reservationData.customer_email,
        service_type: reservationData.service_type,
        event_date: isDateRange
          ? `${reservationData.start_date} to ${reservationData.end_date}`
          : reservationData.event_date,
        hours: reservationData.hours,
        notes: reservationData.notes,
        is_date_range: isDateRange
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Reservation created successfully. We will contact you to confirm.',
        reservation_ids: reservationIds,
        dates: dates.map(d => formatDateForDB(d)),
        is_date_range: isDateRange
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

// FIX: Helper function to format dates correctly for database (YYYY-MM-DD in local time)
function formatDateForDB(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
