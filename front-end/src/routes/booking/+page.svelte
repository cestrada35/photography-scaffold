<script>
  import Navbar from '$lib/components/Navbar.svelte';
  import Calendar from '$lib/components/Calendar.svelte';
  import { websiteName } from '$stores/appStore';
  import { onMount } from 'svelte';
  
  const location = "Los Angeles";
  const serviceRadius = 10; // miles
  const rates = {
    personal: 260,
    event: 300,
    commercial: 350
  };
  
  
  
  // Form state
  let events = [];
  $: console.log('Events updated:', events);
  let selectedDate = null;
  let selectedService = '';
  let name = '';
  let email = '';
  let address = '';
  let hours = 2;
  let notes = '';
  let eventsLoaded = false; // Add this flag
  
  // Mock available dates (in a real app, this would come from an API)
  const availableDates = [
    new Date(2023, 10, 15),
    new Date(2023, 10, 18),
    new Date(2023, 10, 22),
    new Date(2023, 10, 25),
    new Date(2023, 10, 29)
  ];


  
  function handleSubmit() {
    alert(`Booking request received!\n\nWe'll contact you shortly at ${email} to confirm your ${selectedService} session on ${selectedDate}.`);
    // In a real app, you would send this to your backend
  }
  
  function calculateTotal() {
    return rates[selectedService] * hours;
  }

  async function loadEvents() {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        events = await response.json();
        eventsLoaded = true; // Set flag when data is loaded
        console.log('Loaded events:', events);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  }
  
  onMount(() => {
    loadEvents();
    // Refresh every 5 seconds to catch any changes
    // const interval = setInterval(loadEvents, 5000);
    // return () => clearInterval(interval);
  });
  
  async function addTestEvent() {
  // Format date as YYYY-MM-DD
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  
  const testEvent = {
    title: "Test Event",
    event_date: formattedDate
  };
  
  try {
    const response = await fetch('/api/events/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testEvent)
    });
    
    if (response.ok) {
      alert("Test event added successfully!");
      await loadEvents(); // Refresh events
    }
  } catch (error) {
    alert("Error adding test event");
    console.log(error);
  }
}
</script>

