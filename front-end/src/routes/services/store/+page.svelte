<script>
  import { onMount } from 'svelte';
  import { 
    storeClothesImages, 
    storeClothesLabels, 
    storeClothesPrices,
    storeAccImages,
    storeAccLabels, 
    storeAccPrices 
  } from '../../../lib/utils/images.js';
  
  // Generate clothing items
  const clothingItems = storeClothesImages.map((image, index) => {
    const name = storeClothesLabels[index] || `Clothing Item ${index + 1}`;
    const price = storeClothesPrices[index] ? parseFloat(storeClothesPrices[index]) : (24.99 + index);
    const imagePath = `/assets/store/clothes/${image}`;
    
    return {
      id: index + 200, // Different ID range for clothing
      name: name,
      price: price,
      image: imagePath,
      category: 'clothing'
    };
  });
  
  // Generate accessory items
  const accessoryItems = storeAccImages.map((image, index) => {
    const name = storeAccLabels[index] || `Accessory Item ${index + 1}`;
    const price = storeAccPrices[index] ? parseFloat(storeAccPrices[index]) : (14.99 + index);
    const imagePath = `/assets/store/accessories/${image}`;
    
    return {
      id: index + 300, // Different ID range for accessories
      name: name,
      price: price,
      image: imagePath,
      category: 'accessories'
    };
  });
  
  // Add placeholders if needed
  const itemsPerSection = 4;
  
  // if (clothingItems.length < itemsPerSection) {
  //   for (let i = clothingItems.length; i < itemsPerSection; i++) {
  //     clothingItems.push({
  //       id: i + 200,
  //       name: `Premium Apparel ${i + 1}`,
  //       price: 29.99 + i,
  //       image: "/assets/store/clothes/placeholder.jpg",
  //       category: 'clothing'
  //     });
  //   }
  // }
  
  // if (accessoryItems.length < itemsPerSection) {
  //   for (let i = accessoryItems.length; i < itemsPerSection; i++) {
  //     accessoryItems.push({
  //       id: i + 300,
  //       name: `Photo Accessory ${i + 1}`,
  //       price: 19.99 + i,
  //       image: "/assets/store/accessories/placeholder.jpg",
  //       category: 'accessories'
  //     });
  //   }
  // }
  
  // Cart functionality (same as before)
  let cart = [];
  let showCart = false;
  
  function addToCart(item) {
    const existingItem = cart.find(i => i.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
      cart = [...cart];
    } else {
      cart = [...cart, { ...item, quantity: 1 }];
    }
    
    if (cart.length === 1) {
      showCart = true;
    }
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
</script>

<div class="container mx-auto px-4 py-8">
  <!-- Header -->
  <div class="text-center mb-12">
    <h1 class="text-4xl font-bold text-primary mb-4">Helen's Online Outlet</h1>
    <p class="text-xl text-gray-300">Clothing and Accessories</p>
    <p class="mt-2 text-lg text-gray-300">Shipping calculated at checkout • 30-day returns</p>
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
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {#each clothingItems as item}
            <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-primary/20">
              <figure class="h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </figure>
              <div class="card-body p-5 bg-white rounded-b-2xl">
                <div class="flex justify-between items-start mb-3">
                  <h2 class="card-title text-primary">{item.name}</h2>
                  <span class="text-xl font-bold text-primary">${item.price.toFixed(2)}</span>
                </div>
                <div class="card-actions justify-end">
                  <button 
                    class="btn btn-primary text-info"
                    on:click={() => addToCart(item)}
                  >
                    Add to Cart
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
          {#each accessoryItems as item}
            <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-primary/20">
              <figure class="h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </figure>
              <div class="card-body p-5 bg-white rounded-b-2xl">
                <div class="flex justify-between items-start mb-3">
                  <h2 class="card-title text-primary">{item.name}</h2>
                  <span class="text-xl font-bold text-primary">${item.price.toFixed(2)}</span>
                </div>
                <div class="card-actions justify-end">
                  <button 
                    class="btn btn-primary text-info"
                    on:click={() => addToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </section>
    </div>
    
    <!-- Cart Sidebar (unchanged) -->
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
                  
                  <!-- Shipping Progress -->
                  {#if total < 50}
                    <div class="bg-warning/10 p-3 rounded-lg mb-3">
                      <p class="text-sm text-center">
                        Add <span class="font-bold">${(50 - total).toFixed(2)}</span> more for free shipping!
                      </p>
                    </div>
                  {:else}
                    <div class="bg-success/10 p-3 rounded-lg mb-3">
                      <p class="text-sm text-center text-success font-bold">
                        🎉 You qualify for free shipping!
                      </p>
                    </div>
                  {/if}
                  
                  <button class="btn btn-primary w-full mb-3 text-info">
                    Proceed to Checkout
                  </button>
                  
                  <p class="text-xs text-gray-500 text-center">
                    30-day money-back guarantee • Secure checkout
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