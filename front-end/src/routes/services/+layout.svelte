<script>
  import Navbar from '$lib/components/Navbar.svelte';
</script>

<Navbar siteTitle="Jane's Photography" />

<main>
  <slot />
</main>

<style>
  main {
    padding-top: 60px;
  }
</style>