<div class="booking-page">
  <Navbar siteTitle={$websiteName} />
  
  <main class="container">
    <h1 class="text-primary">Book Your Session</h1>
    
    <div class="booking-grid">
      <!-- Service Selection -->
      <section class="service-selection">
        <h2 class="text-primary">Select Your Service</h2>
        
        <div class="rate-cards">
          <div 
            class="rate-card {selectedService === 'personal' ? 'selected' : ''}"
            on:click={() => selectedService = 'personal'}
          >
            <h3>Personal Photography</h3>
            <p class="rate text-secondary">${rates.personal}/hour</p>
            <p>Portraits, family sessions, and personal projects</p>
            <br/>
            <p class="text-sm"><i>includes: 25 HD edited images and 3 printed photos (8.5x11)</i></p>
          </div>
          
          <div 
            class="rate-card {selectedService === 'event' ? 'selected' : ''}"
            on:click={() => selectedService = 'event'}
          >
            <h3>Event Coverage</h3>
            <p class="rate text-secondary">${rates.event}/hour</p>
            <p>Weddings, parties, and special occasions</p>
            <br/>
            <p class="text-sm"><i>includes: 25 HD edited images and 3 printed photos (8.5x11)</i></p>
          </div>
          
          <div 
            class="rate-card {selectedService === 'commercial' ? 'selected' : ''}"
            on:click={() => selectedService = 'commercial'}
          >
            <h3>Commercial Work</h3>
            <p class="rate text-secondary">${rates.commercial}/hour</p>
            <p>Product shots, branding, and advertising</p>
            <br/>
            <p class="text-sm"><i>includes: 25 HD edited images and 3 printed photos (8.5x11)</i></p>
          </div>
        </div>
      </section>
      
      <!-- Calendar Section -->
      <section class="calendar-section">
        <h2 class="text-primary">Select Date</h2>
        <!-- <Calendar 
        {events}
        bind:selectedDate 
        /> -->
        {#if eventsLoaded}
          <Calendar {events} bind:selectedDate />
        {:else}
          <div>Loading calendar...</div>
        {/if}
        <!-- availableDates={availableDates}  -->
      </section>

      <!-- DEV STUFF, DONT SHOW ON PROD -->
      <button on:click={addTestEvent} class="test-button">
        Add Test Event
      </button>
      
      <!-- Booking Form -->
      <section class="booking-form">
        <h2 class="text-primary">Your Information</h2>
        
        <form on:submit|preventDefault={handleSubmit}>
          <div class="form-group">
            <label for="name" class="text-secondary">Full Name</label>
            <input 
              id="name" 
              type="text" 
              bind:value={name} 
              required
            />
          </div>
          
          <div class="form-group">
            <label for="email" class="text-secondary">Email</label>
            <input 
              id="email" 
              type="email" 
              bind:value={email} 
              required
            />
          </div>
          
          <div class="form-group">
            <label for="address" class="text-secondary">
              Address (within {serviceRadius} miles of {location})
            </label>
            <input 
              id="address" 
              type="text" 
              bind:value={address} 
              required
            />
          </div>
          
          <div class="form-group">
            <label for="hours" class="text-secondary">Hours Needed</label>
            <select id="hours" bind:value={hours}>
              {#each [1, 2, 3, 4, 5, 6, 7, 8] as h}
                <option value={h}>{h} {h === 1 ? 'hour' : 'hours'}</option>
              {/each}
            </select>
          </div>
          
          <div class="form-group">
            <label for="notes" class="text-secondary">Special Requests</label>
            <textarea 
              id="notes" 
              bind:value={notes} 
              rows="3"
            ></textarea>
          </div>
          
          {#if selectedService && selectedDate}
            <div class="booking-summary">
              <h3>Booking Summary</h3>
              <p>
                {selectedService} session for {hours} {hours === 1 ? 'hour' : 'hours'}
              </p>
              <p>Date: {selectedDate.toLocaleDateString()}</p>
              <p class="total">Total: ${calculateTotal()}</p>
            </div>
          {/if}

          <!-- Payment Methods -->
        <div class="payment-methods">
          <h3 class="text-primary">Payment Options</h3>
          <div class="payment-buttons">
            <button type="button" class="payment-btn stripe">
              <!-- <svg viewBox="0 0 28 20" class="payment-icon">
                <path d="M25.6 0H2.4C1.1 0 0 1.1 0 2.4v15.2C0 18.9 1.1 20 2.4 20h23.2c1.3 0 2.4-1.1 2.4-2.4V2.4C28 1.1 26.9 0 25.6 0z" fill="#6772e5"/>
                <path d="M19.4 8.5c0-1.4-1.1-2.5-2.9-2.5h-4.8v9.9h2.8v-3.2h1.4l2.1 3.2h3.2l-2.4-3.4c1.2-.4 2-1.4 2-2.6zm-4.8 1.5h-1.5V7.2h1.5c.6 0 1 .4 1 1.4 0 .9-.4 1.4-1 1.4z" fill="#fff"/>
              </svg> -->
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30" class="payment-icon">
                    <path fill="#8bb7f0" d="M2.5 2.5H27.5V27.5H2.5z"></path><path fill="#4e7ab5" d="M27,3v24H3V3H27 M28,2H2v26h26V2L28,2z"></path><g><path fill="#fff" d="M14.852,21.5c-1.855,0-3.517-0.571-4.376-1.061l-0.301-0.171l0.617-3.843l0.631,0.371 c0.924,0.544,2.375,0.986,3.236,0.986c0.203,0,0.673-0.026,0.673-0.272c0-0.151-0.158-0.382-1.391-0.821 c-2.144-0.778-3.57-1.769-3.57-4.08c0-1.268,0.468-2.325,1.354-3.059c0.839-0.688,1.996-1.05,3.349-1.05 c1.758,0,3.082,0.455,3.883,0.835l0.339,0.161l-0.614,3.784l-0.605-0.297c-0.583-0.286-1.725-0.766-2.824-0.766 c-0.075,0-0.451,0.007-0.451,0.153c0,0.087,0.176,0.299,1.352,0.734c2.173,0.777,3.624,1.776,3.624,4.122 c0,1.405-0.489,2.502-1.454,3.26C17.497,21.149,16.295,21.5,14.852,21.5z"></path><path fill="#4e7ab5" d="M15.074,9c1.767,0,3.045,0.49,3.668,0.787l-0.446,2.748c-0.787-0.386-1.931-0.817-3.045-0.817 c-0.609,0-0.95,0.238-0.95,0.653c0,0.49,0.594,0.802,1.678,1.203c2.035,0.728,3.297,1.589,3.297,3.653 c0,1.248-0.431,2.213-1.262,2.866C17.272,20.688,16.173,21,14.851,21c-1.663,0-3.267-0.505-4.129-0.995l0.446-2.777 c1.01,0.594,2.554,1.054,3.49,1.054c0.757,0,1.173-0.282,1.173-0.772c0-0.505-0.431-0.832-1.723-1.292 c-2.005-0.728-3.238-1.589-3.238-3.609c0-1.114,0.401-2.035,1.173-2.673C12.787,9.327,13.827,9,15.074,9 M15.074,8 c-1.469,0-2.736,0.402-3.664,1.162c-1.008,0.834-1.539,2.024-1.539,3.447c0,2.755,1.873,3.814,3.896,4.549 c0.011,0.004,0.022,0.008,0.033,0.012c-0.68-0.149-1.5-0.436-2.125-0.804l-1.262-0.743l-0.232,1.446l-0.446,2.777l-0.11,0.685 l0.603,0.343C11.141,21.393,12.9,22,14.851,22c1.558,0,2.868-0.389,3.788-1.125c1.069-0.84,1.638-2.103,1.638-3.647 c0-1.606-0.629-2.641-1.555-3.371l0.346,0.17l0.216-1.332l0.446-2.748l0.12-0.74l-0.677-0.323C18.325,8.481,16.927,8,15.074,8 L15.074,8z"></path></g>
                </svg>
              Pay with Stripe
            </button>
            
            <button type="button" class="payment-btn paypal">
              <!-- <svg viewBox="0 0 28 20" class="payment-icon">
                <path d="M25.6 0H2.4C1.1 0 0 1.1 0 2.4v15.2C0 18.9 1.1 20 2.4 20h23.2c1.3 0 2.4-1.1 2.4-2.4V2.4C28 1.1 26.9 0 25.6 0z" fill="#253b80"/>
                <path d="M21.4 7.5c-.6-.3-1.5-.5-2.7-.5-2.8 0-4.8 1.4-4.8 3.4 0 1.5 1.3 2.3 3.2 2.3 1.1 0 2-.2 2.6-.4v1.6c-.7.3-1.6.4-2.6.4-1.2 0-2.1-.2-2.7-.5v3.6H9.8V6.6h5.6v1.5c.8-.6 1.9-1 3.3-1 1.3 0 2.3.2 3 .5l-.3 1.9z" fill="#179bd7"/>
              </svg> -->
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48" class="payment-icon">
                    <path fill="#1565C0" d="M18.7,13.767l0.005,0.002C18.809,13.326,19.187,13,19.66,13h13.472c0.017,0,0.034-0.007,0.051-0.006C32.896,8.215,28.887,6,25.35,6H11.878c-0.474,0-0.852,0.335-0.955,0.777l-0.005-0.002L5.029,33.813l0.013,0.001c-0.014,0.064-0.039,0.125-0.039,0.194c0,0.553,0.447,0.991,1,0.991h8.071L18.7,13.767z"></path><path fill="#039BE5" d="M33.183,12.994c0.053,0.876-0.005,1.829-0.229,2.882c-1.281,5.995-5.912,9.115-11.635,9.115c0,0-3.47,0-4.313,0c-0.521,0-0.767,0.306-0.88,0.54l-1.74,8.049l-0.305,1.429h-0.006l-1.263,5.796l0.013,0.001c-0.014,0.064-0.039,0.125-0.039,0.194c0,0.553,0.447,1,1,1h7.333l0.013-0.01c0.472-0.007,0.847-0.344,0.945-0.788l0.018-0.015l1.812-8.416c0,0,0.126-0.803,0.97-0.803s4.178,0,4.178,0c5.723,0,10.401-3.106,11.683-9.102C42.18,16.106,37.358,13.019,33.183,12.994z"></path><path fill="#283593" d="M19.66,13c-0.474,0-0.852,0.326-0.955,0.769L18.7,13.767l-2.575,11.765c0.113-0.234,0.359-0.54,0.88-0.54c0.844,0,4.235,0,4.235,0c5.723,0,10.432-3.12,11.713-9.115c0.225-1.053,0.282-2.006,0.229-2.882C33.166,12.993,33.148,13,33.132,13H19.66z"></path>
                </svg>
              Pay with PayPal
            </button>
            
            <button type="button" class="payment-btn zelle">
              <!-- <svg viewBox="0 0 28 20" class="payment-icon">
                <path d="M25.6 0H2.4C1.1 0 0 1.1 0 2.4v15.2C0 18.9 1.1 20 2.4 20h23.2c1.3 0 2.4-1.1 2.4-2.4V2.4C28 1.1 26.9 0 25.6 0z" fill="#6d1ed4"/>
                <path d="M14 7.5c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5z" fill="#fff"/>
              </svg> -->
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48" class="payment-icon">
                    <path fill="#a0f" d="M35,42H13c-3.866,0-7-3.134-7-7V13c0-3.866,3.134-7,7-7h22c3.866,0,7,3.134,7,7v22 C42,38.866,38.866,42,35,42z"></path><path fill="#fff" d="M17.5,18.5h14c0.552,0,1-0.448,1-1V15c0-0.552-0.448-1-1-1h-14c-0.552,0-1,0.448-1,1v2.5	C16.5,18.052,16.948,18.5,17.5,18.5z"></path><path fill="#fff" d="M17,34.5h14.5c0.552,0,1-0.448,1-1V31c0-0.552-0.448-1-1-1H17c-0.552,0-1,0.448-1,1v2.5	C16,34.052,16.448,34.5,17,34.5z"></path><path fill="#fff" d="M22.25,11v6c0,0.276,0.224,0.5,0.5,0.5h3.5c0.276,0,0.5-0.224,0.5-0.5v-6c0-0.276-0.224-0.5-0.5-0.5	h-3.5C22.474,10.5,22.25,10.724,22.25,11z"></path><path fill="#fff" d="M22.25,32v6c0,0.276,0.224,0.5,0.5,0.5h3.5c0.276,0,0.5-0.224,0.5-0.5v-6c0-0.276-0.224-0.5-0.5-0.5	h-3.5C22.474,31.5,22.25,31.724,22.25,32z"></path><path fill="#fff" d="M16.578,30.938H22l10.294-12.839c0.178-0.222,0.019-0.552-0.266-0.552H26.5L16.275,30.298	C16.065,30.553,16.247,30.938,16.578,30.938z"></path>
                </svg>
              Pay with Zelle
            </button>
          </div>
        </div>
          
          <button 
            type="submit" 
            class="submit-btn"
            disabled={!selectedService || !selectedDate}
          >
            Reserve Now
          </button>
        </form>
      </section>
    </div>
  </main>
</div>

<style>
  .booking-page {
    padding-top: 80px;
    /* background-color: #f9f9f9; */
    min-height: 100vh;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
  }
  
  h1 {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    /* color: #2c3e50; */
    margin-bottom: 40px;
    text-align: center;
  }
  
  h2 {
    font-size: 1.5rem;
    /* color: #2c3e50; */
    margin-bottom: 20px;
    font-weight: 600;
  }
  
  .booking-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  @media (min-width: 1024px) {
    .booking-grid {
      grid-template-columns: 1fr 1fr;
    }
    
    .booking-form {
      grid-column: span 2;
    }
  }
  
  /* Rate Cards */
  .rate-cards {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
  
  .rate-card {
    background: white;
    border-radius: 10px;
    padding: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid #eee;
  }
  
  .rate-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
  
  .rate-card.selected {
    border-color: #4a6fa5;
    background-color: #f8fafd;
  }
  
  .rate-card h3 {
    font-size: 1.2rem;
    margin-bottom: 10px;
    color: #2c3e50;
  }
  
  .rate {
    font-size: 1.5rem;
    font-weight: 700;
    /* color: #4a6fa5; */
    margin-bottom: 15px;
  }
  
  /* Form Styles */
  .form-group {
    margin-bottom: 25px;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    /* color: #4a5568; */
  }
  
  input, select, textarea {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.3s;
  }
  
  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: #4a6fa5;
  }
  
  textarea {
    resize: vertical;
  }
  
  /* Booking Summary */
  .booking-summary {
    background: white;
    padding: 20px;
    border-radius: 8px;
    margin: 30px 0;
    border: 1px solid #eee;
  }
  
  .booking-summary h3 {
    margin-bottom: 15px;
    font-size: 1.3rem;
  }
  
  .total {
    font-size: 1.3rem;
    font-weight: 700;
    color: #2c3e50;
    margin-top: 10px;
  }
  
  /* Submit Button */
  .submit-btn {
    width: 100%;
    padding: 16px;
    background-color: #4a6fa5;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .submit-btn:hover {
    background-color: #3a5a8f;
    transform: translateY(-2px);
  }
  
  .submit-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
  }
  /* Payment Methods */
  .payment-methods {
    margin: 30px 0;
  }
  
  .payment-methods h3 {
    font-size: 1.1rem;
    margin-bottom: 15px;
    /* color: #4a5568; */
  }
  
  .payment-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
  }
  
  .payment-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    /* gap: 0px; */
    padding: 12px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid #ddd;
    background: white;
  }
  
  .payment-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  
  .payment-icon {
    width: 24px;
    height: 16px;
  }
  
  .payment-btn.stripe {
    color: #6772e5;
    border-color: #6772e5;
  }
  
  .payment-btn.paypal {
    color: #253b80;
    border-color: #253b80;
  }
  
  .payment-btn.zelle {
    color: #6d1ed4;
    border-color: #6d1ed4;
  }

  .test-button {
    padding: 10px 20px;
    background: #4a6fa5;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 20px;
  }
  
  .test-button:hover {
    background: #3a5a80;
  }
</style>