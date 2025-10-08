<script>
  import { t } from '$stores/translationStore.js';

  export let city = "City Name Default";
  export let website_name = "Website Name Default";
  
  // Date range state
  let startDate = null;
  let endDate = null;
  let isDateRangeMode = false;
  
  function handleBooking() {
    if (isDateRangeMode) {
      // Handle date range booking
      if (!startDate || !endDate) {
        alert($t('bookNow.selectDateRange'));
        return;
      }
      // Redirect to booking page for date range
      window.location.href = '/booking/?mode=range';
    } else {
      // Regular single date booking
      window.location.href = '/booking/';
    }
  }

  function toggleDateRangeMode() {
    isDateRangeMode = !isDateRangeMode;
    // Reset dates when switching modes
    startDate = null;
    endDate = null;
  }

  function formatDate(date) {
    if (!date) return '';
    return date.toLocaleDateString();
  }
</script>

<div class="book-now-section">
  <div class="content">
    <h1 class="text-primary">{website_name}</h1>
    <p class="text-primary">{$t('bookNow.specializingIn', { city: city })}</p>
    
    <button class="book-now-button text-primary" on:click={handleBooking}>
      <a style="display: inline-block;" class="py-2 px-4">
        {isDateRangeMode ? $t('bookNow.bookRange') : $t('bookNow.bookNowButton')}
      </a>
    </button>
  </div>
</div>


<style>
  .book-now-section {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 100px 20px;
    position: relative;
    /* background: linear-gradient(to bottom, #f9f9f9 0%, #ffffff 100%); */
  }
  
  .content {
    text-align: center;
    max-width: 800px;
    z-index: 1;
    padding: 0 20px;
  }
  
  h1 {
    font-size: 3.2rem;
    margin-bottom: 20px;
    letter-spacing: 2px;
    font-weight: 400;
    /* color: #222; */
    line-height: 1.2;
  }
  
  p {
    font-size: 1.3rem;
    margin: 0 auto 45px;
    /* color: #555; */
    max-width: 600px;
    line-height: 1.7;
    font-style: italic;
  }
  
  .book-now-button {
    background-color: transparent;
    border: 2px solid;
    border-radius: 5px;
    /* padding: 16px 55px; */
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.4s ease;
    letter-spacing: 2px;
    text-transform: uppercase;
    position: relative;
    overflow: hidden;
    z-index: 1;
    font-weight: 500;
    /* position: relative; */
    /* padding: 0; */
    /* overflow: hidden; */
    /* padding: 14px 40px; */
    font-size: 1rem;
  }
  
  .book-now-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 0;
    background-color: #f0f0f0;
    z-index: -1;
    transition: height 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
  }
  
  .book-now-button:hover {
    color: rgb(0, 0, 0);
    border-color: #222222b3;
  }
  
  .book-now-button:hover::before {
    height: 100%;
  }
  
  @media (max-width: 768px) {
    .book-now-section {
      padding: 70px 20px;
    }
    
    h1 {
      font-size: 2.4rem;
    }
    
    p {
      font-size: 1.1rem;
      margin-bottom: 35px;
    }
    
    /* .book-now-button a {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      border: 1px solid green;
    } */
  }
</style>