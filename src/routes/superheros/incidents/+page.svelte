<style>
    .container {
        height: 100vh;
        display: flex;
    }

    .pane {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 80vw;
    }

    .left {
        align-items: center;
        justify-content: center;
    }

    .right {
        justify-content: center;
        width: 100%;
    }

    /* media queries */

    @media (max-width: 768px) {
        .container {
            flex-direction: column;
        }

        .pane {
            width: 100vw;
        }

        .right {
            width: 100%;
            display: none;
        }

        .left {
            width: 100%;
        }


    }
</style>

<script>
    import List from '$lib/components/List.svelte';
    import Map from '$lib/components/Map.svelte';
    import {Button, Modal, Radio} from "flowbite-svelte";
    import {onMount} from "svelte";
    import {Events} from "$stores/stores.js";
    import MapboxGeocoder from "mapbox-gl-geocoder";
    import mapboxgl from "mapbox-gl";

    let formModal = false;
    let name;
    let email;
    let data = [];
    let dataHero = [];
    let group;

    let lat = [];
    let lng = [];
    let latHero = [];
    let longHero = [];

    let formEvent = {
        "incidentId": group,
        "heroId": 1,
        "longitude": -74.0060152,
        "latitude": 40.7127281,
        "status": "pending",
    }
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2xhaXJnZSIsImEiOiJjbGdxNmtiNTkwNmRmM2pzM3drbnA5a3h5In0.akdkLqiIt0WArmknZwTNCw';
    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        types: 'country,region,place,postcode,locality,neighborhood'
    });

    onMount(async () => {
        const response = await fetch('http://localhost:5039/api/event');
        data = await response.json();
        console.log(data);
        // for each event in the database, push the latitude and longitude to the lat and lng arrays
        data.forEach((event) => {
            lat.push(event.latitude);
            lng.push(event.longitude);
        });

        const resHero = await fetch('http://localhost:5039/api/hero');
        dataHero = await resHero.json();

        // for each event in the database, push the latitude and longitude to the lat and lng arrays
        dataHero.forEach((hero) => {
            latHero.push(hero.latitude);
            longHero.push(hero.longitude);
        });

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

    async function submitForm(){
        // retrieve the value of "group" bound to radio buttons and assign it to the formEvent object incidentId property
        formEvent.incidentId = group;
        try {
            const response = await fetch('http://localhost:5039/api/event/add', {
                method: 'POST',
                headers: {
                    'Allow-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formEvent)
            });
            console.log(data);
        } catch (e) {
            console.log(e);
        }
    }
</script>
<main class="h-full overflow-y-auto">
    <div class="container md: ">
        <!-- Modal to be populated on click -->
        <Modal autoclose={false} bind:open={formModal} class="w-full" id="form-modal" size="xs">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <button aria-label="Close" class="close" data-dismiss="modal" type="button"><span
                                aria-hidden="true"></span></button>
                        <h2 class="" id="marker_title"></h2>
                        <img class="" id="marker_image" src=""/>
                        <p class="" id="marker_latlng"></p>
                        <address class="" id="marker_address"></address>
                        <p class="" id="marker_content"></p>
                    </div>
                </div>
            </div>
        </Modal>
        <!-- Modal toggle -->
        <div class="flex flex-col align-center mx-auto">
            <Button class="!bg-red-400 w-full !text-black " on:click={() => formModal = true}>Signaler un incident</Button>

            <Button class="!bg-green-400 w-1/3 px-4 py-2 my-3 mr-3 font-semibold " on:click={() => window.location.reload()}>*</Button>
        </div>
        <div class=" flex flex-col sm:flex-row  ">

            <Modal autoclose={false} bind:open={formModal} class="w-full" id="form-modal" size="xl">
                <!-- Form -->
                <div class="w-full overflow-hidden rounded-lg shadow-xs flex items-center ">
                    <form class="w-full p-5" id="form-event">
                        <div class="flex flex-wrap -mx-3 mb-6">
                            <label class="block uppercase tracking-wide text-gray-700  dark:text-gray-100 text-xs font-bold mb-2">
                                Type d'incident
                            </label>
                            <div>
                                <div class="flex items-center mb-2">
                                    <Radio bind:group class="text-gray-100 mr-2" id="incendies" value={1} >
                                        Incendie
                                    </Radio>
                                </div>
                                <div class="flex items-center mb-2">
                                    <Radio bind:group class="text-gray-100 mr-2" id="route" value={2} >
                                        Accident routier
                                    </Radio>
                                </div>
                                <div class="flex items-center mb-2">
                                    <Radio bind:group class="text-gray-100 mr-2" id="fleuve" value={3} >
                                        Accident fluvial
                                    </Radio>
                                </div>
                                <div class="flex items-center">
                                    <Radio bind:group class="text-gray-100 mr-2" id="air" value={4} >
                                        Accident aérien
                                    </Radio>
                                </div>
                                <div class="flex items-center">
                                    <Radio bind:group class="text-gray-100 mr-2" id="eboulement" value={5}>
                                        Éboulement
                                    </Radio>
                                </div>
                                <div class="flex items-center mb-2">
                                    <Radio bind:group class="text-gray-100 mr-2" id="serpents" value={6} >
                                        Invasion de serpents
                                    </Radio>
                                </div>
                                <div class="flex items-center mb-2">
                                    <Radio bind:group class="text-gray-100 mr-2" id="gaz" value={7} >
                                        Fuite de gaz
                                    </Radio>
                                </div>
                                <div class="flex items-center mb-2">
                                    <Radio bind:group class="text-gray-100 mr-2" id="manifestation" value={8}>
                                        Manifestation
                                    </Radio>
                                </div>
                                <div class="flex items-center">
                                    <Radio bind:group class="text-gray-100 mr-2" id="braquage" value={9} >
                                        Braquage
                                    </Radio>
                                </div>
                                <div class="flex items-center">
                                    <Radio bind:group class="text-gray-100 mr-2" id="evasion" value={10} >
                                        Évasion d'un prisonnier
                                    </Radio>
                                </div>
                            </div>
                        </div>
                        <div class="w-full  mb-12 md:mb-0">
                            <label class="block uppercase tracking-wide text-gray-700  dark:text-gray-100 text-xs font-bold mb-2" for="grid-long">
                                Longitude
                            </label>
                            <input  bind:value="{formEvent.longitude}" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-long"  type="text" required>
                        </div>
                        <div class="w-full mb-12 md:mb-0">
                            <label class="block uppercase tracking-wide text-gray-700  dark:text-gray-100 text-xs font-bold mb-2" for="grid-lat">
                                Latitude
                            </label>
                            <input bind:value="{formEvent.latitude}"
                                   class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                   id="grid-lat"  type="text" required>
                        </div>
                        <button class="w-full" on:click={submitForm} type="submit">Ajouter</button>
                    </form>
                </div>
            </Modal>
            <table class="whitespace-no-wrap">
                <thead>
                    <div class="flex items-center space-between">
                        <tr class="text-xs px-4 font-semibold  text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                            <th class="px-8 py-3">Type d'incident</th>
                            <th class="px-8 py-3">Longitude</th>
                            <th class="px-8 py-3">Latitude</th>
                            <th class="px-6 py-3">Statut</th>
                        </tr>
                    </div>
                </thead>
                <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                {#each data as item (item.id)}
                    <tr class="text-gray-700 dark:text-gray-400">
                        <td class="px-4 py-5">
                            <div class="flex items-center ">
                                <!-- Avatar with inset shadow -->
                                <div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                                    <img
                                            alt=""
                                            class="object-cover w-full h-full rounded-full"
                                            loading="lazy"
                                            src="https://i.pinimg.com/736x/ce/2c/55/ce2c55e441df83f7f1c01479538840b5.jpg"
                                    />
                                    <div aria-hidden="true" class="absolute inset-0 rounded-full shadow-inner"/>
                                </div>
                                <div class="px-4">
                                            {#if item.incidentId === 1}
                                                <span class="px-2 py-1  leading-tight text-red-700 bg-red-100 rounded-full dark:bg-green-700 dark:text-green-100">Incendie</span>
                                            {/if}
                                            {#if item.incidentId === 2}
                                                <span class="px-2 py-1  leading-tight text-amber-700 bg-amber-100 rounded-full dark:bg-green-700 dark:text-green-100">Accident de la route</span>
                                            {/if}
                                            {#if item.incidentId === 3}
                                                <span class="px-2 py-1  leading-tight  text-blue-700 bg-blue-100  rounded-full dark:bg-green-700 dark:text-green-100">Accident fluvial</span>
                                            {/if}
                                            {#if item.incidentId === 4}
                                                <span class="px-2 py-1  leading-tight text-gray-700 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-100">Accidents aériens</span>
                                            {/if}
                                            {#if item.incidentId === 5}
                                                <span class="px-2 py-1  leading-tight text-amber-700 bg-amber-100 rounded-full dark:bg-amber-700 dark:text-amber-100">Éboulement</span>
                                            {/if}
                                            {#if item.incidentId === 6}
                                                <span class="px-2 py-1 leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">Invasion de serpents</span>
                                            {/if}
                                            {#if item.incidentId === 7}
                                                <span class="px-2 py-1 font-semibold leading-tight text-yellow-700 bg-yellow-100 rounded-full dark:bg-yellow-700 dark:text-yellow-100">Fuite de gaz</span>
                                            {/if}
                                            {#if item.incidentId === 8}
                                                <span class="px-2 py-1 font-semibold leading-tight text-red-900 bg-red-100 rounded-full dark:bg-red-700 dark:text-red-100">Manifestation</span>
                                            {/if}
                                            {#if item.incidentId === 9}
                                                <span class="px-2 py-1 font-semibold leading-tight text-purple-700 bg-purple-100 rounded-full dark:bg-purple-700 dark:text-purple-100">Braquage</span>
                                            {/if}
                                            {#if item.incidentId === 10}
                                                <span class="px-2 py-1 font-semibold leading-tight text-indigo-700 bg-indigo-100 rounded-full dark:bg-indigo-700 dark:text-indigo-100">Évasion de prisonniers</span>
                                            {/if}
                                </div>
                                <div>
                                    <p id="lgt" class="px-6 py-3 text-sm">{item.longitude}</p>
                                </div>
                                <div>
                                    <p id="lat" class="px-6 py-3 text-sm">{item.latitude}</p>
                                </div>

                            <span class="px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full dark:bg-green-700 dark:text-green-100">
                                {item.status}
                            </span>
                            </div>
                        </td>
                    </tr>
                {/each}
                </tbody>
            </table>
        </div>

        <!---<List />--->
        <div class="pane right sm:hidden">
            <Map longitude={lng} latitude={lat} latHero={latHero} longHero={longHero} />
        </div>
    </div>
</main>

