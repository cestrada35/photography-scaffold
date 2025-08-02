<script>
  import { format, isSameDay, addMonths } from 'date-fns';
  
  export let availableDates = [];
  export let selectedDate;
  
  let currentMonth = new Date();
  
  function getDaysInMonth() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    // Add padding for first day
    const firstDayOfWeek = firstDay.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.unshift(null);
    }
    
    return days;
  }
  
  function isAvailable(date) {
    return availableDates.some(d => d && date && isSameDay(d, date));
  }
  
  function selectDate(date) {
    if (isAvailable(date)) {
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
          {isAvailable(date) ? 'available' : 'unavailable'}"
        on:click={() => selectDate(date)}
      >
        {date ? date.getDate() : ''}
      </div>
    {/each}
  </div>
  
  <div class="calendar-legend">
    <div class="legend-item">
      <div class="legend-color available"></div>
      <span>Available</span>
    </div>
    <div class="legend-item">
      <div class="legend-color unavailable"></div>
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
  
  .day.unavailable {
    color: #ccc;
    cursor: not-allowed;
    text-decoration: line-through;
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
  
  .legend-color.unavailable {
    background-color: #f0f0f0;
  }
</style>