<script>
    import {Button, Modal} from "flowbite-svelte";
    import {onDestroy, onMount} from "svelte";
    import {api} from "../../api.ts";
    let data = [];
    let incidentData = [];
    import MapboxSearchBox from 'mapbox-gl';
    import mapboxgl from "mapbox-gl";

    function onReady() {
        mapComponent.flyTo({center: [40.7127281, -74.0060152]})
    }
    let formModal = false;
    let mapComponent;
    let name;
    let email;
    let phone;
let map;

    let formHero = {
        "name": name || "Batman",
        "email": email || "bruce.wayne@gotham.dc",
        "phone": phone || "000000000000",
        "city": "Gotham",
        "longitude": -74.0060152,
        "latitude": 40.7127281,
        "incidentId": [],
        "incidentName": []
    }
    // unchecked if more than 3 checkboxes are checked
    onMount(async () => {
        const response = await fetch('http://localhost:5039/api/hero');
        data = await response.json();
        console.log(data);
        await import('leaflet');
        const incidentResponse = await fetch('http://localhost:5039/api/incident');
        incidentData = await incidentResponse.json();
        // where incidentData.id = data.incidentId push the incidentData.name in the data instance
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < incidentData.length; j++) {
               for (let k = 0; k < data[i].incidentId.length; k++) {
                   if (data[i].incidentId[k] === incidentData[j].id) {
                       data[i].incidentId[k] = incidentData[j].title;
                   }
               }
            }
        }

        console.log(incidentData);
        // if more than 3 checkboxes are checked, uncheck the last one and show an alert
        function handleCheckboxClick(event) {
            const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
            if (checkboxes.length > 3) {
                event.target.checked = false;
                alert('You can select up to 3 checkboxes');
            }
        }
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_ACCESS_TOKEN;

        // mapbox
        map = new mapboxgl.Map({
            accessToken: import.meta.env.VITE_MAPBOX_API_ACCESS_TOKEN,
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-74.0060152, 40.7127281],
            zoom: 7
        });


        const search = new MapboxSearchBox();
        search.accessToken = import.meta.env.VITE_MAPBOX_API_ACCESS_TOKEN;
        map.addControl(search);
    });

    async function submitForm(){
        try {
            // push the checked checkbox value in the array IncidentId
            const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
            for (let i = 0; i < checkboxes.length; i++) {
                formHero.incidentId.push(checkboxes[i].value);
            }
            const response = await fetch('http://localhost:5039/api/hero/add', {
                method: 'POST',
                headers: {
                    'Allow-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formHero)
            });
            console.log(data);
        } catch (e) {
            console.log(e);
        }
    }
</script>

<svelte:head>
    <title>Heros</title>
</svelte:head>

<main class="h-full pb-16 overflow-y-auto">
    <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Liste des Super Héros </h2>
    <Modal autoclose={false} bind:open={formModal} class="w-full" id="form-modal" size="xs">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <button aria-label="Close" class="close" data-dismiss="modal" type="button"><span
                            aria-hidden="true">&times;</span></button>
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
    <div class="flex justify-end">

            <Button class="!bg-red-400 px-4 py-2 my-3 mr-3 font-semibold " on:click={() => formModal = true}>+ Ajouter un Super Héros</Button>
        <Button class="!bg-green-400 px-4 py-2 my-3 mr-3 font-semibold " on:click={() => window.location.reload()}>Rafraichir</Button>
    </div>
    <Modal autoclose={false} bind:open={formModal} class="w-full" id="form-modal" size="xl">

        <!-- Form -->

        <div class="w-full overflow-hidden rounded-lg shadow-xs flex items-center ">
            <form class="w-full" id="form-hero">
                <div class="flex flex-wrap -mx-3 mb-6">
                    <div class="w-full  px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700  dark:text-gray-100 text-xs font-bold mb-2"
                               for="grid-name">
                            Nom de Super Héros
                        </label>
                        <input bind:value="{formHero.name}"
                               class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                               id="grid-name" name="name" placeholder="Batman" type="text">
                        <p class="text-red-500 text-xs italic">Ce champ est obligatoire.</p>
                    </div>
                    <div class="w-full px-3">
                        <label class="block uppercase tracking-wide text-gray-700  dark:text-gray-100 text-xs font-bold mb-2"
                               for="grid-email">
                            Email
                        </label>
                        <input bind:value="{formHero.email}"
                               class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                               id="grid-email" name="email" placeholder="bruce.wayne@gotham.dc" type="text">
                    </div>
                </div>
                <div class="flex flex-wrap -mx-3 mb-6">
                    <div class="w-full px-3">
                        <label class="block uppercase tracking-wide text-gray-700  dark:text-gray-100 text-xs font-bold mb-2"
                               for="grid-phone" name="phone">
                            Numéro de téléphone
                        </label>
                        <input bind:value="{formHero.phone}"
                               class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                               id="grid-phone" placeholder="000000000000" type="text">
                        <p class="text-gray-600 text-xs italic">Ce champ est obligatoire</p>
                    </div>
                </div>
                <div class="flex flex-wrap -mx-3 mb-2">
                    <div class="w-full px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700  dark:text-gray-100 text-xs font-bold mb-2"
                               for="grid-city">
                            Ville
                        </label>
                        <input bind:value="{formHero.city}"
                               class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                               id="grid-city" placeholder="Gotham" type="text">
                    </div>
                    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700  dark:text-gray-100 text-xs font-bold mb-2">
                            Spécialités
                        </label>
                        <div class="md:w-1/2">
                            <!--- push the id of the incident in the array for each checked box -->

                            <label class="block text-gray-500 font-bold">
                                <input name="formHero.incidentId" class="mr-2 leading-tight"
                                       type="checkbox" value={1}>
                                <span class="text-sm">
                                    Incendie
                                </span>
                            </label>
                            <label class="block text-gray-500 font-bold">
                                <input name="formHero.incidentId" class="mr-2 leading-tight"
                                       type="checkbox" value={2}>
                                <span class="text-sm">
                                    Accident de la route
                                </span>
                            </label>
                            <label class="block text-gray-500 font-bold">
                                <input  name="formHero.incidentId" class="mr-2 leading-tight"
                                        type="checkbox" value={3}>
                                <span class="text-sm">
                                    Accident fluvial
                                </span>
                            </label>
                            <label class="block text-gray-500 font-bold">
                                <input  name="formHero.incidentId" class="mr-2 leading-tight"
                                        type="checkbox" value={4}>
                                <span class="text-sm">
                                    Accident aérien
                                </span>
                            </label>
                            <label class="block text-gray-500 font-bold">
                                <input name="formHero.incidentId" class="mr-2 leading-tight"
                                       type="checkbox" value={5}>
                                <span class="text-sm">
                                    Eboulement
                                </span>
                            </label>
                            <label class="block text-gray-500 font-bold">
                                <input name="formHero.incidentId" class="mr-2 leading-tight"
                                       type="checkbox" value={6}>
                                <span class="text-sm">
                                    Invasion de serpents
                                </span>
                            </label>
                            <label class="block text-gray-500 font-bold">
                                <input name="formHero.incidentId" class="mr-2 leading-tight"
                                        type="checkbox" value={7}>
                                <span class="text-sm">
                                    Fuite de gaz
                                </span>
                            </label>
                            <label class="block text-gray-500 font-bold">
                                <input name="formHero.incidentId" class="mr-2 leading-tight"
                                        type="checkbox" value={8}>
                                <span class="text-sm">
                                    Manifestation
                                </span>
                            </label>
                            <label class="block text-gray-500 font-bold">
                                <input name="formHero.incidentId" class="mr-2 leading-tight"
                                       type="checkbox" value={9}>
                                <span class="text-sm">
                                    Braquage
                                </span>
                            </label>
                            <label class="block text-gray-500 font-bold">
                                <input name="formHero.incidentId" class="mr-2 leading-tight"
                                        type="checkbox" value={10}>
                                <span class="text-sm">
                                    Évasion de prisonniers
                                </span>
                            </label>
                        </div>
                    </div>
                    <div class="w-full px-3 mb-12 md:mb-0">
                        <label
                                class="block uppercase tracking-wide text-gray-700  dark:text-gray-100 text-xs font-bold mb-2"
                                for="grid-long">
                            Longitude
                        </label>
                        <input  bind:value="{formHero.longitude}" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="grid-long" placeholder="48.85667" type="text">
                    </div>
                </div>
                <div class="w-full mb-12 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700  dark:text-gray-100 text-xs font-bold mb-2"
                           for="grid-lat">
                        Latitude
                    </label>
                    <input bind:value="{formHero.latitude}"
                           class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                           id="grid-lat" placeholder="2.35222" type="text">
                </div>


                <button class="w-full" on:click={submitForm} type="submit">Ajouter</button>
            </form>

        </div>
    </Modal>

    <!-- New Table -->
    <div class="w-full overflow-hidden rounded-lg shadow-xs">
        <div class="w-full overflow-x-auto">
            <!--- button to reload the table -->

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
            {#each data as item (item.id)}
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
                                    <p class="font-semibold">{item.name}</p>
                                </div>
                            </div>

                        </td>
                        <td class="px-4 py-3 text-sm">{item.phone}</td>
                        <td class="px-4 py-3 text-xs">
                <span
                        class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100"
                >
                  {item.email}
                </span>
                        </td>

                        <!-- Display the incidents Ids from array item.incidentID[] -->
                        <td class="px-4 py-3">
                            {#if item.incidentId }
                            {#each item.incidentId as incident (incident)}
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
                {/each}
            </tbody>
        </table>
        <div
                class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800"
        >
            <span class="flex items-center col-span-3"></span>
            <span class="col-span-2"/>
            <!-- Pagination -->
            <span class="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">

        </span>
        </div>
    </div>
    </div>
</main>

<style>
    #map {
        width: 100%;
        height: 1000px;
        position: relative;
    }

    .menu-ui {
        background: #fff;
        position: absolute;
        top: 100px;
        left: 10px;
        z-index: 1;
        border-radius: 3px;
        width: 120px;
        border: 1px solid rgba(0, 0, 0, 0.4);
    }

    .menu-ui a {
        font-size: 13px;
        color: #404040;
        display: block;
        margin: 0;
        padding: 0;
        padding: 10px;
        text-decoration: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.25);
        text-align: center;
    }

    .menu-ui a:first-child {
        border-radius: 3px 3px 0 0;
    }

    .menu-ui a:last-child {
        border: none;
        border-radius: 0 0 3px 3px;
    }

    .menu-ui a:hover {
        background: #f8f8f8;
        color: #404040;
        cursor: pointer !important;
    }

    .menu-ui a.active,
    .menu-ui a.active:hover {
        background: #3887BE;
        color: #FFF;
    }

    .info {
        position: absolute;
        top: 100px;
        left: 10px;
    }

    .info div {
        background: #fff;
        padding: 10px;
        border-radius: 3px;
    }
</style>

<!-- Stats -->
<!--    <div class="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">-->
<!--        <div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">-->
<!--            <div-->
<!--                    class="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500"-->
<!--            >-->
<!--                <svg class="h-6 w-6 text-white" fill="none" height="24" stroke="currentColor" stroke-linecap="round"-->
<!--                     stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24">-->
<!--                    <path d="M0 0h24v24H0z" stroke="none"/>-->
<!--                    <path d="M18 15a6 6 0 1 1 -10.853 -3.529c1.926-2.338 4.763-3.327 3.848-8.47 2.355 1.761 5.84 5.38 2.022 9.406-1.136 1.091-.244 2.767 1.221 2.593.882-.105 2.023-.966 3.23-2.3.532.68.532 1.717.532 2.3z"/>-->
<!--                </svg>-->
<!--            </div>-->
<!--            <div>-->
<!--                <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Nombre d'incidents en cours</p>-->
<!--                <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">490</p>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">-->
<!--            <div-->
<!--                    class="p-3 mr-4 text-green-500 bg-green-100 rounded-full dark:text-green-100 dark:bg-green-500"-->
<!--            >-->
<!--                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">-->
<!--                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"-->
<!--                          stroke-linecap="round" stroke-linejoin="round"-->
<!--                          stroke-width="2"/>-->
<!--                </svg>-->

<!--            </div>-->
<!--            <div>-->
<!--                <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Types d'incidents pris en-->
<!--                    charge</p>-->
<!--                <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">10</p>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">-->
<!--            <div-->
<!--                    class="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-500"-->
<!--            >-->
<!--                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">-->
<!--                    <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"-->
<!--                          stroke-linecap="round" stroke-linejoin="round"-->
<!--                          stroke-width="2"/>-->
<!--                </svg>-->

<!--            </div>-->
<!--            <div>-->
<!--                <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Nombre de héros disponibles</p>-->
<!--                <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">376</p>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">-->
<!--            <div-->
<!--                    class="p-3 mr-4 text-teal-500 bg-teal-100 rounded-full dark:text-teal-100 dark:bg-teal-500"-->
<!--            >-->
<!--                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" stroke-linecap="round"-->
<!--                     stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">-->
<!--                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>-->
<!--                </svg>-->
<!--            </div>-->
<!--            <div>-->
<!--                <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Niveau de satisfaction</p>-->
<!--                <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">100%</p>-->
<!--            </div>-->
<!--        </div>-->
<!--    </div>-->
