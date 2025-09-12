<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  
  let mounted = false;
  
  onMount(() => {
    mounted = true;
  });
</script>

<div class="error-container" in:fade={{ duration: 600 }}>
  <div class="error-content" class:visible={mounted}>
    <div class="error-number">404</div>
    <h1 class="error-title">Page Not Found</h1>
    <p class="error-message">
      Sorry, we couldn't find the page you're looking for.
    </p>
    <div class="error-actions">
      <a href="/" class="btn btn-primary">Home</a>
    </div>
  </div>
</div>

<style>
  .error-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  }
  
  .error-content {
    text-align: center;
    max-width: 600px;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  
  .error-content.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .error-number {
    font-size: 8rem;
    font-weight: 900;
    line-height: 1;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .error-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: #2d3748;
  }
  
  .error-message {
    font-size: 1.125rem;
    line-height: 1.6;
    margin-bottom: 2.5rem;
    color: #4a5568;
  }
  
  .error-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding-bottom: 9%;
  }
  
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  .btn-secondary {
    background: transparent;
    color: #667eea;
    border: 2px solid #667eea;
  }
  
  .btn-secondary:hover {
    background: #667eea;
    color: white;
  }
  
  /* Responsive design */
  @media (max-width: 640px) {
    .error-number {
      font-size: 6rem;
    }
    
    .error-title {
      font-size: 1.5rem;
    }
    
    .error-message {
      font-size: 1rem;
    }
    
    .error-actions {
      flex-direction: column;
      align-items: center;
    }
    
    .btn {
      width: 100%;
      max-width: 250px;
    }
  }
</style>