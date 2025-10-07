<script>
  import Navbar from '$lib/components/Navbar.svelte';
  import { siteOwner } from '$stores/appStore';
  import { t } from '$stores/translationStore.js';
</script>

<main>
  <Navbar siteTitle="Jane's Photography" />
  
  <div class="about-container">
    <div class="about-content">
      <h1 class="text-primary">{$t('about.aboutMe')}</h1>
      
      <div class="about-section">
        <div class="about-text text-primary">
          <p>
            {$t('about.introduction', { siteOwner: $siteOwner })}
          </p>
          <p>
            {$t('about.passion')}
          </p>
          
          <p>
            {$t('about.culturalPerspective')}
          </p>
          
          <p>
            {$t('about.closing')}
          </p>
        </div>
        
        <div class="about-image">
          <img src="/assets/cover/cover2.jpg" alt="Photographer portrait" />
        </div>
      </div>
      
      <div class="philosophy text-primary">
        <h2>{$t('about.philosophyTitle')}</h2>
        <p>
          {$t('about.philosophyText')}
        </p>
      </div>
    </div>
  </div>
</main>

<style>
  main {
    padding-top: 60px;
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
    background-color: #a4a4a4;
  }
  
  .about-section {
    display: flex;
    gap: 50px;
    margin-bottom: 60px;
  }
  
  .about-text {
    flex: 1;
    align-content: space-around;
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
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    border-radius: 2%;
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