// src/stores/appStore.js
import { writable } from 'svelte/store';

// Initialize with a default value
export const globalString = writable('Hello World');
export const websiteName = writable('Helen\'s Studio');
export const siteOwner= writable('Helen Xue');