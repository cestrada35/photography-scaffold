<script>
  import { carouselImages } from '../utils/images.js';
  import { onMount } from 'svelte';
  
  let currentIndex = 0;
  let interval;
  
  onMount(() => {
    // Setup auto-rotation
    interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  });
  
  function nextSlide() {
    currentIndex = (currentIndex + 1) % carouselImages.length;
    resetInterval();
  }
  
  function prevSlide() {
    currentIndex = (currentIndex - 1 + carouselImages.length) % carouselImages.length;
    resetInterval();
  }
  
  function goToSlide(index) {
    currentIndex = index;
    resetInterval();
  }
  
  function resetInterval() {
    clearInterval(interval);
    interval = setInterval(() => {
      nextSlide();
    }, 5000);
  }
</script>

<div class="carousel-container">
  <div class="carousel-track" style={`transform: translateX(-${currentIndex * 100}%)`}>
    {#each carouselImages as image}
      <div class="carousel-slide">
        <img 
          src={`/assets/carousel/${image}`} 
          alt="Featured photography" 
          class="carousel-image"
        />
        <!-- <img 
          src={`/photography-scaffold/assets/carousel/${image}`} 
          alt="Featured photography" 
          class="carousel-image"
        /> -->
      </div>
    {/each}
  </div>
  
  <!-- Navigation Arrows -->
  <button class="carousel-arrow prev" on:click={prevSlide} aria-label="Previous slide">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="36px" height="36px">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
    </svg>
  </button>
  <button class="carousel-arrow next" on:click={nextSlide} aria-label="Next slide">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="36px" height="36px">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
    </svg>
  </button>
  
  <!-- Navigation Dots -->
  <div class="carousel-dots">
    {#each carouselImages as _, i}
      <button 
        class="dot {i === currentIndex ? 'active' : ''}" 
        on:click={() => goToSlide(i)}
        aria-label={`Go to slide ${i + 1}`}
      />
    {/each}
  </div>
</div>

<style>
  .carousel-container {
    height: 70vh;
    width: 100%;
    overflow: hidden;
    position: relative;
    box-shadow: 0 10px 30px rgba(78, 78, 78, 0.616);
    transform: translateY(-5px);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  /* .carousel-container:hover {
      transform: translateY(-8px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
  } */
  
  .carousel-track {
    display: flex;
    height: 100%;
    transition: transform 0.8s ease-in-out;
  }
  
  .carousel-slide {
    min-width: 100%;
    height: 100%;
  }
  
  .carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
  
  .carousel-dots {
    position: absolute;
    bottom: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  
  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    border: none;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .dot.active {
    background: white;
  }
  
  .carousel-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.3);
    color: white;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    padding: 10px 15px;
    border-radius: 50%;
    z-index: 10;
    opacity: 0.7;
    transition: opacity 0.3s, background 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
  }
  
  .carousel-arrow:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.6);
  }
  
  .prev {
    left: 20px;
  }
  
  .next {
    right: 20px;
  }
  
  .carousel-arrow svg {
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
  }
</style>