<script>
    import {Button, Modal} from "flowbite-svelte";
    import {onDestroy, onMount} from "svelte";
    import {load} from "$src/routes/superheros/heros/+page.js";

    function onReady() {
        mapComponent.flyTo({center: [40.7127281, -74.0060152]})
    }

    let formModal = false;
    let mapComponent;
    let name;
    let email;
    let phone;

    let data = {
        "name": name || "Batman",
        "email": email || "bruce.wayne@gotham.dc",
        "phone": phone || "000000000000",
        "city": "Gotham",
        "longitude": -74.0060152,
        "latitude": 40.7127281
    }
    let result = [];
    // GET data from http://localhost:5039/api/Hero

    const url = "http://localhost:5039/api/Hero";
    let heroes = [];
    let mapRef;


    let submitForm;
    onMount(async () => {

        await import('leaflet');

        submitForm = async () => {
            await load(data);
        }
    });

</script>

<svelte:head>
    <title>Heros</title>
</svelte:head>

<main class="h-full pb-16 overflow-y-auto">


    <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Ajouter un Super Héros </h2>


    <!-- Modal to be populated on click -->
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
    <Button class="!bg-white !text-black " on:click={() => formModal = true}>Ajouter un Super Héros</Button>

    <Modal autoclose={false} bind:open={formModal} class="w-full" id="form-modal" size="xl">
        <!-- Form -->
        <div class="w-full overflow-hidden rounded-lg shadow-xs flex items-center ">
            <form class="w-full" id="form-hero">
                <div class="flex flex-wrap -mx-3 mb-6">
                    <div class="w-full  px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-100 text-xs font-bold mb-2"
                               for="grid-name">
                            Nom de Super Héros
                        </label>
                        <input bind:value="{data.name}"
                               class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                               id="grid-name" name="name" placeholder="Batman" type="text">
                        <p class="text-red-500 text-xs italic">Ce champ est obligatoire.</p>
                    </div>
                    <div class="w-full px-3">
                        <label class="block uppercase tracking-wide text-gray-100 text-xs font-bold mb-2"
                               for="grid-email">
                            Email
                        </label>
                        <input bind:value="{data.email}"
                               class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                               id="grid-email" name="email" placeholder="bruce.wayne@gotham.dc" type="text">
                    </div>
                </div>
                <div class="flex flex-wrap -mx-3 mb-6">
                    <div class="w-full px-3">
                        <label class="block uppercase tracking-wide text-gray-100 text-xs font-bold mb-2"
                               for="grid-phone" name="phone">
                            Numéro de téléphone
                        </label>
                        <input bind:value="{data.phone}"
                               class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                               id="grid-phone" placeholder="000000000000" type="text">
                        <p class="text-gray-600 text-xs italic">Ce champ est obligatoire</p>
                    </div>
                </div>
                <div class="flex flex-wrap -mx-3 mb-2">
                    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-100 text-xs font-bold mb-2"
                               for="grid-city">
                            Ville
                        </label>
                        <input bind:value="{data.city}"
                               class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                               id="grid-city" placeholder="Gotham" type="text">
                    </div>
                    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-100 text-xs font-bold mb-2">
                            Spécialités
                        </label>
                        <div>
                            <div class="flex items-center mb-2">
                                <input type="checkbox" id="incendies" class="text-gray-100 mr-2" />
                                <label for="incendies" class="text-gray-100">Incendies</label>
                            </div>
                            <div class="flex items-center mb-2">
                                <input type="checkbox" id="invasion-de-serpents" class="text-gray-100 mr-2" />
                                <label for="invasion-de-serpents" class="text-gray-100">Invasion de serpents</label>
                            </div>
                            <div class="flex items-center">
                                <input type="checkbox" id="texas" class="text-gray-100 mr-2" />
                                <label for="texas" class="text-gray-100">Texas</label>
                            </div>
                        </div>
                    </div>
                    <div class="w-full px-3 mb-12 md:mb-0">
                        <label
                               class="block uppercase tracking-wide text-gray-100 text-xs font-bold mb-2"
                               for="grid-long">
                            Latitude
                        </label>
                        <input  bind:value="{data.longitude}" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                               id="grid-long" placeholder="48.85667" type="text">
                    </div>
                </div>
                <div class="w-full mb-12 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-100 text-xs font-bold mb-2"
                           for="grid-lat">
                        Latitude
                    </label>
                    <input bind:value="{data.latitude}"
                           class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                           id="grid-lat" placeholder="2.35222" type="text">
                </div>
                <button class="w-full" on:click={submitForm} type="submit">Ajouter</button>
                <pre>
{result}
</pre>
            </form>

        </div>

    </Modal>
    <!-- Stats -->
    <div class="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <div
                    class="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500"
            >
                <svg class="h-6 w-6 text-white" fill="none" height="24" stroke="currentColor" stroke-linecap="round"
                     stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24">
                    <path d="M0 0h24v24H0z" stroke="none"/>
                    <path d="M18 15a6 6 0 1 1 -10.853 -3.529c1.926-2.338 4.763-3.327 3.848-8.47 2.355 1.761 5.84 5.38 2.022 9.406-1.136 1.091-.244 2.767 1.221 2.593.882-.105 2.023-.966 3.23-2.3.532.68.532 1.717.532 2.3z"/>
                </svg>
            </div>
            <div>
                <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Nombre d'incidents en cours</p>
                <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">490</p>
            </div>
        </div>
        <div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <div
                    class="p-3 mr-4 text-green-500 bg-green-100 rounded-full dark:text-green-100 dark:bg-green-500"
            >
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="2"/>
                </svg>

            </div>
            <div>
                <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Types d'incidents pris en
                    charge</p>
                <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">10</p>
            </div>
        </div>
        <div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <div
                    class="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-500"
            >
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                          stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="2"/>
                </svg>

            </div>
            <div>
                <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Nombre de héros disponibles</p>
                <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">376</p>
            </div>
        </div>
        <div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <div
                    class="p-3 mr-4 text-teal-500 bg-teal-100 rounded-full dark:text-teal-100 dark:bg-teal-500"
            >
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" stroke-linecap="round"
                     stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                </svg>
            </div>
            <div>
                <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Niveau de satisfaction</p>
                <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">100%</p>
            </div>
        </div>
    </div>

    <!-- New Table -->

    <div class="w-full overflow-hidden rounded-lg shadow-xs">
        <div class="w-full overflow-x-auto">
            <table class="w-full whitespace-no-wrap">
                <thead>
                <tr
                        class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800"
                >
                    <th class="px-4 py-3">Nom</th>
                    <th class="px-4 py-3">Depuis</th>
                    <th class="px-4 py-3">Statut</th>
                    <th class="px-4 py-3">Spécialité</th>
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
                                        src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
                                />
                                <div aria-hidden="true" class="absolute inset-0 rounded-full shadow-inner"/>
                            </div>
                            <div>
                                <p class="font-semibold">Superman</p>
                                <p class="text-xs text-gray-600 dark:text-gray-400">Demi-dieu</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-4 py-3 text-sm">18/04/1900</td>
                    <td class="px-4 py-3 text-xs">
                <span
                        class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100"
                >
                  Disponible
                </span>
                    </td>
                    <td class="px-4 py-3 text-sm"> Incendies</td>
                </tr>


                </tbody>
            </table>
        </div>
        <div
                class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800"
        >
            <span class="flex items-center col-span-3"> Showing 21-30 of 100 </span>
            <span class="col-span-2"/>
            <!-- Pagination -->
            <span class="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
          <nav aria-label="Table navigation">
            <ul class="inline-flex items-center">
              <li>
                <button
                        aria-label="Previous"
                        class="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple"
                >
                  <svg aria-hidden="true" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path
                            clip-rule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            fill-rule="evenodd"
                    />
                  </svg>
                </button>
              </li>
              <li>
                <button class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
                  1
                </button>
              </li>
              <li>
                <button class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
                  2
                </button>
              </li>
              <li>
                <button
                        class="px-3 py-1 text-white transition-colors duration-150 bg-purple-600 border border-r-0 border-purple-600 rounded-md focus:outline-none focus:shadow-outline-purple"
                >
                  3
                </button>
              </li>
              <li>
                <button class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
                  4
                </button>
              </li>
              <li>
                <span class="px-3 py-1">...</span>
              </li>
              <li>
                <button class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
                  8
                </button>
              </li>
              <li>
                <button class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
                  9
                </button>
              </li>
              <li>
                <button
                        aria-label="Next"
                        class="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple"
                >
                  <svg aria-hidden="true" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path
                            clip-rule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            fill-rule="evenodd"
                    />
                  </svg>
                </button>
              </li>
            </ul>
          </nav>
        </span>
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