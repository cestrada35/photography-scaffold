
<script>
  import { onMount } from 'svelte';
  import { t } from '$stores/translationStore.js';

  let reservations = [];
  let loading = true;
  let error = '';

  async function loadReservations() {
    try {
      loading = true;
      const response = await fetch('/api/admin/reservations');
      if (response.ok) {
        reservations = await response.json();
      } else {
        error = 'Failed to load reservations';
      }
    } catch (err) {
      error = 'Error loading reservations';
      console.error(err);
    } finally {
      loading = false;
    }
  }

  async function updateReservationStatus(reservationId, status) {
    try {
      const response = await fetch(`/api/admin/reservations/${reservationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        await loadReservations();
      } else {
        alert('Failed to update reservation');
      }
    } catch (err) {
      alert('Error updating reservation');
      console.error(err);
    }
  }

  function formatDateRange(reservation) {
    if (reservation.is_date_range) {
      return `${new Date(reservation.start_date).toLocaleDateString()} - ${new Date(reservation.end_date).toLocaleDateString()}`;
    } else {
      return new Date(reservation.event_date).toLocaleDateString();
    }
  }

  function getStatusBadge(status) {
    const statuses = {
      pending: { class: 'badge-warning', text: $t('admin.pending') },
      confirmed: { class: 'badge-success', text: $t('admin.confirmed') },
      rejected: { class: 'badge-error', text: $t('admin.rejected') }
    };
    return statuses[status] || { class: 'badge-neutral', text: status };
  }

  onMount(() => {
    loadReservations();
  });
</script>

<div class="admin-dashboard">
  <div class="container">
    <h1 class="text-primary">{$t('admin.reservationManagement')}</h1>

    {#if loading}
      <div class="loading">{$t('admin.loading')}</div>
    {:else if error}
      <div class="error-alert">{$t('admin.errorLoading')}: {error}</div>
    {:else}
      <div class="reservations-list">
        {#each reservations as reservation}
          <div class="reservation-card">
            <div class="reservation-header">
              <h3>{reservation.customer_name} - {reservation.service_type}</h3>
              <span class:badge={true} class={getStatusBadge(reservation.status).class}>
                {getStatusBadge(reservation.status).text}
              </span>
            </div>

            <div class="reservation-details">
              <p><strong>{$t('admin.email')}:</strong> {reservation.customer_email}</p>
              <p><strong>{$t('admin.dates')}:</strong> {formatDateRange(reservation)}</p>
              {#if reservation.is_date_range}
                <p class="date-range-indicator"><strong>{$t('admin.dateRange')}:</strong> {$t('admin.yes')}</p>
              {/if}
              <p><strong>{$t('admin.hours')}:</strong> {reservation.hours}</p>
              {#if reservation.notes}
                <p><strong>{$t('admin.notes')}:</strong> {reservation.notes}</p>
              {/if}
              <p><strong>{$t('admin.submitted')}:</strong> {new Date(reservation.created_at).toLocaleString()}</p>
            </div>

            {#if reservation.status === 'pending'}
              <div class="reservation-actions">
                <button
                  class="btn-confirm"
                  on:click={() => updateReservationStatus(reservation.id, 'confirmed')}
                >
                  {$t('admin.confirm')}
                </button>
                <button
                  class="btn-reject"
                  on:click={() => updateReservationStatus(reservation.id, 'rejected')}
                >
                  {$t('admin.reject')}
                </button>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .admin-dashboard {
    padding: 80px 20px 40px;
    min-height: 100vh;
    background-color: #f5f7fa;
  }

  .container {
    max-width: 1000px;
    margin: 0 auto;
  }

  h1 {
    text-align: center;
    margin-bottom: 40px;
    font-size: 2.5rem;
  }

  .loading, .error-alert {
    text-align: center;
    padding: 40px;
    font-size: 1.2rem;
  }

  .error-alert {
    color: #dc2626;
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
  }

  .reservations-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .reservation-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
  }

  .reservation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .reservation-header h3 {
    margin: 0;
    font-size: 1.3rem;
    color: #1f2937;
  }

  .date-range-indicator {
    background-color: #e0f2fe;
    padding: 8px 12px;
    border-radius: 6px;
    border-left: 4px solid #0369a1;
  }

  .badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .badge-warning {
    background-color: #fef3c7;
    color: #92400e;
  }

  .badge-success {
    background-color: #d1fae5;
    color: #065f46;
  }

  .badge-error {
    background-color: #fee2e2;
    color: #991b1b;
  }

  .badge-neutral {
    background-color: #f3f4f6;
    color: #374151;
  }

  .reservation-details {
    margin-bottom: 20px;
  }

  .reservation-details p {
    margin: 8px 0;
    color: #4b5563;
  }

  .reservation-actions {
    display: flex;
    gap: 12px;
  }

  .btn-confirm, .btn-reject {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-confirm {
    background-color: #10b981;
    color: white;
  }

  .btn-confirm:hover {
    background-color: #059669;
  }

  .btn-reject {
    background-color: #ef4444;
    color: white;
  }

  .btn-reject:hover {
    background-color: #dc2626;
  }

  @media (max-width: 768px) {
    .reservation-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .reservation-actions {
      flex-direction: column;
    }
  }
</style>
