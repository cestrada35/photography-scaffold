<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  
  let message = 'Processing your request...';
  
  onMount(async () => {
    const { id } = $page.params;
    try {
      const response = await fetch(`/api/admin/reject/${id}`, { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        message = 'Booking rejected successfully!';
      } else {
        message = 'Error: ' + (data.error || 'Unknown error');
      }
    } catch (error) {
      message = 'Error processing request: ' + error.message;
    }
  });
</script>

<div style="text-align: center; padding: 40px;">
  <h1>Booking Rejection</h1>
  <p>{message}</p>
  <a href="/">Return to Home</a>
</div>