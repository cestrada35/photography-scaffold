

<script>
  import { galleryImages, galleryImageDescriptions, galleryImageCategories } from '../utils/images.js';
  import { onMount } from 'svelte';
  
  // Animation state
  let loaded = false;

  // Arbirary limit
  const galleryLimit = 9;
  
  onMount(() => {
    loaded = true;
  });
  
  // Combine images with metadata
  $: galleryItems = galleryImages.map((image, index) => ({
    filename: image,
    description: galleryImageDescriptions[index] || '',
    category: galleryImageCategories[index] || 'other'
  }));
</script>

<div class="gallery-grid" id="gallery">
  {#each galleryItems as item, index (item.filename)}
    {#if index < galleryLimit}
      <div 
        class="gallery-item" 
        style={`--delay: ${index * 0.1}s`}
        class:loaded={loaded}
      >
        <div class="image-container">
          <img 
            src={`/assets/gallery/${item.filename}`} 
            alt={item.description}
            loading="lazy"
          />
          <!-- <img 
            src={`/photography-scaffold/assets/gallery/${item.filename}`} 
            alt={item.description}
            loading="lazy"
          /> -->
          <div class="image-overlay">
            <p class="image-description">{item.description}</p>
            <span class="image-category">{item.category}</span>
          </div>
        </div>
      </div>
    {/if}
  {/each}
</div>

<style>
  /* Base Grid Layout */
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;
    padding: 80px 5%;
    max-width: 1600px;
    margin: 0 auto;
  }

  /* Gallery Item Animation */
  .gallery-item {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--delay);
    aspect-ratio: 4/3;
  }

  .gallery-item.loaded {
    opacity: 1;
    transform: translateY(0);
  }

  /* Image Container */
  .image-container {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
                0 10px 10px -5px rgba(0, 0, 0, 0.04);
    height: 100%;
    width: 100%;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .gallery-item:hover .image-container {
    transform: translateY(-10px);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  /* Image Styling */
  .image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .gallery-item:hover img {
    transform: scale(1.05);
  }

  /* Overlay Effect */
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
  }

  .gallery-item:hover .image-overlay {
    opacity: 1;
    transform: translateY(0);
  }

  /* Text Styles */
  .image-description {
    font-size: 1rem;
    line-height: 1.5;
    margin-bottom: 10px;
    font-weight: 500;
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

  /* Responsive Adjustments */
  @media (max-width: 1024px) {
    .gallery-grid {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
  }

  @media (max-width: 768px) {
    .gallery-grid {
      grid-template-columns: 1fr;
      padding: 60px 20px;
      gap: 20px;
    }
    
    .image-overlay {
      padding: 20px;
    }
  }
</style>