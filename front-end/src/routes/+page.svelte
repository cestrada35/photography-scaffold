<script>
  import Carousel from '$lib/components/Carousel.svelte';
  import GalleryGrid from '$lib/components/GalleryGrid.svelte';
  import BookNow from '$lib/components/BookNow.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import { websiteName } from '$stores/appStore.js';
  import { t } from '$stores/translationStore.js';
</script>

<main>
  <Navbar siteTitle={$websiteName} />
  
  <!-- Hero Carousel Section -->
  <section class="hero-section">
    <Carousel />
  </section>
  
  <!-- Book Now Section -->
  <BookNow city="Los Angeles" website_name={$websiteName} />

  <!-- Featured Gallery -->
  <section class="featured-gallery">
    <div class="section-header">
      <h2 class="text-primary">{$t('home.featuredWork')}</h2>
      <p class="text-primary">{$t('home.exploreCollection')}</p>
    </div>
    <GalleryGrid />
  </section>
</main>

<style>
  main {
    max-width: 100vw;
    overflow-x: hidden;
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
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }
  
  .section-header p {
    font-size: 1.25rem;
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