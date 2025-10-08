<script>
  import { onMount } from 'svelte';
  import { storeProducts } from '../../../lib/utils/images.js';
  
  // State management
  let selectedProduct = null;
  let showCart = false;
  let cart = [];
  let selectedOptions = {};
  let currentImageIndex = 0;
  
  // Group products by category
  const clothingProducts = storeProducts.filter(p => p.category === 'clothing');
  const accessoryProducts = storeProducts.filter(p => p.category === 'accessories');
  
  // Product selection and modal
  function openProductModal(product) {
    selectedProduct = product;
    selectedOptions = {};
    currentImageIndex = 0;
    
    // Initialize selected options with first available option for each variant
    product.variants.forEach(variant => {
      if (variant.type === 'size-color' || variant.type === 'size') {
        selectedOptions.size = variant.options.size[0];
      }
      if (variant.type === 'size-color' || variant.type === 'model-color') {
        const colorKey = variant.type === 'size-color' ? 'color' : 'color';
        selectedOptions[colorKey] = variant.options[colorKey][0];
      }
      if (variant.type === 'model-color') {
        selectedOptions.model = variant.options.model[0];
      }
      if (variant.type === 'design') {
        selectedOptions.design = variant.options.design[0];
      }
    });
  }
  
  function closeProductModal() {
    selectedProduct = null;
    selectedOptions = {};
  }
  
  // Image carousel functions
  function nextImage() {
    if (selectedProduct) {
      currentImageIndex = (currentImageIndex + 1) % selectedProduct.images.length;
    }
  }
  
  function prevImage() {
    if (selectedProduct) {
      currentImageIndex = (currentImageIndex - 1 + selectedProduct.images.length) % selectedProduct.images.length;
    }
  }
  
  function selectImage(index) {
    currentImageIndex = index;
  }
  
  // Check if all required options are selected
  function areAllOptionsSelected() {
    if (!selectedProduct) return false;
    
    const requiredOptions = [];
    selectedProduct.variants.forEach(variant => {
      if (variant.type === 'size-color') {
        requiredOptions.push('size', 'color');
      } else if (variant.type === 'size') {
        requiredOptions.push('size');
      } else if (variant.type === 'model-color') {
        requiredOptions.push('model', 'color');
      } else if (variant.type === 'design') {
        requiredOptions.push('design');
      }
    });
    
    return requiredOptions.every(option => selectedOptions[option]);
  }
  
  // Cart functionality
  function addToCart() {
    if (!selectedProduct || !areAllOptionsSelected()) return;
    
    const cartItem = {
      id: `${selectedProduct.id}-${JSON.stringify(selectedOptions)}`,
      productId: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.basePrice,
      options: { ...selectedOptions },
      image: `/assets/store/${selectedProduct.category}/${selectedProduct.images[0]}`
    };
    
    const existingItem = cart.find(item => item.id === cartItem.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
      cart = [...cart];
    } else {
      cart = [...cart, { ...cartItem, quantity: 1 }];
    }
    
    showCart = true;
    closeProductModal();
  }
  
  function removeFromCart(itemId) {
    const existingItem = cart.find(i => i.id === itemId);
    
    if (existingItem && existingItem.quantity > 1) {
      existingItem.quantity -= 1;
      cart = [...cart];
    } else {
      cart = cart.filter(item => item.id !== itemId);
    }
    
    if (cart.length === 0) {
      showCart = false;
    }
  }
  
  $: total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  $: totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  $: canAddToCart = selectedProduct ? areAllOptionsSelected() : false;
</script>

