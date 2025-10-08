<script>
  import { onMount } from 'svelte';
  import { foodImages, foodLabels, foodPrices, foodDescriptions } from '../../../lib/utils/images.js';
  
  // Generate food items dynamically from the imported arrays
  const foodItems = foodImages.map((image, index) => {
    // Use placeholder data if arrays are shorter than expected
    const name = foodLabels[index] || `Food Item ${index + 1}`;
    const price = foodPrices[index] ? parseFloat(foodPrices[index]) : (9.99 + index);
    const description = foodDescriptions[index] || 'Delicious item made with fresh ingredients';
    const imagePath = `/assets/foods/${image}`;
    
    return {
      id: index + 1,
      name: name,
      price: price,
      description: description,
      image: imagePath
    };
  });
  
  // Add placeholder items if needed to maintain the 6-item layout
  const totalItemsNeeded = 6;
  if (foodItems.length < totalItemsNeeded) {
    for (let i = foodItems.length; i < totalItemsNeeded; i++) {
      foodItems.push({
        id: i + 1,
        name: `Special Item ${i + 1}`,
        price: 12.99 + i,
        description: 'A special creation from our kitchen',
        image: "/assets/foods/placeholder.jpg"
      });
    }
  }
  
  // Cart functionality
  let cart = [];
  let showCart = false;
  
  // Add item to cart
  function addToCart(item) {
    const existingItem = cart.find(i => i.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
      cart = [...cart]; // Trigger reactivity
    } else {
      cart = [...cart, { ...item, quantity: 1 }];
    }
    
    // Show cart when adding first item
    if (cart.length === 1) {
      showCart = true;
    }
  }
  
  // Remove item from cart
  function removeFromCart(itemId) {
    const existingItem = cart.find(i => i.id === itemId);
    
    if (existingItem && existingItem.quantity > 1) {
      existingItem.quantity -= 1;
      cart = [...cart]; // Trigger reactivity
    } else {
      cart = cart.filter(item => item.id !== itemId);
    }
    
    // Hide cart when empty
    if (cart.length === 0) {
      showCart = false;
    }
  }
  
  // Calculate total
  $: total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  $: totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
</script>

<div class="container mx-auto px-4 py-8">
  <!-- Header -->
  <div class="text-center mb-12">
    <h1 class="text-4xl font-bold text-primary mb-4">Helen's Studio Kitchen</h1>
    <p class="text-xl text-gray-300">Select your favorites and place your order</p>
    <p class="mt-2 text-lg text-gray-300">Text or Call to place your order or deliver within 5 miles of the Torrance area</p>
    <p class="mt-2 text-lg text-gray-300">Thank you for supporting my business!</p>
  </div>
  
  <!-- Main content -->
  <div class="flex flex-col lg:flex-row gap-8">
    <!-- Food Items Grid -->
    <div class="w-full lg:w-2/3">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each foodItems as item}
          <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1  border border-primary/20">
            <figure class="h-48 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name}
                class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </figure>
            <div class="card-body p-5 bg-white rounded-b-2xl">
              <div class="flex justify-between items-start mb-2">
                <h2 class="card-title text-primary">{item.name}</h2>
                <span class="text-xl font-bold text-primary">${item.price.toFixed(2)}</span>
              </div>
              <!-- Added description here -->
              <p class="text-sm text-gray-600 mb-3 leading-relaxed">
                {item.description}
              </p>
              <div class="card-actions justify-end">
                <button 
                  class="btn btn-primary text-info"
                  on:click={() => addToCart(item)}
                >
                  Add to Order
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
    
    <!-- Cart Sidebar -->
    <div class="w-full lg:w-1/3">
      <div class="sticky top-4">
        {#if showCart}
          <div class="card bg-base-100 shadow-xl border border-primary/20 bg-white">
            <div class="card-body">
              <h2 class="card-title text-primary border-b pb-2">Your Order</h2>
              <p class="text-gray-500 mb-1px">Delivery costs will vary based on location</p>
              <p class="text-gray-500 mt-1px">(Text preferred)</p>
              
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
                    <span>Estimated Total:</span>
                    <span class="text-primary">${total.toFixed(2)}</span>
                  </div>
                  
                  <div class="bg-primary/10 p-4 rounded-lg mb-4">
                    <p class="text-center text-primary font-bold">
                      Text to confirm your order:
                    </p>
                    <p class="text-center text-2xl font-bold text-primary mt-2">
                      626-487-9145
                    </p>
                  </div>
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
              <p class="text-gray-500 mb-1px">Delivery costs will vary based on location</p>
              <p class="text-gray-500 mt-1px">(Text preferred)</p>
              <p class="text-gray-500">Add items from the menu to get started</p>
              <div class="mt-4 text-4xl">🛒</div>
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
  
  /* Custom animations */
  .card {
    transition: all 0.3s ease;
  }
  
  /* Scrollbar styling for cart */
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