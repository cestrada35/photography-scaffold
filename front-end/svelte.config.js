import adapter from '@sveltejs/adapter-node'; // ✅ Changed from adapter-static
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(), // ✅ Simplified adapter config
    paths: {
      base: dev ? '' : ''
    },
    alias: {
      $stores: 'src/lib/stores'
    }
  }
};

export default config;