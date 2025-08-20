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
  

  // todo: 
  // make alert a modal
  // send email on availability
  // if yes, we must leave event on cal (we could show reservation number on click?)
  // else, we remove the entry from the db
  
  
  // Form state
  let events = [];
  let selectedDate = null;
  let selectedService = '';
  let name = '';
  let email = '';
  let address = '';
  let hours = 2;
  let notes = '';
  let eventsLoaded = false; // Add this flag
    let isSubmitting = false;
  let submitStatus = ''; // 'success', 'error', or ''
  
  // Mock available dates (in a real app, this would come from an API)
  const availableDates = [
    new Date(2023, 10, 15),
    new Date(2023, 10, 18),
    new Date(2023, 10, 22),
    new Date(2023, 10, 25),
    new Date(2023, 10, 29)
  ];

    async function handleSubmit() {
    if (!selectedService || !selectedDate || !name || !email) {
      alert('Please fill in all required fields');
      return;
    }
    
    isSubmitting = true;
    submitStatus = '';
    
    try {
      // Format date as YYYY-MM-DD
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      const reservationData = {
        title: `${selectedService} session for ${name}`,
        event_date: formattedDate,
        customer_name: name,
        customer_email: email,
        service_type: selectedService,
        hours: hours,
        notes: notes,
        status: 'pending' // or 'confirmed' based on your workflow
      };
      
      const response = await fetch('/api/reservations/add', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservationData)
      });
      
      if (response.ok) {
        submitStatus = 'success';
        await loadEvents();
        
        // Show success message
        confirmation_modal.showModal()
        
        name = '';
        email = '';
        hours = 2;
        notes = '';
        selectedService = '';
        selectedDate = null;
      } else {
        const errorData = await response.json();
        submitStatus = 'error';
        alert(`Error: ${errorData.message || 'Failed to create reservation'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      submitStatus = 'error';
      alert('Error submitting reservation. Please try again.');
    }
    
    isSubmitting = false;
  }
  
  function calculateTotal() {
    return rates[selectedService] * hours;
  }

  async function loadEvents() {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        events = await response.json();
        eventsLoaded = true;
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  }
  
  onMount(() => {
    loadEvents();
  });

</script>

<div class="booking-page">
  <Navbar siteTitle={$websiteName} />
  
  <main class="container">
    <h1 class="text-primary">Book Your Session</h1>

    <!-- Status Messages -->
    {#if submitStatus === 'success'}
      <div class="alert success">
        <i class="fas fa-check-circle"></i>
        Your reservation request has been submitted successfully!
      </div>
    {:else if submitStatus === 'error'}
      <div class="alert error">
        <i class="fas fa-exclamation-circle"></i>
        There was an error submitting your reservation. Please try again.
      </div>
    {/if}
    
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
            <p class="text-sm"><i>includes: 30 HD edited images and 5 printed photos (8.5x11)</i></p>
          </div>
          
          <div 
            class="rate-card {selectedService === 'commercial' ? 'selected' : ''}"
            on:click={() => selectedService = 'commercial'}
          >
            <h3>Commercial Work</h3>
            <p class="rate text-secondary">${rates.commercial}/hour</p>
            <p>Product shots, branding, and advertising</p>
            <br/>
            <p class="text-sm"><i>includes: 30 HD edited images and 5 printed photos (8.5x11)</i></p>
          </div>
        </div>
      </section>
      
      <!-- Calendar Section -->
      <section class="calendar-section">
        <h2 class="text-primary">Select Date</h2>
        {#if eventsLoaded}
          <Calendar {events} bind:selectedDate />
        {:else}
          <div>Loading calendar...</div>
        {/if}
      </section>

      <dialog id="confirmation_modal" class="modal">
        <div class="modal-box">
          <h1 class="text-lg font-bold">Thank you!</h1>
          <h2 class="font-bold">
            {#if submitStatus}
              Booking request received! We'll contact you shortly at {email} to confirm your <i>{selectedService.charAt(0).toUpperCase() + selectedService.slice(1)}</i> service session on {selectedDate.toLocaleDateString()}.
            {/if}
            <!-- test -->
          </h2>
          <!-- <p class="pt-4">Press ESC key or click the button below to close</p> -->
          <div class="modal-action">
            <form method="dialog">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      <!-- Booking Form -->
      <section class="booking-form">
        <h2 class="text-primary">Your Information</h2>
        
        <form on:submit|preventDefault={handleSubmit}>
          <div class="form-group">
            <label for="name" class="text-secondary">Full Name *</label>
            <input 
              id="name" 
              type="text" 
              bind:value={name} 
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div class="form-group">
            <label for="email" class="text-secondary">Email *</label>
            <input 
              id="email" 
              type="email" 
              bind:value={email} 
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div class="form-group">
            <label for="hours" class="text-secondary">Hours Needed</label>
            <select id="hours" bind:value={hours} disabled={isSubmitting}>
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
              disabled={isSubmitting}
            ></textarea>
          </div>
          
          {#if selectedService && selectedDate}
            <div class="booking-summary">
              <h3>Booking Summary</h3>
              <p>
                <u>
                  {selectedService.charAt(0).toUpperCase() + selectedService.slice(1)}
                </u> session for {hours} {hours === 1 ? 'hour' : 'hours'}
              </p>
              <p>Date: {selectedDate.toLocaleDateString()}</p>
              <p class="total">Total: ${calculateTotal()}</p>
            </div>
          {/if}

          <button 
            type="submit" 
            class="submit-btn"
            disabled={!selectedService || !selectedDate || !name || !email || isSubmitting}
          >
            {#if isSubmitting}
              <i class="fas fa-spinner fa-spin"></i> Processing...
            {:else}
              Request Reservation
            {/if}
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
    /* font-family: 'Playfair Display', serif; */
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