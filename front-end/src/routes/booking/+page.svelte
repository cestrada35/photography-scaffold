<script>
  import Navbar from '$lib/components/Navbar.svelte';
  import Calendar from '$lib/components/Calendar.svelte';
  import { websiteName } from '$stores/appStore';
  import { onMount } from 'svelte';
  import { t } from '$stores/translationStore.js';
  import { page } from '$app/stores';


  
  const location = "Los Angeles";
  const serviceRadius = 10;
  const rates = {
    personal: 260,
    event: 300,
    commercial: 350
  };
  
  
  // Form state
  let events = [];
  let selectedDate = null;
  let selectedStartDate = null;
  let selectedEndDate = null;
  let selectedService = '';
  let name = '';
  let email = '';
  let hours = 2;
  let notes = '';
  let eventsLoaded = false;
  let isSubmitting = false;
  let submitStatus = '';
  let isDateRangeMode = false;

  // Check if user came from date range mode
  $: {
    const urlParams = new URLSearchParams($page.url.search);
    isDateRangeMode = urlParams.get('mode') === 'range';
  }

  async function handleSubmit() {
    if (!selectedService || !name || !email) {
      alert($t('booking.requiredFieldsAlert'));
      return;
    }

    if (isDateRangeMode && (!selectedStartDate || !selectedEndDate)) {
      alert($t('booking.selectDateRange'));
      return;
    }

    if (!isDateRangeMode && !selectedDate) {
      alert($t('booking.selectDate'));
      return;
    }

    isSubmitting = true;
    submitStatus = '';

    try {
      const reservationData = {
      title: `${selectedService} session for ${name}`,
      customer_name: name,
      customer_email: email,
      service_type: selectedService,
      hours: hours,
      notes: notes,
      status: 'pending'
    };

      // Add date information based on mode
      if (isDateRangeMode) {
        reservationData.date_range = true;
        reservationData.start_date = selectedStartDate.toISOString().split('T')[0];
        reservationData.end_date = selectedEndDate.toISOString().split('T')[0];
      } else {
        reservationData.date_range = false;
        reservationData.event_date = selectedDate.toISOString().split('T')[0];
      }

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
        confirmation_modal.showModal();

        // Reset form
        name = '';
        email = '';
        hours = 2;
        notes = '';
        selectedService = '';
        selectedDate = null;
        selectedStartDate = null;
        selectedEndDate = null;
      } else {
        const errorData = await response.json();
        submitStatus = 'error';
        alert($t('booking.submissionError', { error: errorData.error || $t('booking.defaultError') }));
      }
    } catch (error) {
      console.error('Submission error:', error);
      submitStatus = 'error';
      alert($t('booking.generalError'));
    }

    isSubmitting = false;
  }

  function calculateTotal() {
    const baseRate = rates[selectedService] * hours;
    if (isDateRangeMode && selectedStartDate && selectedEndDate) {
      const days = Math.ceil((selectedEndDate - selectedStartDate) / (1000 * 60 * 60 * 24)) + 1;
      return baseRate * days;
    }
    return baseRate;
  }

  function getDateRangeDescription() {
    if (!isDateRangeMode || !selectedStartDate || !selectedEndDate) return '';

    const days = Math.ceil((selectedEndDate - selectedStartDate) / (1000 * 60 * 60 * 24)) + 1;
    return `${selectedStartDate.toLocaleDateString()} - ${selectedEndDate.toLocaleDateString()} (${days} ${days === 1 ? $t('booking.day') : $t('booking.days')})`;
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
    <h1 class="text-primary">{$t('booking.bookYourSession')}</h1>

    <!-- Status Messages -->
    {#if submitStatus === 'success'}
      <div class="alert success">
        <i class="fas fa-check-circle"></i>
        {$t('booking.successMessage')}
      </div>
    {:else if submitStatus === 'error'}
      <div class="alert error">
        <i class="fas fa-exclamation-circle"></i>
        {$t('booking.errorMessage')}
      </div>
    {/if}

    <div class="booking-grid">
      <!-- Service Selection -->
      <section class="service-selection">
        <h2 class="text-primary">{$t('booking.selectService')}</h2>

        <div class="rate-cards">
          <div
            class="rate-card {selectedService === 'personal' ? 'selected' : ''}"
            on:click={() => selectedService = 'personal'}
          >
            <h3>{$t('booking.personalPhotography')}</h3>
            <p class="rate text-primary">${rates.personal}/{$t('booking.hour')}</p>
            <p>{$t('booking.personalDescription')}</p>
            <br/>
            <p class="text-sm"><i>{$t('booking.personalIncludes')}</i></p>
          </div>

          <div
            class="rate-card {selectedService === 'event' ? 'selected' : ''}"
            on:click={() => selectedService = 'event'}
          >
            <h3>{$t('booking.eventCoverage')}</h3>
            <p class="rate text-primary">${rates.event}/{$t('booking.hour')}</p>
            <p>{$t('booking.eventDescription')}</p>
            <br/>
            <p class="text-sm"><i>{$t('booking.eventIncludes')}</i></p>
          </div>

          <div
            class="rate-card {selectedService === 'commercial' ? 'selected' : ''}"
            on:click={() => selectedService = 'commercial'}
          >
            <h3>{$t('booking.commercialWork')}</h3>
            <p class="rate text-primary">${rates.commercial}/{$t('booking.hour')}</p>
            <p>{$t('booking.commercialDescription')}</p>
            <br/>
            <p class="text-sm"><i>{$t('booking.commercialIncludes')}</i></p>
          </div>
        </div>
      </section>

      <!-- Calendar Section -->
      <section class="calendar-section">
        <h2 class="text-primary">
          {isDateRangeMode ? 'Enter Date Range' : $t('booking.selectDate')}
        </h2>

        {#if isDateRangeMode}
          <div class="date-range-inputs">
            <div class="date-input-group">
              <label for="start-date">Start Date *</label>
              <input
                type="date"
                id="start-date"
                value={selectedStartDate ? selectedStartDate.toISOString().split('T')[0] : ''}
                on:input={(e) => selectedStartDate = e.target.value ? new Date(e.target.value) : null}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div class="date-input-group">
              <label for="end-date">End Date *</label>
              <input
                type="date"
                id="end-date"
                value={selectedEndDate ? selectedEndDate.toISOString().split('T')[0] : ''}
                on:input={(e) => selectedEndDate = e.target.value ? new Date(e.target.value) : null}
                min={selectedStartDate ? selectedStartDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {#if selectedStartDate && selectedEndDate}
            <div class="date-range-preview">
              <p><strong>Selected dates:</strong> {getDateRangeDescription()}</p>
            </div>
          {/if}
        {:else}
          {#if eventsLoaded}
            <Calendar {events} bind:selectedDate />
          {:else}
            <div>{$t('booking.loadingCalendar')}</div>
          {/if}
        {/if}
      </section>

      <dialog id="confirmation_modal" class="modal">
        <div class="modal-box">
          <h1 class="text-lg font-bold">{$t('booking.thankYou')}</h1>
          <h2 class="font-bold">
            {#if submitStatus}
              {$t('booking.confirmationMessage', {
                email: email,
                service: selectedService.charAt(0).toUpperCase() + selectedService.slice(1),
                date: isDateRangeMode ? getDateRangeDescription() : selectedDate.toLocaleDateString()
              })}
            {/if}
          </h2>
          <div class="modal-action">
            <form method="dialog">
              <button class="btn">{$t('booking.close')}</button>
            </form>
          </div>
        </div>
      </dialog>

      <!-- Booking Form -->
      <section class="booking-form">
        <h2 class="text-primary">{$t('booking.yourInformation')}</h2>

        <form on:submit|preventDefault={handleSubmit}>
          <div class="form-group">
            <label for="name" class="text-primary">{$t('booking.fullName')} *</label>
            <input
              id="name"
              type="text"
              bind:value={name}
              required
              disabled={isSubmitting}
              class="text-secondary"
            />
          </div>

          <div class="form-group">
            <label for="email" class="text-primary">{$t('contact.email')} *</label>
            <input
              id="email"
              type="email"
              bind:value={email}
              required
              disabled={isSubmitting}
              class="text-secondary"
            />
          </div>

          <div class="form-group">
            <label for="hours" class="text-primary">{$t('booking.hoursNeeded')}</label>
            <select id="hours" bind:value={hours} disabled={isSubmitting} class="text-secondary">
              {#each [1, 2, 3, 4, 5, 6, 7, 8] as h}
                <option value={h}>{h} {h === 1 ? $t('booking.hour') : $t('booking.hours')}</option>
              {/each}
            </select>
          </div>

          <div class="form-group">
            <label for="notes" class="text-primary">{$t('booking.specialRequests')}</label>
            <textarea
              id="notes"
              bind:value={notes}
              rows="3"
              disabled={isSubmitting}
              class="text-secondary"
            ></textarea>
          </div>

          {#if selectedService && (selectedDate || (isDateRangeMode && selectedStartDate && selectedEndDate))}
  <div class="booking-summary">
    <h3>{$t('booking.bookingSummary')}</h3>
    <p>
      <u>{selectedService.charAt(0).toUpperCase() + selectedService.slice(1)}</u>
      {isDateRangeMode ? $t('booking.rangeSessionFor') : $t('booking.sessionFor')}
      {hours} {hours === 1 ? $t('booking.hour') : $t('booking.hours')}
    </p>
    <p>
      {isDateRangeMode ? $t('booking.dateRange') : $t('booking.date')}:
      {isDateRangeMode ? getDateRangeDescription() : selectedDate.toLocaleDateString()}
    </p>
    <p class="total">{$t('booking.total')}: ${calculateTotal()}</p>
    <div class="refund-notice">
      <i class="fas fa-exclamation-circle"></i>
      <p>
        <strong>{$t('booking.depositPolicy')}:</strong> {$t('booking.depositText')}
      </p>
    </div>
  </div>
{/if}

          <button
            type="submit"
            class="submit-btn"
            disabled={!selectedService || !name || !email || isSubmitting ||
                     (!isDateRangeMode && !selectedDate) ||
                     (isDateRangeMode && (!selectedStartDate || !selectedEndDate))}
          >
            {#if isSubmitting}
              <i class="fas fa-spinner fa-spin"></i> {$t('booking.processing')}
            {:else}
              {$t('booking.requestReservation')}
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
    min-height: 100vh;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 40px;
    text-align: center;
  }

  h2 {
    font-size: 1.5rem;
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

  /* Date Range Inputs */
  .date-range-inputs {
    background-color: white;
    border-radius: 5px;
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    padding: 15px
  }

  .date-input-group {
    flex: 1;
    min-width: 200px;
  }

  .date-input-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #2c3e50;
  }

  .date-input-group input {
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
  }

  .date-range-preview {
    background-color: #f8fafd;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #e1e8f0;
    margin-bottom: 20px;
  }

  .date-range-preview p {
    margin: 0;
    font-weight: 500;
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

  @media (max-width: 768px) {
    .date-range-inputs {
      flex-direction: column;
    }

    .date-input-group {
      min-width: auto;
    }
  }
</style>
