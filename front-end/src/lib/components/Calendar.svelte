<script>
  import { format, isSameDay, addMonths } from 'date-fns';
  import '../../app.css'
  
  export let events = [];
  export let selectedDate;
  
  let currentMonth = new Date();
  let bookedDates = new Set();

  // Reactively update booked dates when events change
  // Enhanced debugging
  $: {
    bookedDates = new Set();
    if (events && events.length) {
      events.forEach(event => {
        if (event.event_date) {
          const dateStr = event.event_date.split('T')[0];
          bookedDates.add(dateStr);
        }
      });
      // Force calendar to redraw
      currentMonth = new Date(currentMonth); 
    }
  }

  function isBooked(date) {
    if (!date) return false;
    const dateStr = date.toISOString().split('T')[0];
    return bookedDates.has(dateStr);
  }

  function getDaysInMonth() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    const firstDayOfWeek = firstDay.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.unshift(null);
    }
    
    return days;
  }
  
  function selectDate(date) {
    if (date && !isBooked(date)) {
      selectedDate = date;
    }
  }
  
  function prevMonth() {
    currentMonth = addMonths(currentMonth, -1);
  }
  
  function nextMonth() {
    currentMonth = addMonths(currentMonth, 1);
  }
</script>

<div class="calendar">
  <div class="calendar-header">
    <button on:click={prevMonth} class="nav-button">
      &lt;
    </button>
    <h3>{format(currentMonth, 'MMMM yyyy')}</h3>
    <button on:click={nextMonth} class="nav-button">
      &gt;
    </button>
  </div>
  
  <div class="calendar-grid">
    {#each ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as day}
      <div class="day-header">{day}</div>
    {/each}
    
    {#each getDaysInMonth() as date}
      <div 
        class="day 
          {date ? 'has-date' : ''}
          {selectedDate && date && isSameDay(selectedDate, date) ? 'selected' : ''}
          {date && isBooked(date) ? 'booked' : 'available'}"
        on:click={() => selectDate(date)}
      >
        {date ? date.getDate() : ''}
        {#if date && isBooked(date)}
          <div class="booked-indicator"></div>
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
  }
  
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .calendar-header h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #2c3e50;
  }
  
  .nav-button {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 5px 15px;
    color: #4a6fa5;
  }
  
  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
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
  }
  
  .day.has-date {
    color: #2c3e50;
  }
  
  .day.available:hover {
    background-color: #e6f0ff;
  }
  
  .day.selected {
    background-color: #4a6fa5;
    color: white;
    font-weight: 600;
  }
  
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
    transform: rotate(-5deg);
  }
  
  .calendar-legend {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
    font-size: 0.9rem;
    color: #4a5568;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .legend-color {
    width: 15px;
    height: 15px;
    border-radius: 3px;
  }
  
  .legend-color.available {
    background-color: #e6f0ff;
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
    transform: rotate(-5deg);
  }

  .loading-message {
    text-align: center;
    padding: 40px;
    font-size: 1.2rem;
    color: #666;
  }
</style>