<script>
  import Navbar from '$lib/components/Navbar.svelte';
  import { siteOwner } from '$stores/appStore';
</script>

<main>
  <Navbar siteTitle="Jane's Photography" />
  
  <div class="about-container">
    <div class="about-content">
      <h1>About Me</h1>
      
      <div class="about-section">
        <div class="about-text">
          <p>
            Hello, I'm { $siteOwner } and for the past 15 years, my camera has been my passport to capturing the soul of moments. My journey began with a profound personal inspiration – the fleeting, magical childhood of my son.
            It was there, amidst the everyday joys and milestones, that I truly fell in love with freezing time, transforming genuine emotions into cherished memories.
          </p>
          <p>
            Today, my passion translates into a diverse canvas of visual storytelling. 
            I specialize in crafting luminous portraits that truly reveal the essence of an individual, preserving the unforgettable energy of events – from the vibrant spirit of community gatherings like my son's school functions and swim meets, to elegant celebrations across the beautiful Beach Cities and Palos Verdes, where I've built trusted relationships with clients over many wonderful years. Furthermore, I create compelling commercial narratives that elevate brands and connect powerfully with their audience. My commitment extends beyond the lens; I meticulously sculpt each image and video through expert editing, ensuring every final piece is a masterpiece of clarity and impact.
          </p>
          
          <p>
            As a Chinese photographer, my perspective is enriched by a blend of cultural appreciation and a deep understanding of human connection. 
          </p>
          
          <p>
            I believe every photograph and video should be a true reflection of joy, personality, and purpose. Let's collaborate to tell your unique story – authentically, artfully, and unforgettably.
          </p>
        </div>
        
        <div class="about-image">
          <!-- <img src="/assets/cover/cover2.jpg" alt="Photographer portrait" /> -->
          <img src="/photography-scaffold/assets/cover/cover2.jpg" alt="Photographer portrait" />
        </div>
      </div>
      
      <div class="philosophy">
        <h2>My Photography Philosophy</h2>
        <p>
          I believe in creating images that tell stories and evoke emotions. Photography isn't just about capturing what you see, 
          but revealing what you feel. Every session is a collaboration, where I work closely with clients to understand their vision 
          and bring it to life through my lens.
        </p>
      </div>
    </div>
  </div>
</main>

<style>
  main {
    padding-top: 60px;
    background-color: #fafafa;
  }
  
  .about-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 60px 20px;
  }
  
  h1 {
    text-align: center;
    font-size: 2.8rem;
    margin-bottom: 50px;
    position: relative;
    padding-bottom: 20px;
  }
  
  h1::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background-color: #333;
  }
  
  .about-section {
    display: flex;
    gap: 50px;
    margin-bottom: 60px;
  }
  
  .about-text {
    flex: 1;
  }
  
  .about-text p {
    margin-bottom: 25px;
    line-height: 1.8;
    font-size: 1.1rem;
  }
  
  .about-image {
    flex: 1;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    border-radius: 2%;
  }
  
  .about-image img {
    width: 100%;
    height: 100%;
    object-fit:fill;
    transition: transform 0.5s ease;
  }
  
  .about-image:hover img {
    transform: scale(1.03);
  }
  
  .philosophy {
    background-color: white;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    max-width: 800px;
    margin: 0 auto;
  }
  
  .philosophy h2 {
    font-size: 1.8rem;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .philosophy p {
    font-size: 1.1rem;
    line-height: 1.8;
    text-align: center;
    font-style: italic;
    color: #555;
  }
  
  @media (max-width: 900px) {
    .about-section {
      flex-direction: column;
    }
    
    .about-image {
      order: -1;
      max-height: 400px;
    }
    
    h1 {
      font-size: 2.2rem;
    }
  }
  
  @media (max-width: 600px) {
    .about-container {
      padding: 40px 15px;
    }
    
    .philosophy {
      padding: 25px;
    }
  }
</style>