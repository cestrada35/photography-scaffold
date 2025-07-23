<script>
  import { page } from '$app/stores';
  
  // Service details
  const service = $page.params.service || '';
  
  // Service information
  const services = {
    'video-editing': {
      title: 'Professional Video Editing',
      description: 'I offer professional video editing services to bring your footage to life. With expertise in various editing software and a keen eye for storytelling, I can transform raw footage into compelling visual narratives.',
      details: [
        'Color correction and grading',
        'Audio enhancement and sound design',
        'Motion graphics and titles',
        'Multi-camera editing',
        'Export in any format required'
      ],
      price: 'Starting at $75/hour'
    },
    'baking': {
      title: 'Artisan Baking Services',
      description: 'Beyond photography, I create artisanal baked goods for special occasions. Using traditional techniques and high-quality ingredients, each creation is crafted with the same attention to detail as my photography.',
      details: [
        'Custom cakes for all occasions',
        'French pastries and desserts',
        'Artisan breads',
        'Gluten-free and vegan options',
        'Local delivery available'
      ],
      price: 'Custom pricing based on order'
    },
    'tutoring': {
      title: 'Photography Tutoring',
      description: 'Share my passion for photography through personalized tutoring sessions. Whether you\'re a beginner looking to master your camera or an enthusiast wanting to refine your skills, I offer tailored instruction.',
      details: [
        'Camera fundamentals and settings',
        'Composition and lighting techniques',
        'Post-processing in Lightroom/Photoshop',
        'Portfolio development',
        'One-on-one or small group sessions'
      ],
      price: '$60/hour for individual sessions'
    },
    'design': {
      title: 'Graphic Design Services',
      description: 'Complementing my photography, I offer graphic design services to help you create cohesive visual identities. From branding to marketing materials, I create designs that communicate effectively.',
      details: [
        'Logo and branding design',
        'Marketing collateral',
        'Social media graphics',
        'Photo editing and compositing',
        'Print and digital layouts'
      ],
      price: 'Project-based pricing starting at $300'
    }
  };
  
  // Current service
  $: currentService = services[service] || {
    title: 'Service Not Found',
    description: 'The requested service is not available.',
    details: [],
    price: ''
  };
</script>

<div class="service-page">
  <div class="service-header">
    <h1>{currentService.title}</h1>
    {#if currentService.price}
      <div class="price-tag">{currentService.price}</div>
    {/if}
  </div>
  
  <div class="service-content">
    <div class="service-description">
      <p>{currentService.description}</p>
      
      <div class="service-details">
        <h2>Service Details</h2>
        <ul>
          {#each currentService.details as detail}
            <li>{detail}</li>
          {/each}
        </ul>
      </div>
      
      <div class="cta-section">
        <p>Ready to get started or have questions?</p>
        <a href="/contact" class="cta-button">Contact Me</a>
      </div>
    </div>
    
    <div class="service-image">
      <div class="image-placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
        <span>Service Image</span>
      </div>
    </div>
  </div>
</div>

<style>
  .service-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 60px 20px;
  }
  
  .service-header {
    text-align: center;
    margin-bottom: 50px;
    position: relative;
  }
  
  .service-header h1 {
    font-size: 2.5rem;
    margin-bottom: 15px;
  }
  
  .price-tag {
    display: inline-block;
    background-color: #333;
    color: white;
    padding: 8px 20px;
    border-radius: 30px;
    font-size: 1.1rem;
  }
  
  .service-content {
    display: flex;
    gap: 50px;
  }
  
  .service-description {
    flex: 1;
  }
  
  .service-description p {
    font-size: 1.1rem;
    line-height: 1.8;
    margin-bottom: 30px;
  }
  
  .service-details {
    margin-bottom: 40px;
  }
  
  .service-details h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  
  .service-details ul {
    padding-left: 20px;
  }
  
  .service-details li {
    margin-bottom: 12px;
    font-size: 1.1rem;
  }
  
  .cta-section {
    background-color: #f8f8f8;
    padding: 25px;
    border-radius: 8px;
    text-align: center;
  }
  
  .cta-section p {
    margin-bottom: 20px;
    font-size: 1.1rem;
  }
  
  .cta-button {
    display: inline-block;
    background-color: #333;
    color: white;
    padding: 12px 35px;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.3s;
  }
  
  .cta-button:hover {
    background-color: #555;
  }
  
  .service-image {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .image-placeholder {
    width: 100%;
    height: 400px;
    background-color: #f0f0f0;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #999;
  }
  
  .image-placeholder svg {
    width: 80px;
    height: 80px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 900px) {
    .service-content {
      flex-direction: column;
    }
    
    .service-image {
      order: -1;
      margin-bottom: 30px;
    }
    
    .image-placeholder {
      height: 300px;
    }
  }
  
  @media (max-width: 600px) {
    .service-page {
      padding: 40px 15px;
    }
    
    .service-header h1 {
      font-size: 2rem;
    }
  }
</style>