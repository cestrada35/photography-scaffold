<script>
  import Carousel from '$lib/components/Carousel.svelte';
  import GalleryGrid from '$lib/components/GalleryGrid.svelte';
  import BookNow from '$lib/components/BookNow.svelte';
  import Navbar from '$lib/components/Navbar.svelte';

  // TODO: set siteTitle/website_name in script section
</script>

<main>
  <Navbar siteTitle = "Jane's Photography"/>
  <Carousel />
  <BookNow city="Los Angeles" website_name="Jane's Photography"/>
  <GalleryGrid />
</main>

<style>
  main {
    max-width: 100vw;
    overflow-x: hidden;

  }
  
  @media (max-width: 768px) {
    main {
      padding-top: 55px;
    }
  }
</style>