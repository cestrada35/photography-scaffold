import { json } from '@sveltejs/kit';
import { saveReservation } from '$lib/server/database.js';

export async function POST({ request }) {
  try {
    const reservationData = await request.json();

    // Validate required fields
    if (!reservationData.customer_name || !reservationData.customer_email || !reservationData.service_type) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Handle both single date and date range
    let dates = [];
    if (reservationData.date_range) {
      // Date range booking
      if (!reservationData.start_date || !reservationData.end_date) {
        return json({ error: 'Missing start_date or end_date for date range booking' }, { status: 400 });
      }

      // Generate all dates in the range
      const start = new Date(reservationData.start_date);
      const end = new Date(reservationData.end_date);
      const current = new Date(start);

      while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }

      reservationData.dates = dates;
      reservationData.is_date_range = true;
    } else {
      // Single date booking
      if (!reservationData.event_date) {
        return json({ error: 'Missing event_date for single date booking' }, { status: 400 });
      }
      dates = [new Date(reservationData.event_date)];
      reservationData.dates = dates;
      reservationData.is_date_range = false;
    }

    // Validate dates are in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const date of dates) {
      date.setHours(0, 0, 0, 0);
      if (date < today) {
        return json({ error: 'Cannot book dates in the past' }, { status: 400 });
      }
    }

    // Save reservation
    const result = await saveReservation(reservationData);

    return json({
      success: true,
      reservation_id: result.id,
      dates: dates.map(d => d.toISOString().split('T')[0]),
      is_date_range: reservationData.is_date_range
    });

  } catch (error) {
    console.error('Error creating reservation:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}
