<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { websiteName } from '$stores/appStore.js';
  
  // Create a store for the current language
  export const currentLang = writable('en');


  
  // Reactive variables
  let scrolled = false;
  let activeDropdown = null;
  let dropdownTimeout = null;
  let hoveredDropdown = null;
  
  // Language-specific content
  const content = {
    en: {
      websiteName: $websiteName,
      galleries: "Galleries",
      commercial: "Commercial",
      personal: "Personal",
      events: "Events",
      nature: "Nature",
      services: "Other Services",
      catering: "Helen's Studio Kitchen",
      store: "Online Store",
      about: "About",
      aboutMe: "About Me",
      contact: "Contact",
      bookNow: "Book Now",
      toggleLabel: "切换至中文"
    },
    zh: {
      websiteName: $websiteName, // Kept in English for now...
      galleries: "作品集",
      commercial: "商业摄影",
      personal: "个人摄影",
      events: "活动摄影",
      nature: "自然摄影",
      services: "其他服务",
      catering: "餐饮服务",
      store: "在线商店",
      about: "关于我们",
      aboutMe: "关于我",
      contact: "联络我们",
      bookNow: "立即预订",
      toggleLabel: "Switch to English"
    }
  };
  
  // Dropdown menu items - will be reactive based on language
  let galleriesMenu = [];
  let aboutMenu = [];
  let servicesMenu = [];
  
  // Update menus when language changes
  currentLang.subscribe(lang => {
    galleriesMenu = [
      { title: content[lang].commercial, href: "/gallery/commercial" },
      { title: content[lang].personal, href: "/gallery/personal" },
      { title: content[lang].events, href: "/gallery/events" },
      { title: content[lang].nature, href: "/gallery/nature" }
    ];
    
    aboutMenu = [
      { title: content[lang].aboutMe, href: "/about" },
      { title: content[lang].contact, href: "/contact" }
    ];
    
    servicesMenu = [
      { title: content[lang].catering, href: "/services/catering" },
      { title: content[lang].store, href: "/services/store" }
    ];
  });
  
  // Open dropdown immediately on hover
  function openDropdown(menu) {
    clearTimeout(dropdownTimeout);
    activeDropdown = menu;
    hoveredDropdown = menu;
  }
  
  // Close dropdown with slight delay
  function closeDropdown(menu) {
    if (hoveredDropdown === menu) {
      dropdownTimeout = setTimeout(() => {
        if (hoveredDropdown === menu) {
          activeDropdown = null;
          hoveredDropdown = null;
        }
      }, 150);
    }
  }
  
  // Cancel closing if re-entering any dropdown area
  function cancelClose() {
    clearTimeout(dropdownTimeout);
  }
  
  // Toggle language function
  function toggleLanguage() {
    currentLang.update(lang => lang === 'en' ? 'zh' : 'en');
  }
  
  onMount(() => {
    const handleScroll = () => {
      scrolled = window.scrollY > 20;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<div class="navbar bg-base-100 shadow-sm fixed top-0 z-50 transition-all duration-300 {scrolled ? 'py-2 bg-opacity-95' : 'py-4'}">
  <div class="flex-1">
    <a href="/" class="btn btn-ghost text-3xl text-primary">{$currentLang === 'en' ? content.en.websiteName : content.zh.websiteName}</a>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal px-1 gap-1">
      
      <!-- Galleries Dropdown -->
      <li>
        <div 
          class="dropdown-container relative py-2 px-3 rounded-lg transition-colors {activeDropdown === 'galleries' ? 'bg-base-200' : ''}"
          on:mouseenter={() => openDropdown('galleries')}
          on:mouseleave={() => closeDropdown('galleries')}>
          <a class="text-primary cursor-pointer text-xl">
            {$currentLang === 'en' ? content.en.galleries : content.zh.galleries}
          </a>
          
          {#if activeDropdown === 'galleries'}
            <div 
              class="dropdown-menu bg-base-100 rounded-box p-2 z-50 shadow-lg border border-base-300"
              on:mouseenter={cancelClose}
              on:mouseleave={() => closeDropdown('galleries')}>
              {#each galleriesMenu as item}
                <a href={item.href} class="dropdown-item text-primary hover:bg-primary/10 block px-4 py-2 rounded-md transition-colors">{item.title}</a>
              {/each}
            </div>
          {/if}
        </div>
      </li>
      
      <!-- Services Dropdown -->
      <li>
        <div 
          class="dropdown-container relative py-2 px-3 rounded-lg transition-colors {activeDropdown === 'services' ? 'bg-base-200' : ''}"
          on:mouseenter={() => openDropdown('services')}
          on:mouseleave={() => closeDropdown('services')}>
          <a class="text-primary cursor-pointer text-xl">
            {$currentLang === 'en' ? content.en.services : content.zh.services}
          </a>
          
          {#if activeDropdown === 'services'}
            <div 
              class="dropdown-menu bg-base-100 rounded-box p-2 z-50 shadow-lg border border-base-300"
              on:mouseenter={cancelClose}
              on:mouseleave={() => closeDropdown('services')}>
              {#each servicesMenu as item}
                <a href={item.href} class="dropdown-item text-primary hover:bg-primary/10 block px-4 py-2 rounded-md transition-colors">{item.title}</a>
              {/each}
            </div>
          {/if}
        </div>
      </li>
      
      <!-- About Dropdown -->
      <li>
        <div 
          class="dropdown-container relative py-2 px-3 rounded-lg transition-colors {activeDropdown === 'about' ? 'bg-base-200' : ''}"
          on:mouseenter={() => openDropdown('about')}
          on:mouseleave={() => closeDropdown('about')}>
          <a class="text-primary cursor-pointer text-xl">
            {$currentLang === 'en' ? content.en.about : content.zh.about}
          </a>
          
          {#if activeDropdown === 'about'}
            <div 
              class="dropdown-menu bg-base-100 rounded-box p-2 z-50 shadow-lg border border-base-300"
              on:mouseenter={cancelClose}
              on:mouseleave={() => closeDropdown('about')}>
              {#each aboutMenu as item}
                <a href={item.href} class="dropdown-item text-primary hover:bg-primary/10 block px-4 py-2 rounded-md transition-colors">{item.title}</a>
              {/each}
            </div>
          {/if}
        </div>
      </li>
      
      <!-- Contact Button -->
      <li>
        <a class="btn btn-primary ml-2" href="/booking/">
          {$currentLang === 'en' ? content.en.bookNow : content.zh.bookNow}
        </a>
      </li>
    </ul>
  </div>
  <div class="ml-6">
    <!-- Language Control -->
    <label class="label text-primary text-xs cursor-pointer">
      <span class="label-text mr-2">
        {$currentLang === 'en' ? content.en.toggleLabel : content.zh.toggleLabel}
      </span> 
      <input type="checkbox" class="toggle toggle-primary" on:change={toggleLanguage} checked={$currentLang === 'zh'}/>
    </label>
  </div>
</div>

<style>
  .navbar {
    padding: 0 5%;
    transition: all 0.3s ease;
    backdrop-filter: blur(8px);
  }
  
  .dropdown-container {
    display: flex;
    align-items: center;
  }
  
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 200px;
    animation: fadeIn 0.15s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>