<div class="container mx-auto px-4 py-8">
  <!-- Header -->
  <div class="text-center mb-12">
    <h1 class="text-4xl font-bold text-primary mb-4">Helen's Online Outlet</h1>
    <p class="text-xl text-gray-300">Clothing and Accessories</p>
    <p class="mt-2 text-lg text-gray-300">Shipping calculated at checkout • 30-day returns</p>
    <p class="mt-2 text-lg text-gray-300">Thank you for supporting my business!</p>
  </div>
  
  <!-- Main content -->
  <div class="flex flex-col lg:flex-row gap-8">
    <!-- Store Items Grid -->
    <div class="w-full lg:w-2/3">
      <!-- Clothing Section -->
      <section class="mb-12">
        <div class="flex items-center mb-6">
          <div class="flex-1 h-px bg-primary/30"></div>
          <h2 class="text-3xl font-bold text-primary mx-6">Clothing</h2>
          <div class="flex-1 h-px bg-primary/30"></div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          {#each clothingProducts as product}
            <div 
              class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-primary/20 cursor-pointer"
              on:click={() => openProductModal(product)}
            >
              <figure class="h-64 overflow-hidden">
                <img 
                  src={`/assets/store/clothing/${product.images[0]}`} 
                  alt={product.name}
                  class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </figure>
              <div class="card-body p-5 bg-white rounded-b-2xl">
                <div class="flex justify-between items-start mb-2">
                  <h2 class="card-title text-primary">{product.name}</h2>
                  <span class="text-xl font-bold text-primary">${product.basePrice.toFixed(2)}</span>
                </div>
                <p class="text-sm text-gray-600 mb-3 leading-relaxed">
                  {product.description}
                </p>
                <div class="flex flex-wrap gap-1 mb-3">
                  {#each product.images.slice(0, 3) as _, index}
                    <div class="w-2 h-2 rounded-full bg-primary/40"></div>
                  {/each}
                  {#if product.images.length > 3}
                    <div class="text-xs text-gray-500">+{product.images.length - 3} more</div>
                  {/if}
                </div>
                <div class="card-actions justify-end">
                  <button class="btn btn-primary text-info">
                    View Options
                  </button>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </section>
      
      <!-- Accessories Section -->
      <section class="mb-12">
        <div class="flex items-center mb-6">
          <div class="flex-1 h-px bg-primary/30"></div>
          <h2 class="text-3xl font-bold text-primary mx-6">Accessories</h2>
          <div class="flex-1 h-px bg-primary/30"></div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {#each accessoryProducts as product}
            <div 
              class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-primary/20 cursor-pointer"
              on:click={() => openProductModal(product)}
            >
              <figure class="h-48 overflow-hidden">
                <img 
                  src={`/assets/store/accessories/${product.images[0]}`} 
                  alt={product.name}
                  class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </figure>
              <div class="card-body p-5 bg-white rounded-b-2xl">
                <div class="flex justify-between items-start mb-2">
                  <h2 class="card-title text-primary">{product.name}</h2>
                  <span class="text-xl font-bold text-primary">${product.basePrice.toFixed(2)}</span>
                </div>
                <p class="text-sm text-gray-600 mb-3 leading-relaxed">
                  {product.description}
                </p>
                <div class="flex flex-wrap gap-1 mb-3">
                  {#each product.images.slice(0, 3) as _, index}
                    <div class="w-2 h-2 rounded-full bg-primary/40"></div>
                  {/each}
                  {#if product.images.length > 3}
                    <div class="text-xs text-gray-500">+{product.images.length - 3} more</div>
                  {/if}
                </div>
                <div class="card-actions justify-end">
                  <button class="btn btn-primary text-info">
                    View Options
                  </button>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </section>
    </div>
    
    <!-- Cart Sidebar -->
    <div class="w-full lg:w-1/3">
      <div class="sticky top-4">
        {#if showCart}
          <div class="card bg-base-100 shadow-xl border border-primary/20 bg-white">
            <div class="card-body">
              <h2 class="card-title text-primary border-b pb-2">Your Cart ({totalItems} items)</h2>
              
              {#if cart.length > 0}
                <div class="max-h-96 overflow-y-auto">
                  {#each cart as item}
                    <div class="flex items-center justify-between py-3 border-b">
                      <div class="flex items-center gap-3">
                        <button 
                          class="btn btn-xs btn-circle btn-outline"
                          on:click={() => removeFromCart(item.id)}
                        >
                          -
                        </button>
                        <span class="font-medium">{item.quantity}x</span>
                        <div>
                          <p class="font-medium">{item.name}</p>
                          <p class="text-sm text-gray-500">
                            {#each Object.entries(item.options) as [key, value]}
                            <p>
                              {key}: {value}
                            </p>
                            {/each}
                          </p>
                          <p class="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                      <span class="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  {/each}
                </div>
                
                <div class="border-t pt-4 mt-2">
                  <div class="flex justify-between text-lg font-bold mb-4">
                    <span>Total:</span>
                    <span class="text-primary">${total.toFixed(2)}</span>
                  </div>
                  
                  <p class="text-center text-primary font-bold">
                    Text to confirm your order:
                  </p>
                  <p class="text-center text-2xl font-bold text-primary mt-2">
                    626-487-9145
                  </p>
                  
                  <p class="text-xs text-gray-500 text-center">
                    30-day money-back guarantee
                  </p>
                </div>
                {:else}
                <p class="text-center py-8 text-gray-500">Your cart is empty</p>
              {/if}
            </div>
          </div>
        {:else}
          <div class="card bg-white shadow-xl border border-primary/10">
            <div class="card-body text-center">
              <h2 class="card-title text-primary justify-center">Your Cart</h2>
              <p class="text-gray-500">Add items to cart to get started!</p>
              <div class="mt-4 text-4xl">📸</div>
              <div class="mt-4 p-4 bg-primary/5 rounded-lg">
                <p class="text-sm text-primary font-bold">Shipping calculated by weight</p>
                <p class="text-xs text-gray-600 mt-1">Add items to calculate price</p>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<!-- Product Modal -->
<!-- Product Modal -->
{#if selectedProduct}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      <div class="flex flex-col lg:flex-row h-full">
        <!-- Image Carousel -->
        <div class="lg:w-1/2 p-6">
          <div class="relative">
            <!-- Main Image -->
            <div class="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img 
                src={`/assets/store/${selectedProduct.category}/${selectedProduct.images[currentImageIndex]}`}
                alt={selectedProduct.name}
                class="w-full h-full object-cover"
              />
            </div>
            
            <!-- Navigation Arrows -->
            {#if selectedProduct.images.length > 1}
              <button 
                class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                on:click={prevImage}
              >
                ←
              </button>
              <button 
                class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                on:click={nextImage}
              >
                →
              </button>
            {/if}
            
            <!-- Thumbnail Strip -->
            {#if selectedProduct.images.length > 1}
              <div class="flex gap-2 mt-4 overflow-x-auto">
                {#each selectedProduct.images as image, index}
                  <button 
                    class={`flex-shrink-0 w-16 h-16 rounded border-2 ${index === currentImageIndex ? 'border-primary' : 'border-gray-300'}`}
                    on:click={() => selectImage(index)}
                  >
                    <img 
                      src={`/assets/store/${selectedProduct.category}/${image}`}
                      alt={`${selectedProduct.name} view ${index + 1}`}
                      class="w-full h-full object-cover rounded"
                    />
                  </button>
                {/each}
              </div>
            {/if}
          </div>
        </div>
        
        <!-- Product Details -->
        <div class="lg:w-1/2 p-6 flex flex-col">
          <div class="flex-1">
            <div class="flex justify-between items-start mb-4">
              <h2 class="text-2xl font-bold text-primary">{selectedProduct.name}</h2>
              <button 
                class="text-gray-500 hover:text-gray-700 text-2xl"
                on:click={closeProductModal}
              >
                ×
              </button>
            </div>
            
            <p class="text-3xl font-bold text-primary mb-4">${selectedProduct.basePrice.toFixed(2)}</p>
            <p class="text-gray-600 mb-6">{selectedProduct.description}</p>
            
            <!-- Variant Options -->
            <div class="space-y-6">
              {#each selectedProduct.variants as variant}
                {#if variant.type === 'size-color'}
                  <!-- Size Selection -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Size</label>
                    <div class="flex flex-wrap gap-2">
                      {#each variant.options.size as sizeOption}
                        <button
                          class={`px-4 py-2 border rounded-lg font-medium ${
                            selectedOptions.size === sizeOption 
                              ? 'border-primary bg-primary text-primary' 
                              : 'border-gray-300 text-gray-700 hover:border-primary'
                          }`}
                          on:click={() => selectedOptions.size = sizeOption}
                        >
                          {sizeOption}
                        </button>
                      {/each}
                    </div>
                  </div>
                  
                  <!-- Color Selection -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Color</label>
                    <div class="flex flex-wrap gap-2">
                      {#each variant.options.color as colorOption}
                        <button
                          class={`px-4 py-2 border rounded-lg font-medium ${
                            selectedOptions.color === colorOption 
                              ? 'border-primary bg-primary text-primary' 
                              : 'border-gray-300 text-gray-700 hover:border-primary'
                          }`}
                          on:click={() => selectedOptions.color = colorOption}
                        >
                          {colorOption}
                        </button>
                      {/each}
                    </div>
                  </div>
                {:else if variant.type === 'size'}
                  <!-- Size Only -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Size</label>
                    <div class="flex flex-wrap gap-2">
                      {#each variant.options.size as sizeOption}
                        <button
                          class={`px-4 py-2 border rounded-lg font-medium ${
                            selectedOptions.size === sizeOption 
                              ? 'border-primary bg-primary text-primary' 
                              : 'border-gray-300 text-gray-700 hover:border-primary'
                          }`}
                          on:click={() => selectedOptions.size = sizeOption}
                        >
                          {sizeOption}
                        </button>
                      {/each}
                    </div>
                  </div>
                {:else if variant.type === 'model-color'}
                  <!-- Model Selection -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Phone Model</label>
                    <select 
                      class="w-full p-2 border border-gray-300 rounded-lg text-gray-700"
                      bind:value={selectedOptions.model}
                    >
                      {#each variant.options.model as modelOption}
                        <option value={modelOption}>{modelOption}</option>
                      {/each}
                    </select>
                  </div>
                  
                  <!-- Color Selection -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Color</label>
                    <div class="flex flex-wrap gap-2">
                      {#each variant.options.color as colorOption}
                        <button
                          class={`px-4 py-2 border rounded-lg font-medium ${
                            selectedOptions.color === colorOption 
                              ? 'border-primary bg-primary text-primary' 
                              : 'border-gray-300 text-gray-700 hover:border-primary'
                          }`}
                          on:click={() => selectedOptions.color = colorOption}
                        >
                          {colorOption}
                        </button>
                      {/each}
                    </div>
                  </div>
                {:else if variant.type === 'design'}
                  <!-- Design Selection -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Design</label>
                    <select 
                      class="w-full p-2 border border-gray-300 rounded-lg text-gray-700"
                      bind:value={selectedOptions.design}
                    >
                      {#each variant.options.design as designOption}
                        <option value={designOption}>{designOption}</option>
                      {/each}
                    </select>
                  </div>
                {/if}
              {/each}
            </div>
          </div>
          
          <!-- Add to Cart Button -->
          <div class="mt-6">
            <button
              class="w-full bg-primary text-primary py-3 px-6 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
              disabled={!canAddToCart}
              on:click={addToCart}
            >
              {#if canAddToCart}
                Add to Cart - ${selectedProduct.basePrice.toFixed(2)}
              {:else}
                Select Options
              {/if}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .container {
    max-width: 1200px;
  }
  
  .card {
    transition: all 0.3s ease;
  }
  
  .overflow-y-auto::-webkit-scrollbar {
    width: 6px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style>