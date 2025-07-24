<script>
  import { galleryImages } from '../utils/images.js';
  import ImageHover from './ImageHover.svelte';
</script>

<div class="gallery-grid" id="gallery">
  {#each galleryImages as image}
    <div class="gallery-item">
      <ImageHover src={`/photography-scaffold/assets/gallery/${image}`} alt="Gallery photo">
        <h3>Brief Description</h3>
      </ImageHover>
    </div>
  {/each}
</div>

<style>
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 25px;
    padding: 60px 5%;
    max-width: 100vw;
    box-sizing: border-box;
  }
  
  .gallery-item {
    aspect-ratio: 4/3;
    height: 100%;
    transition: transform 0.3s ease;
  }
  
  .gallery-item:hover {
    transform: translateY(-5px);
  }
  
  @media (max-width: 768px) {
    .gallery-grid {
      padding: 40px 5%;
      gap: 15px;
    }
  }
</style>