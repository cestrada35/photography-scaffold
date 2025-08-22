import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.js',
      precompress: false
    }),
    paths: {
      base: dev ? '' : '' // Replacing with empty string for live site setup
      // base: dev ? '' : '/photography-scaffold'
    },
    alias: {
      $stores: 'src/lib/stores'
    }
  }
};

export default config;