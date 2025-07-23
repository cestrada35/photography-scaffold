<script>
  import Navbar from '$lib/components/Navbar.svelte';
</script>

<main>
  <Navbar siteTitle="Jane's Photography" />
  
  <div class="about-container">
    <div class="about-content">
      <h1>About Me</h1>
      
      <div class="about-section">
        <div class="about-text">
          <p>
            I'm Jane Doe, a professional photographer with over 5 years of experience capturing life's most precious moments. 
            My journey began in the bustling streets of my city, where I discovered my passion for visual storytelling.
          </p>
          
          <p>
            Specializing in portrait and event photography, I strive to capture authentic emotions and create timeless imagery. 
            My approach blends technical expertise with an intuitive understanding of light and composition, resulting in photographs 
            that feel both artistic and genuine.
          </p>
          
          <p>
            Over the years, I've had the privilege of working with diverse clients, from families celebrating milestones to 
            brands seeking compelling visual content. My greatest satisfaction comes from creating images that hold deep personal meaning for my clients.
          </p>
          
          <p>
            When I'm not behind the camera, you'll find me exploring new locations for inspiration, teaching photography workshops, 
            or experimenting with film photography techniques.
          </p>
        </div>
        
        <div class="about-image">
          <img src="/assets/about.jpg" alt="Photographer portrait" />
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
  }
  
  .about-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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