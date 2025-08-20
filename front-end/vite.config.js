// import { sveltekit } from '@sveltejs/kit/vite';

// /** @type {import('vite').UserConfig} */
// const config = {
//   plugins: [sveltekit()],
//   build: {
//     target: 'esnext'
//   }
// };

// export default config;


import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [
		tailwindcss(), // Add this line
		sveltekit()
	]
});