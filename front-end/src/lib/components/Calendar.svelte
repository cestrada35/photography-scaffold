<script>
  import { format, isSameDay, addMonths, getDaysInMonth as getDaysInMonthFn, startOfMonth, getDay, endOfMonth, isBefore, startOfDay } from 'date-fns';
  import { fade, fly } from 'svelte/transition';
  import '../../app.css'
  
  export let events = [];
  export let selectedDate;
  
  let currentMonth = new Date();
  let bookedDates = new Set();
  let transitionDirection = 'next'; // 'next' or 'prev'

  // Reactively update booked dates when events change
  $: {
    bookedDates = new Set();
    if (events && events.length) {
      events.forEach(event => {
        if (event.event_date) {
          const dateStr = event.event_date.split('T')[0];
          bookedDates.add(dateStr);
        }
      });
    }
  }

  // Make days array reactive so it updates when currentMonth changes
  $: daysInMonth = (() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Use date-fns for reliable month calculations
    const firstDay = startOfMonth(currentMonth);
    const lastDay = endOfMonth(currentMonth);
    const daysInMonthCount = getDaysInMonthFn(currentMonth);

    const days = [];

    // Add empty cells for days before the first day of month
    const firstDayOfWeek = getDay(firstDay); // 0 = Sunday, 1 = Monday, etc.
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonthCount; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  })();

  function isBooked(date) {
    if (!date) return false;
    const dateStr = date.toISOString().split('T')[0];
    const isBooked = bookedDates.has(dateStr);
    return isBooked;
  }

  function isPastDate(date) {
    if (!date) return false;
    const today = startOfDay(new Date());
    return isBefore(date, today);
  }

  function isSelectable(date) {
    return date && !isBooked(date) && !isPastDate(date);
  }

  function selectDate(date) {
    if (isSelectable(date)) {
      selectedDate = date;
    }
  }

  function prevMonth() {
    transitionDirection = 'prev';
    currentMonth = addMonths(new Date(currentMonth), -1);
  }

  function nextMonth() {
    transitionDirection = 'next';
    currentMonth = addMonths(new Date(currentMonth), 1);
  }

</script>

<div class="calendar">
  <div class="calendar-header">
    <button on:click={prevMonth} class="nav-button">
      &lt;
    </button>
    <h3 
      in:fly="{{ y: transitionDirection === 'next' ? -20 : 20, duration: 300 }}"
      out:fly="{{ y: transitionDirection === 'next' ? 20 : -20, duration: 300 }}"
    >
      {format(currentMonth, 'MMMM yyyy')}
    </h3>
    <button on:click={nextMonth} class="nav-button">
      &gt;
    </button>
  </div>

  <div class="calendar-grid">
    {#each ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as day}
      <div class="day-header">{day}</div>
    {/each}

    {#each daysInMonth as date, index}
      <div
        class="day
          {date ? 'has-date' : ''}
          {selectedDate && date && isSameDay(selectedDate, date) ? 'selected' : ''}
          {date && isBooked(date) ? 'booked' : ''}
          {date && isPastDate(date) ? 'past' : ''}
          {isSelectable(date) ? 'available' : ''}"
        on:click={() => selectDate(date)}
        in:fly="{{ 
          x: transitionDirection === 'next' ? 50 : -50, 
          duration: 400, 
          delay: (index % 7) * 30 
        }}"
        out:fly="{{ 
          x: transitionDirection === 'next' ? -50 : 50, 
          duration: 300 
        }}"
      >
        {date ? date.getDate() : ''}
        {#if date && isBooked(date)}
          <div class="booked-indicator"></div>
        {/if}
        {#if date && isPastDate(date)}
          <div class="past-overlay"></div>
        {/if}
      </div>
    {/each}
  </div>

  <div class="calendar-legend">
    <div class="legend-item">
      <div class="legend-color available"></div>
      <span>Available</span>
    </div>
    <div class="legend-item">
      <div class="legend-color past"></div>
      <span>Past Date</span>
    </div>
    <div class="legend-item">
      <div class="legend-color booked"></div>
      <span>Booked</span>
    </div>
  </div>
</div>

<style>
  .calendar {
    background: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    overflow: hidden; /* Prevent overflow during animations */
  }
  
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    position: relative;
    min-height: 40px; /* Prevent layout shift */
  }
  
  .calendar-header h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #2c3e50;
    position: relative;
  }
  
  .nav-button {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 5px 15px;
    color: #4a6fa5;
    transition: all 0.2s ease;
    border-radius: 6px;
    position: relative;
    z-index: 2; /* Ensure buttons stay clickable */
  }
  
  .nav-button:hover {
    background-color: #f0f4f8;
    transform: scale(1.1);
  }
  
  .nav-button:active {
    transform: scale(0.95);
  }
  
  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
    position: relative;
  }
  
  .day-header {
    text-align: center;
    font-weight: 600;
    color: #4a5568;
    font-size: 0.9rem;
    padding: 5px 0;
  }
  
  .day {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    transform-origin: center; /* Better for animations */
  }
  
  .day.has-date {
    color: #2c3e50;
  }
  
  /* Available dates - clickable and interactive */
  .day.available {
    cursor: pointer;
  }
  
  .day.available:hover {
    background-color: #e6f0ff;
    transform: scale(1.05);
  }
  
  .day.selected {
    background-color: #4a6fa5;
    color: white;
    font-weight: 600;
    transform: scale(1.05);
  }
  
  /* Booked dates - red slash indicator */
  .day.booked {
    background-color: #f8f8f8;
    color: #999;
    cursor: not-allowed;
  }
  
  .booked-indicator {
    position: absolute;
    top: 50%;
    left: 5px;
    right: 5px;
    height: 2px;
    background-color: #ff6b6b;
    transform: rotate(-32deg);
    transition: all 0.2s ease;
  }
  
  /* Past dates - grayed out and non-interactive */
  .day.past {
    background-color: #f9f9f9;
    color: #ccc;
    cursor: not-allowed;
  }
  
  .past-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.08) 100%);
    border-radius: 6px;
    pointer-events: none;
  }
  
  .calendar-legend {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
    font-size: 0.9rem;
    color: #4a5568;
    flex-wrap: wrap;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.2s ease;
  }
  
  .legend-color {
    width: 15px;
    height: 15px;
    border-radius: 3px;
    transition: all 0.2s ease;
  }
  
  .legend-color.available {
    background-color: #e6f0ff;
  }
  
  .legend-color.past {
    background-color: #f9f9f9;
    position: relative;
  }
  
  .legend-color.past::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.08) 100%);
    border-radius: 3px;
  }
  
  .legend-color.booked {
    background-color: #f8f8f8;
    position: relative;
  }
  
  .legend-color.booked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #ff6b6b;
    transform: rotate(-32deg);
  }

  .loading-message {
    text-align: center;
    padding: 40px;
    font-size: 1.2rem;
    color: #666;
  }

  /* Smooth transitions for the entire calendar */
  .calendar {
    transition: box-shadow 0.3s ease;
  }

  .calendar:hover {
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  }
</style>