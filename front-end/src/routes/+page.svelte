<script>
  import Carousel from '$lib/components/Carousel.svelte';
  import GalleryGrid from '$lib/components/GalleryGrid.svelte';
  import BookNow from '$lib/components/BookNow.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import { websiteName } from '$stores/appStore.js';
</script>

<main>
  <Navbar siteTitle={$websiteName} />
  
  <!-- Hero Carousel Section -->
  <section class="hero-section">
    <Carousel />
  </section>
  
  <!-- Book Now Section -->
  <BookNow city="Los Angeles" website_name={$websiteName} />


  <!-- <div class="divider divider-primary"></div> -->
  
  <!-- Featured Gallery -->
  <section class="featured-gallery">
    <div class="section-header">
      <h2 class="text-primary">Featured Work</h2>
      <p class="text-primary">Explore our collection of stunning photography</p>
    </div>
    <GalleryGrid />
  </section>
</main>

<style>
  main {
    max-width: 100vw;
    overflow-x: hidden;
    /* background-color: #fafafa; */
  }
  
  .hero-section {
    margin-top: 75px;
    margin-bottom: -80px;
    position: relative;
    z-index: 10;
  }
  
  .featured-gallery {
    position: relative;
    z-index: 5;
    padding-top: 60px;
  }
  
  .section-header {
    text-align: center;
    max-width: 800px;
    margin: 0 auto 40px;
    padding: 0 20px;
  }
  
  .section-header h2 {
    /* font-family: 'Playfair Display', serif; */
    font-size: 2.5rem;
    font-weight: 700;
    /* color: #2c3e50; */
    margin-bottom: 1rem;
  }
  
  .section-header p {
    font-size: 1.25rem;
    /* color: #4a5568; */
    font-weight: 300;
  }
  
  @media (max-width: 768px) {
    .hero-section {
      margin-bottom: -40px;
    }
    
    .section-header h2 {
      font-size: 2rem;
    }
    
    .section-header p {
      font-size: 1.1rem;
    }
    
    main {
      padding-top: 55px;
    }
  }
</style>