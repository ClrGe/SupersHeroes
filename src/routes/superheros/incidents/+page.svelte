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
    let detailsModal = false;
    let name;
    let email;
    let data = [];
    let dataHero = [];
    let group;

    let lat = [];
    let lng = [];
    let latHero = [];
    let longHero = [];
    let selectedLat;
    let selectedLng;

    let formEvent = {
        "incidentId": group,
        "heroId": 1,
        "longitude": -74.0060152,
        "latitude": 40.7127281,
        "status": "pending",
    }

    mapboxgl.accessToken = 'pk.eyJ1IjoiY2xhaXJnZSIsImEiOiJjbGdxNmtiNTkwNmRmM2pzM3drbnA5a3h5In0.akdkLqiIt0WArmknZwTNCw';
    const calculateDistance = (latitude1, longitude1, latitude2, longitude2) => {
        const earthRadius = 6371; // Radius of the Earth in kilometers
        const lat1Rad = toRadians(latitude1);
        const lat2Rad = toRadians(latitude2);
        const latDiffRad = toRadians(latitude2 - latitude1);
        const lngDiffRad = toRadians(longitude2 - longitude1);

        const a =
            Math.sin(latDiffRad / 2) ** 2 +
            Math.cos(lat1Rad) *
            Math.cos(lat2Rad) *
            Math.sin(lngDiffRad / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadius * c;
    };

    const toRadians = (degrees) => {
        return (degrees * Math.PI) / 180;
    };

    // distance between hero and incident location
    for(let i=0; i<latHero.length; i++){
        let distance = calculateDistance(latHero[i], longHero[i], lat[i], lng[i]);
        console.log(distance);
    }
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

    function openDetails() {
        detailsModal = true;
    }



</script>
<main class="h-full overflow-y-auto">
    <div class="container md: ">

        <!-- Modal toggle -->

        <div class=" flex flex-col">
            <div class="flex justify-end">
                <Button class="!bg-red-400 w-full !text-black " on:click={() => formModal = true}>Signaler un incident</Button>
                <Button class="!bg-green-400 w-1/2 px-4 py-2  font-semibold " on:click={() => window.location.reload()}>Rafraichir</Button>
            </div>

            <Modal autoclose={false} bind:open={formModal} class="w-full" id="form-modal" size="xl">
                <!-- Form -->
                <div class="w-full overflow-hidden rounded-lg shadow-xs flex items-center ">
                    <form class="w-full p-5" id="form-event">
                        <div class="flex flex-col -mx-3 mb-6">
                            <label class="block uppercase tracking-wide text-gray-700  dark:text-gray-100 text-xs font-bold mb-2">
                                Type d'incident
                            </label>
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
                        <div class="w-full  mb-12 md:mb-0">
                            <label class="block uppercase tracking-wide text-gray-700  dark:text-gray-100 text-xs font-bold mb-2" for="grid-long">
                                Longitude
                            </label>
                            <input   class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-long"  type="text" required>
                        </div>
                        <div class="w-full mb-12 md:mb-0">
                            <label class="block uppercase tracking-wide text-gray-700  dark:text-gray-100 text-xs font-bold mb-2" for="grid-lat">
                                Latitude
                            </label>
                            <input
                                   class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                   id="grid-lat"  type="text" required>
                        </div>
                        <button class="w-full" on:click={submitForm} type="submit">Ajouter</button>
                    </form>
                </div>
            </Modal>

            <!-- Modal with the details when clicking on table row-->
            <Modal autoclose={false} bind:open={detailsModal} class="w-full" id="form-modal" size="xl">
                <div class="modal-dialog m-6 p-4 " role="document">
                        <div class="modal-body">
                            <div class="title shadow-blue-500/50 mb-6">
                                <h1 class="text-center text-lg font-bold text-red-400">Héros correspondants</h1>
                                <h2 class="text-center  font-bold">Dans un rayon de 50km pour ce type d'incident</h2>
                            </div>
                            {#each data as item (item.id)}
                                {#each dataHero as hero}
                                    {#each hero.incidentId as incidentId}
                                        {#if incidentId == item.incidentId}
                                            {#if calculateDistance(item.latitude, item.longitude, hero.latitude, hero.longitude) }
                                                <table class="w-full whitespace-no-wrap">
                                                    <thead>
                                                    <tr class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800"
                                                    >
                                                        <th class="px-4 py-3">Nom</th>
                                                        <th class="px-4 py-3">Téléphone</th>
                                                        <th class="px-4 py-3">Email</th>
                                                        <th class="px-4 py-3">Spécialités</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                                                        <tr class="text-gray-700 dark:text-gray-400">
                                                            <td class="px-4 py-3">
                                                                <div class="flex items-center text-sm">
                                                                    <!-- Avatar with inset shadow -->
                                                                    <div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                                                                        <img
                                                                                alt=""
                                                                                class="object-cover w-full h-full rounded-full"
                                                                                loading="lazy"
                                                                                src="https://cdn1.iconfinder.com/data/icons/people-avatars-10/24/people_avatar_head_criminal_robber_2-512.png"
                                                                        />
                                                                        <div aria-hidden="true" class="absolute inset-0 rounded-full shadow-inner"/>
                                                                    </div>
                                                                    <div>
                                                                        <p class="font-semibold">{hero.name}</p>
                                                                    </div>
                                                                </div>

                                                            </td>
                                                            <td class="px-4 py-3 text-sm">{hero.phone}</td>
                                                            <td class="px-4 py-3 text-xs">
                                                            <span
                                                                    class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100"
                                                            >
                                                              {hero.email}
                                                            </span>
                                                            </td>

                                                            <!-- Display the incidents Ids from array item.incidentID[] -->
                                                            <td class="px-4 py-3">
                                                                {#if hero.incidentId }
                                                                    {#each hero.incidentId as incident (incident)}
                                                                        {#if incident == 1}
                                                                            <span class="px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full dark:bg-green-700 dark:text-green-100">Incendies</span>
                                                                        {/if}
                                                                        {#if incident == 2}
                                                                            <span class="px-2 py-1 font-semibold leading-tight text-amber-700 bg-amber-100 rounded-full dark:bg-green-700 dark:text-green-100">Accidents de la route</span>
                                                                        {/if}
                                                                        {#if incident == 3}
                                                                            <span class="px-2 py-1 font-semibold leading-tight  text-blue-700 bg-blue-100  rounded-full dark:bg-green-700 dark:text-green-100">Accidents fluviaux</span>
                                                                        {/if}
                                                                        {#if incident == 4}
                                                                            <span class="px-2 py-1 font-semibold leading-tight text-gray-700 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-100">Accidents aériens</span>
                                                                        {/if}
                                                                        {#if incident == 5}
                                                                            <span class="px-2 py-1 font-semibold leading-tight text-amber-700 bg-amber-100 rounded-full dark:bg-amber-700 dark:text-amber-100">Éboulements</span>
                                                                        {/if}
                                                                        {#if incident == 6}
                                                                            <span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">Invasions de serpents</span>
                                                                        {/if}
                                                                        {#if incident == 7}
                                                                            <span class="px-2 py-1 font-semibold leading-tight text-yellow-700 bg-yellow-100 rounded-full dark:bg-yellow-700 dark:text-yellow-100">Fuite de gaz</span>
                                                                        {/if}
                                                                        {#if incident == 8}
                                                                            <span class="px-2 py-1 font-semibold leading-tight text-red-900 bg-red-100 rounded-full dark:bg-red-700 dark:text-red-100">Manifestations</span>
                                                                        {/if}
                                                                        {#if incident == 9}
                                                                            <span class="px-2 py-1 font-semibold leading-tight text-purple-700 bg-purple-100 rounded-full dark:bg-purple-700 dark:text-purple-100">Braquages</span>
                                                                        {/if}
                                                                        {#if incident == 10}
                                                                            <span class="px-2 py-1 font-semibold leading-tight text-indigo-700 bg-indigo-100 rounded-full dark:bg-indigo-700 dark:text-indigo-100">Évasions de prisonniers</span>
                                                                        {/if}

                                                                    {/each}

                                                                {/if}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            {:else}
                                                <h2 class="text-center">⚠️ Aucun héros disponible dans le secteur</h2>
                                            {/if}
                                        {/if}
                                    {/each}
                                {/each}
                            {/each}
                        </div>
                    </div>
            </Modal>

            <table class="whitespace-no-wrap ">
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

                    <tr class="text-gray-700 dark:text-gray-400 hover:bg-gray-50 " on:click={openDetails}>
                        <td on:click={openDetails} class="px-4 py-5">
                            <div class="flex items-center " on:click={openDetails}>
                                <!-- Avatar with inset shadow -->
                                <div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                                    <img
                                            alt=""
                                            class="object-cover w-full h-full rounded-full"
                                            loading="lazy"
                                            src="https://raw.githubusercontent.com/ClrGe/SupersHeroes/main/src/lib/images/logoher.png"
                                    />
                                    <div aria-hidden="true" class="absolute inset-0 rounded-full shadow-inner"/>
                                </div>
                                <div class="px-4">
                                            {#if item.incidentId === 1}
                                                <span class="px-2 py-1  leading-tight text-red-700 bg-red-100 rounded-full dark:bg-green-700 dark:text-green-100" on:click={openDetails}>Incendie</span>
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

