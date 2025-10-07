import { derived } from 'svelte/store';
import { currentLang } from '$stores/languageStore.js'; // Import from the shared store
import translations from '$lib/utils/translation.json';

// Create a derived store that provides translation functions
export const t = derived(currentLang, ($currentLang) => {
  return (key, params = {}) => {
    // Split keys like "home.featuredWork"
    const keys = key.split('.');
    let value = translations[$currentLang];
    
    // Navigate through the nested keys
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key; // Fallback to the key itself
      }
    }
    
    // Replace parameters in the string
    if (typeof value === 'string') {
      return value.replace(/{(\w+)}/g, (match, param) => {
        return params[param] !== undefined ? params[param] : match;
      });
    }
    
    return value;
  };
});