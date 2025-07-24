<script>
  export let siteTitle = "Photography";
  let scrolled = false;
  let activeDropdown = null;
  
  // Dropdown menu items
  const galleriesMenu = [
    { title: "Commercial", href: "/gallery/commercial" },
    { title: "Personal", href: "/gallery/personal" },
    { title: "Events", href: "/gallery/events" }
  ];
  
  const aboutMenu = [
    { title: "About Me", href: "/photography-scaffold/about" },
    { title: "Contact", href: "/photography-scaffold/contact" }
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
  
  // Add scroll event listener
  import { onMount } from 'svelte';
  
  onMount(() => {
    const handleScroll = () => {
      scrolled = window.scrollY > 20;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<nav class={`navbar ${scrolled ? 'scrolled' : ''}`}>
  <div class="site-title">
    <a href="/photography-scaffold/">
        {siteTitle}
    </a>
</div>
  <div class="nav-links">
    <!-- Galleries Dropdown -->
    <div class="dropdown-container"
         on:mouseenter={() => toggleDropdown('galleries')}
         on:mouseleave={closeDropdowns}>
      <a class="nav-link" href="#galleries">Galleries</a>
      {#if activeDropdown === 'galleries'}
        <div class="dropdown-menu">
          {#each galleriesMenu as item}
            <a href={item.href} class="dropdown-item">{item.title}</a>
          {/each}
        </div>
      {/if}
    </div>
    
    <!-- Other Services Dropdown -->
    <div class="dropdown-container"
         on:mouseenter={() => toggleDropdown('services')}
         on:mouseleave={closeDropdowns}>
      <a class="nav-link" href="#services">Other Services</a>
      {#if activeDropdown === 'services'}
        <div class="dropdown-menu">
          {#each servicesMenu as item}
            <a href={item.href} class="dropdown-item">{item.title}</a>
          {/each}
        </div>
      {/if}
    </div>
    
    <!-- About Dropdown -->
    <div class="dropdown-container"
         on:mouseenter={() => toggleDropdown('about')}
         on:mouseleave={closeDropdowns}>
      <a class="nav-link" href="#about">About</a>
      {#if activeDropdown === 'about'}
        <div class="dropdown-menu">
          {#each aboutMenu as item}
            <a href={item.href} class="dropdown-item">{item.title}</a>
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
    background-color: rgba(255, 255, 255, 0.9);
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
    background-color: rgba(255, 255, 255, 0.97);
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  }
  
  .site-title {
    font-family: 'Playfair Display', serif;
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
    color: #333;
    font-size: 0.9rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    position: relative;
    padding-bottom: 5px;
    transition: color 0.3s ease;
    cursor: pointer;
  }
  
  .nav-link:hover {
    color: #888;
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
    color: #333;
    text-decoration: none;
    transition: all 0.2s ease;
    font-size: 0.9rem;
    text-transform: none;
  }
  
  .dropdown-item:hover {
    background-color: #f8f8f8;
    color: #000;
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
</style>