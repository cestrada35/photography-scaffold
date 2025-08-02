<!-- src/routes/gallery/[category]/+page.svelte -->
<script>
  import Navbar from '$lib/components/Navbar.svelte';
  import { galleryImages, galleryImageDescriptions, galleryImageCategories } from '$lib/utils/images.js';
  import { onMount } from 'svelte';
  const category = 'event'
  
  // Combine images with their metadata
  $: galleryItems = galleryImages.map((image, index) => ({
    filename: image,
    description: galleryImageDescriptions[index] || '',
    category: galleryImageCategories[index] || 'other'
  }));
  
  // Filter items by category
  $: filteredItems = category === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === category);
  
  // Animation state
  let loaded = false;
  
  onMount(() => {
    loaded = true;
  });
</script>

<Navbar />

<main class="gallery-page">
  <!-- Hero Section -->
  <section class="hero-section">
    <div class="hero-content">
      <h1 class="hero-title">
        {#if category === 'commercial'}
          Commercial Portfolio
        {:else if category === 'personal'}
          Personal Portraits
        {:else if category === 'event'}
          Event Photography
        {:else}
          Photography Gallery
        {/if}
      </h1>
      <p class="hero-subtitle">
        {#if category === 'commercial'}
          Professional imagery for brands and businesses
        {:else if category === 'personal'}
          Authentic moments and meaningful portraits
        {:else if category === 'event'}
          Capturing your special occasions
        {:else}
          A collection of our finest work
        {/if}
      </p>
    </div>
  </section>

  <!-- Gallery Grid -->
  <div class="gallery-container">
    {#each filteredItems as item, index (item.filename)}
      <div 
        class="gallery-item" 
        style={`--delay: ${index * 0.1}s`}
        class:loaded={loaded}
      >
        <div class="image-container">
          <!-- src={`/assets/gallery/${item.filename}`} -->
          <img 
            src={`/photography-scaffold/assets/gallery/${item.filename}`} 
            alt={item.description}
            loading="lazy"
          />
          <div class="image-overlay">
            <p class="image-description">{item.description}</p>
            <span class="image-category">{item.category}</span>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Empty State -->
  {#if filteredItems.length === 0}
    <div class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <h3>No photos in this category</h3>
      <p>We couldn't find any photos matching this category</p>
      <a href="/gallery/all" class="btn-primary">View All Photos</a>
    </div>
  {/if}
</main>

<style>
  /* Base Styles */
  .gallery-page {
    padding-top: 80px;
    background-color: #fafafa;
  }

  /* Hero Section */
  .hero-section {
    height: 60vh;
    min-height: 500px;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .hero-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
  }

  .hero-content {
    text-align: center;
    position: relative;
    z-index: 2;
    padding: 0 20px;
    max-width: 800px;
    margin: 0 auto;
  }

  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 4rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 1rem;
    line-height: 1.2;
    text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
  }

  .hero-subtitle {
    font-size: 1.5rem;
    color: #4a5568;
    max-width: 600px;
    margin: 0 auto;
    font-weight: 300;
  }

  /* Gallery Grid */
  .gallery-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;
    padding: 60px 5%;
    max-width: 1600px;
    margin: 0 auto;
  }

  .gallery-item {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--delay);
  }

  .gallery-item.loaded {
    opacity: 1;
    transform: translateY(0);
  }

  .image-container {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    aspect-ratio: 4/3;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .gallery-item:hover .image-container {
    transform: translateY(-10px);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  .image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .gallery-item:hover img {
    transform: scale(1.05);
  }

  .image-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 30px;
    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
    color: white;
    opacity: 0;
    transition: opacity 0.3s ease;
    transform: translateY(20px);
    transition: all 0.3s ease;
  }

  .gallery-item:hover .image-overlay {
    opacity: 1;
    transform: translateY(0);
  }

  .image-description {
    font-size: 1rem;
    line-height: 1.5;
    margin-bottom: 10px;
  }

  .image-category {
    display: inline-block;
    padding: 4px 12px;
    background-color: rgba(255,255,255,0.2);
    border-radius: 20px;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    backdrop-filter: blur(5px);
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 80px 20px;
    grid-column: 1 / -1;
  }

  .empty-state svg {
    width: 80px;
    height: 80px;
    stroke-width: 1.5;
    color: #cbd5e0;
    margin-bottom: 20px;
  }

  .empty-state h3 {
    font-size: 1.5rem;
    color: #2d3748;
    margin-bottom: 10px;
  }

  .empty-state p {
    color: #718096;
    margin-bottom: 20px;
  }

  /* Button Styles */
  .btn-primary {
    display: inline-block;
    padding: 12px 24px;
    background-color: #2c3e50;
    color: white;
    border-radius: 30px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .btn-primary:hover {
    background-color: #1a202c;
    transform: translateY(-2px);
  }

  /* Responsive Adjustments */
  @media (max-width: 1024px) {
    .hero-title {
      font-size: 3rem;
    }
    
    .hero-subtitle {
      font-size: 1.25rem;
    }
    
    .gallery-container {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.5rem;
    }
    
    .hero-section {
      height: 50vh;
      min-height: 400px;
    }
    
    .gallery-container {
      grid-template-columns: 1fr;
      padding: 40px 20px;
      gap: 20px;
    }
  }
</style>