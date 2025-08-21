<script>
  import Navbar from '$lib/components/Navbar.svelte';
  import { websiteName } from '$stores/appStore'; 
  
  let name = '';
  let email = '';
  let message = '';
  
  function handleSubmit() {
    alert(`Thank you for your message, ${name}! I'll get back to you soon.`);
    name = '';
    email = '';
    message = '';
  }
</script>

<main>
  <Navbar siteTitle=$websiteName />
  
  <div class="contact-container">
    <div class="contact-content">
      <h1 class="text-primary">Get In Touch</h1>
      
      <div class="contact-methods">
        <div class="contact-info text-primary">
          <h2>Contact Information</h2>
          
          <div class="info-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <div>
              <h3>Email</h3>
              <p class="text-primary">contact@photographyservices.com</p>
            </div>
          </div>
          
          <div class="info-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            <div>
              <h3>Phone</h3>
              <p class="text-primary">(555) 123-1234</p>
            </div>
          </div>
          
          <div class="location-note">
            <h3>Location Note</h3>
            <p>
              I'm currently based in Los Angeles, California. If you're outside my service radius, 
              please don't hesitate to reach out - I'm always open to discussing how we might make 
              it work together! I frequently travel for assignments and would be happy to explore options.
            </p>
          </div>
        </div>
        
        <div class="contact-form">
          <h2>Send a Message</h2>
          <form on:submit|preventDefault={handleSubmit}>
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" bind:value={name} required />
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" bind:value={email} required />
            </div>
            
            <div class="form-group">
              <label for="message">Message</label>
              <textarea id="message" bind:value={message} rows="5" required></textarea>
            </div>
            
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  main {
    padding-top: 60px;
    /* background-color: #fafafa; */
    min-height: 100vh;
  }
  
  .contact-container {
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
    /* background-color: #333; */
    background-color: #a4a4a4;
  }
  
  .contact-methods {
    display: flex;
    gap: 50px;
  }
  
  .contact-info, .contact-form {
    flex: 1;
  }
  
  .info-item {
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
    align-items: flex-start;
  }
  
  .info-item svg {
    width: 30px;
    height: 30px;
    min-width: 30px;
    color: #555;
  }
  
  .info-item h3 {
    font-size: 1.3rem;
    margin-bottom: 8px;
  }
  
  .info-item p {
    font-size: 1.1rem;
    /* color: #555; */
  }
  
  .location-note {
    background-color: #f8f8f8;
    padding: 20px;
    border-radius: 8px;
    margin-top: 40px;
  }
  
  .location-note h3 {
    font-size: 1.3rem;
    margin-bottom: 15px;
  }
  
  .location-note p {
    font-size: 1rem;
    line-height: 1.7;
    color: #555;
  }
  
  .contact-form {
    background-color: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  }
  
  .form-group {
    margin-bottom: 25px;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    font-size: 1rem;
  }
  
  input, textarea {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: inherit;
    font-size: 1rem;
    transition: border-color 0.3s;
  }
  
  input:focus, textarea:focus {
    outline: none;
    border-color: #888;
  }
  
  button {
    background-color: #333;
    color: white;
    border: none;
    padding: 14px 30px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
    width: 100%;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  button:hover {
    background-color: #555;
  }
  
  @media (max-width: 900px) {
    .contact-methods {
      flex-direction: column;
    }
    
    h1 {
      font-size: 2.2rem;
    }
  }
  
  @media (max-width: 600px) {
    .contact-container {
      padding: 40px 15px;
    }
    
    .contact-form {
      padding: 20px;
    }
  }
</style>