<script lang="ts">
	import {toggleSideMenu} from '$stores/menus'
	import {onMount} from "svelte";
	import mapboxgl from "mapbox-gl/dist/mapbox-gl";
	import MapboxGeocoder from "mapbox-gl-geocoder/lib";

	export let user: any
    let withSearch = true
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2xhaXJnZSIsImEiOiJjbGdxNmtiNTkwNmRmM2pzM3drbnA5a3h5In0.akdkLqiIt0WArmknZwTNCw';
    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        types: 'country,region,place,postcode,locality,neighborhood'
    });
    onMount(async () => {
        geocoder.addTo('#geocoder');

        // Get the geocoder results container.
        const results = document.getElementById('result');

        // Add geocoder result to container.
        geocoder.on('result', (e) => {
            results.innerText = JSON.stringify(e.result, null, 2);
        });

        // Clear results container when search is cleared.
        geocoder.on('clear', () => {
            results.innerText = '';
        });
    });
</script>

<header class="z-10 py-4 bg-white shadow-md dark:bg-gray-800">
    <div
            class="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300"
    >
        <!-- Mobile hamburger -->
        <button
                aria-label="Menu"
                class="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
                id="nav-mobile-hamburger"
                on:click={toggleSideMenu}
        >
            <svg aria-hidden="true" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                        clip-rule="evenodd"
                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        fill-rule="evenodd"
                />
            </svg>
        </button>

        {#if withSearch}
            <!-- Search input -->
<!--            <div class="flex justify-center flex-1 lg:mr-32">-->
<!--                <div class="relative w-full max-w-xl mr-6 focus-within:text-purple-500">-->
<!--                    <div class="absolute inset-y-0 flex items-center pl-2">-->
<!--                        <svg class="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">-->
<!--                            <path-->
<!--                                    fill-rule="evenodd"-->
<!--                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"-->
<!--                                    clip-rule="evenodd"-->
<!--                            />-->
<!--                        </svg>-->
<!--                    </div>-->
<!--                    <input-->
<!--                            class="w-full pl-8 pr-2 py-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input"-->
<!--                            type="text"-->
<!--                            placeholder="Chercher une adresse / ville / localité..."-->
<!--                            aria-label="Search"-->
<!--                    />-->
<!--                </div>-->
<!--            </div>-->
        {/if}

    </div>
</header>
