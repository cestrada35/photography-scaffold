import { writable } from 'svelte/store';

// Create the language store here instead of in Navbar
export const currentLang = writable('en');