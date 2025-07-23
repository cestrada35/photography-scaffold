<script>
  export let src;
  export let alt;
</script>

<div class="image-container">
  <img {src} {alt} class="gallery-image" />
  <div class="overlay">
    <div class="overlay-content">
      <slot />
    </div>
  </div>
</div>

<style>
  .image-container {
    position: relative;
    overflow: hidden;
    height: 100%;
    width: 100%;
  }

  .gallery-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    opacity: 0;
    transition: opacity 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .overlay-content {
    color: white;
    text-align: center;
    padding: 20px;
  }

  .image-container:hover .gallery-image {
    transform: scale(1.05);
  }

  .image-container:hover .overlay {
    opacity: 1;
  }
</style>