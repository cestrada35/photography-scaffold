<script>
  import { websiteName } from '$stores/appStore.js';
  import { onMount } from 'svelte';


  // import '$stores/appStore.js'
  let scrolled = false;
  let activeDropdown = null;
  let showGalleryTooltip = true; // Controls tooltip visibility
  
  // Dropdown menu items
  const galleriesMenu = [
    { title: "Commercial", href: "/gallery/commercial" },
    { title: "Personal", href: "/gallery/personal" },
    { title: "Events", href: "/gallery/events" }
    // { title: "Commercial", href: "/photography-scaffold/gallery/commercial" },
    // { title: "Personal", href: "/photography-scaffold/gallery/personal" },
    // { title: "Events", href: "/photography-scaffold/gallery/events" }
  ];
  
  const aboutMenu = [
    { title: "About Me", href: "/about" },
    { title: "Contact", href: "/contact" }
    // { title: "About Me", href: "/photography-scaffold/about" },
    // { title: "Contact", href: "/photography-scaffold/contact" }
  ];
  
  const servicesMenu = [
    { title: "Video Editing", href: "/services/video-editing" },
    { title: "Baking", href: "/services/baking" },
    { title: "Tutoring Services", href: "/services/tutoring" },
    { title: "Design", href: "/services/design" }
  ];
  
  // Toggle dropdowns
  function toggleDropdown(menu) {
    if (activeDropdown === menu) {
      activeDropdown = null;
    } else {
      activeDropdown = menu;
    }
  }
  
  function closeDropdowns() {
    activeDropdown = null;
  }
  
  
  function dismissTooltip() {
    showGalleryTooltip = false;
    // Optional: Store dismissal in localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('galleryTooltipDismissed', 'true');
    }
  }
  
  onMount(() => {
     // Check if tooltip was previously dismissed
    // if (typeof localStorage !== 'undefined') {
    //   showGalleryTooltip = !localStorage.getItem('galleryTooltipDismissed');
    // }
    const handleScroll = () => {
      scrolled = window.scrollY > 20;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<nav class={`navbar ${scrolled ? 'scrolled' : ''}`}>
  <div class="site-title">
    <!-- <a href="/photography-scaffold/"> -->
     <a href="/">
       <p class="text-primary">
           { $websiteName }
       </p>
     </a>
  </div>
  <div class="nav-links">
    <!-- Galleries Dropdown -->
    <div class="dropdown-container relative"
         on:mouseenter={() => toggleDropdown('galleries')}
         on:mouseleave={closeDropdowns}>
      {#if showGalleryTooltip}
        <div class="gallery-tooltip" on:click|stopPropagation={dismissTooltip}>
          <span>✨ Explore our work here! ✨ ➜</span>
          <button class="tooltip-close" on:click|stopPropagation={dismissTooltip}>
            ✕
          </button>
        </div>
      {/if}
      <a class="nav-link text-primary" href="#galleries">Galleries</a>
      
      {#if activeDropdown === 'galleries'}
        <div class="dropdown-menu ">
          {#each galleriesMenu as item}
            <a href={item.href} class="dropdown-item text-primary">{item.title}</a>
          {/each}
        </div>
      {/if}
    </div>
    
    <!-- Other Services Dropdown -->
    <div class="dropdown-container"
         on:mouseenter={() => toggleDropdown('services')}
         on:mouseleave={closeDropdowns}>
      <a class="nav-link text-primary" href="#services">Other Services</a>
      {#if activeDropdown === 'services'}
        <div class="dropdown-menu ">
          {#each servicesMenu as item}
            <a href={item.href} class="dropdown-item text-primary">{item.title}</a>
          {/each}
        </div>
      {/if}
    </div>
    
    <!-- About Dropdown -->
    <div class="dropdown-container"
         on:mouseenter={() => toggleDropdown('about')}
         on:mouseleave={closeDropdowns}>
      <a class="nav-link text-primary" href="#about">About</a>
      {#if activeDropdown === 'about'}
        <div class="dropdown-menu ">
          {#each aboutMenu as item}
            <a href={item.href} class="dropdown-item text-primary">{item.title}</a>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</nav>

<style>
  .navbar {
    position: fixed;
    top: 0;
    width: 100%;
    /* background-color: rgba(255, 255, 255, 0.9); */
    padding: 15px 5%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1000;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .navbar.scrolled {
    padding: 10px 5%;
    background-color: rgba(255, 240, 217, 0.85);
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  }
  
  .site-title {
    /* font-family: 'Playfair Display', serif; */
    font-size: 1.8rem;
    letter-spacing: 1px;
    font-weight: 500;
  }
  
  .nav-links {
    display: flex;
    gap: 30px;
    position: relative;
  }
  
  .nav-link {
    text-decoration: none;
    /* color: #333; */
    font-size: 0.9rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    position: relative;
    padding-bottom: 5px;
    transition: color 0.3s ease;
    cursor: pointer;
  }
  
  .nav-link:hover {
    /* color: #888; */
  }
  
  .dropdown-container {
    position: relative;
  }
  
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: white;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 10px 0;
    min-width: 200px;
    z-index: 1001;
    animation: fadeIn 0.3s ease;
  }
  
  .dropdown-item {
    display: block;
    padding: 10px 20px;
    /* color: #333; */
    text-decoration: none;
    transition: all 0.2s ease;
    font-size: 0.9rem;
    text-transform: none;
  }
  
  .dropdown-item:hover {
    background-color: #f8f8f8;
    /* color: #000; */
    padding-left: 25px;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @media (max-width: 768px) {
    .nav-links {
      gap: 15px;
    }
    
    .site-title {
      font-size: 1.5rem;
    }
    
    .nav-link {
      font-size: 0.8rem;
    }
    
    .dropdown-menu {
      min-width: 160px;
    }
  }

  .gallery-tooltip {
    position: absolute;
    top: -6px;
    left: -170%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #56fff4 0%, #fb76d7 100%);
    color: #5a3d1a;
    padding: 8px 16px;
    border-radius: 20px;
    height: 35px;
    font-size: 0.85rem;
    font-weight: 600;
    white-space: nowrap;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: default;
    z-index: 1002;
    animation: float 3s ease-in-out infinite;
  }
  
  .gallery-tooltip::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
  }
</style>