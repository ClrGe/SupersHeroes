import { writable } from 'svelte/store';

export const activeListItem = writable(0);
export const activeMapItem = writable(0);

export const Events = writable({})
export const Heroes = writable({})
