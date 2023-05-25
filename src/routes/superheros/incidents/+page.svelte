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
        width: 100%;
        justify-content: center;
    }

    .right {
        justify-content: center;
        width: 100%;
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
    let group;
    let formEvent = {
        "incidentId": group,
        "heroId": 1,
        "city": "Gotham",
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
        // retrieve the value of "group" bound to radio


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
    <div class="container  mx-auto ">

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
        <div class="w-full mt-5 mr-auto ml-auto">
        <Button class="!bg-red-400 w-full !text-black " on:click={() => formModal = true}>Signaler un incident</Button>
        </div>
        <Modal autoclose={false} bind:open={formModal} class="w-full" id="form-modal" size="xl">
            <!-- Form -->
            <div class="w-full overflow-hidden rounded-lg shadow-xs flex items-center ">
                <form class="w-full p-5" id="form-event">
                    <div class="flex flex-wrap -mx-3 mb-6">

                        <div class="w-full  px-3 mb-6 md:mb-0">
                            <label class="block uppercase tracking-wide text-gray-700  dark:text-gray-100 text-xs font-bold mb-2"
                                   for="grid-city">
                                Ville
                            </label>
                            <input bind:value="{formEvent.city}"
                                   class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                   id="grid-city" placeholder="Gotham" type="text">
                        </div>
                        <label class="block uppercase tracking-wide text-gray-700  dark:text-gray-100 text-xs font-bold mb-2">
                                Type d'incident
                            </label>

                        <div>
                            <div class="flex items-center mb-2">
                                <Radio bind:group id="incendies" value={1} class="text-gray-100 mr-2" >
                                    Incendie
                                </Radio>
                            </div>
                            <div class="flex items-center mb-2">
                                <Radio bind:group id="route" value={2} class="text-gray-100 mr-2" >
                                    Accident routier
                                </Radio>
                            </div>
                            <div class="flex items-center mb-2">
                                <Radio bind:group id="fleuve" value={3} class="text-gray-100 mr-2" >
                                    Accident fluvial
                                </Radio>
                            </div>
                            <div class="flex items-center">
                                <Radio bind:group id="air" value={4} class="text-gray-100 mr-2" >
                                    Accident aérien
                                </Radio>
                            </div>
                            <div class="flex items-center">
                                <Radio bind:group id="eboulement" value={5} class="text-gray-100 mr-2">
                                    Éboulement
                                </Radio>
                            </div>
                            <div class="flex items-center mb-2">
                                <Radio bind:group id="serpents" value={6} class="text-gray-100 mr-2" >
                                    Invasion de serpents
                                </Radio>
                            </div>
                            <div class="flex items-center mb-2">
                                <Radio id="gaz" bind:group value={7} class="text-gray-100 mr-2" >
                                    Fuite de gaz
                                </Radio>
                            </div>
                            <div class="flex items-center mb-2">
                                <Radio bind:group id="manifestation" value={8} class="text-gray-100 mr-2">
                                    Manifestation
                                </Radio>
                            </div>
                            <div class="flex items-center">
                                <Radio id="braquage" bind:group value={9} class="text-gray-100 mr-2" >
                                    Braquage
                                </Radio>
                            </div>
                            <div class="flex items-center">
                                <Radio id="evasion" bind:group value={10} class="text-gray-100 mr-2" >
                                    Évasion d'un prisonnier
                                </Radio>

                            </div>
                        </div>
                        </div>
                        <div class="w-full  mb-12 md:mb-0">
                            <label
                                    class="block uppercase tracking-wide text-gray-700  dark:text-gray-100 text-xs font-bold mb-2"
                                    for="grid-long">
                                Longitude
                            </label>
                            <input  bind:value="{formEvent.longitude}" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-long" placeholder="48.85667" type="text">
                        </div>
                    <div class="w-full mb-12 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700  dark:text-gray-100 text-xs font-bold mb-2"
                               for="grid-lat">
                            Latitude
                        </label>
                        <input bind:value="{formEvent.latitude}"
                               class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                               id="grid-lat" placeholder="2.35222" type="text">
                    </div>
                    <button class="w-full" on:click={submitForm} type="submit">Ajouter</button>
                </form>
            </div>

        </Modal>
    <div class="pane left">
        <div class="overflow-hidden rounded-lg shadow-xs flex flex-col left
">
            <div class="w-full overflow-x-auto">
                <table class="whitespace-no-wrap">
                    <thead>
                    <tr
                            class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800"
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
                                        <p class="font-semibold">{item.city}</p>
                                    </div>
                                </div>

                            </td>
                            <td class="px-4 py-3 text-sm">{item.status}</td>
                            <td class="px-4 py-3 text-xs">
                <span
                        class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100"
                >
                  {item.email}
                </span>
                            </td>
                            <td class="px-4 py-3 text-sm"> Incendies</td>
                        </tr>

                    {/each}

                    </tbody>
                </table>
            </div>
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

        {#each data as item (item.id)}
            <tr>
                <td>{item.city}</td>
                <td>{item.status}</td>
            </tr>
        {/each}
        <!---<List />--->
    </div>
    <div class="pane right">
        <Map />
    </div>
</div>
</main>

<!--<svelte:head>-->
<!--  <title>Incidents</title>-->
<!--</svelte:head>-->

<!--    <script>-->
<!--      import { onMount } from "svelte";-->
<!--      import mapboxgl from "mapbox-gl";-->
<!--      import { Map, Geocoder, Marker, controls } from '@beyonk/svelte-mapbox'-->

<!--      const { GeolocateControl, NavigationControl, ScaleControl } = controls-->

<!--      // Usage of methods like setCenter and flyto-->

<!--      // Define this to handle `eventname` events - see [GeoLocate Events](https://docs.mapbox.com/mapbox-gl-js/api/markers/#geolocatecontrol-events)-->
<!--      function eventHandler (e) {-->
<!--          const data = e.detail-->
<!--          // do something with `data`, it's the result returned from the mapbox event-->
<!--      }-->
<!--      let mapElement;-->

<!--      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_ACCESS_TOKEN;-->
<!--      onMount(() => {-->
<!--            const mapElement = document.getElementById("map");-->
<!--          const coordinates = document.getElementById('coordinates');-->
<!--          const map = new mapboxgl.Map({-->
<!--              container: 'map',-->
<!--              style: 'mapbox://styles/mapbox/streets-v12',-->
<!--              center: [48.85667, 2.35222],-->
<!--              zoom: 2-->
<!--          });-->
<!--          const marker = new mapboxgl.Marker()-->
<!--              .setLngLat([48.85667, 2.35222])-->
<!--              .addTo(map);-->
<!--          const canvas = map.getCanvasContainer();-->

<!--          const geojson = {-->
<!--              'type': 'FeatureCollection',-->
<!--              'features': [-->
<!--                  {-->
<!--                      'type': 'Feature',-->
<!--                      'geometry': {-->
<!--                          'type': 'Point',-->
<!--                          'coordinates': [0, 0]-->
<!--                      }-->
<!--                  }-->
<!--              ]-->
<!--          };-->

<!--          function onMove(e) {-->
<!--              const coords = e.lngLat;-->

<!--// Set a UI indicator for dragging.-->
<!--              canvas.style.cursor = 'grabbing';-->

<!--// Update the Point feature in `geojson` coordinates-->
<!--// and call setData to the source layer `point` on it.-->
<!--              geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];-->
<!--              map.getSource('point').setData(geojson);-->
<!--          }-->

<!--          function onUp(e) {-->
<!--              const coords = e.lngLat;-->

<!--// Print the coordinates of where the point had-->
<!--// finished being dragged to on the map.-->
<!--              coordinates.style.display = 'block';-->
<!--              coordinates.innerHTML = `Longitude: ${coords.lng}<br />Latitude: ${coords.lat}`;-->
<!--              canvas.style.cursor = '';-->

<!--// Unbind mouse/touch events-->
<!--              map.off('mousemove', onMove);-->
<!--              map.off('touchmove', onMove);-->
<!--          }-->

<!--          map.on('load', () => {-->
<!--// Add a single point to the map.-->
<!--              map.addSource('point', {-->
<!--                  'type': 'geojson',-->
<!--                  'data': geojson-->
<!--              });-->

<!--              map.addLayer({-->
<!--                  'id': 'point',-->
<!--                  'type': 'circle',-->
<!--                  'source': 'point',-->
<!--                  'paint': {-->
<!--                      'circle-radius': 10,-->
<!--                      'circle-color': '#F84C4C' // red color-->
<!--                  }-->
<!--              });-->

<!--              map.addLayer({-->
<!--                  'id': 'point1',-->
<!--                  'type': 'circle',-->
<!--                  'source': 'point',-->
<!--                  'paint': {-->
<!--                      'circle-radius': 10,-->
<!--                      'circle-color': '#F84C4C' // red color-->
<!--                  }-->
<!--              });-->

<!--// When the cursor enters a feature in-->
<!--// the point layer, prepare for dragging.-->
<!--              map.on('mouseenter', 'point', () => {-->
<!--                  map.setPaintProperty('point', 'circle-color', '#3bb2d0');-->
<!--                  canvas.style.cursor = 'move';-->
<!--              });-->

<!--              map.on('mouseleave', 'point', () => {-->
<!--                  map.setPaintProperty('point', 'circle-color', '#3887be');-->
<!--                  canvas.style.cursor = '';-->
<!--              });-->

<!--              map.on('mousedown', 'point', (e) => {-->
<!--// Prevent the default map drag behavior.-->
<!--                  e.preventDefault();-->

<!--                  canvas.style.cursor = 'grab';-->

<!--                  map.on('mousemove', onMove);-->
<!--                  map.once('mouseup', onUp);-->
<!--              });-->

<!--              map.on('touchstart', 'point', (e) => {-->
<!--                  if (e.points.length !== 1) return;-->

<!--// Prevent the default map drag behavior.-->
<!--                  e.preventDefault();-->

<!--                  map.on('touchmove', onMove);-->
<!--                  map.once('touchend', onUp);-->
<!--              });-->
<!--          });-->


<!--      });-->

<!--    </script>-->

<!--<main class="h-full pb-16 overflow-y-auto">-->
<!--  <div class="container px-6 mx-auto grid">-->
<!--    <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Incidents</h2>-->
<!--        <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Supers Héros CRM</h2>-->


<!--        &lt;!&ndash; Display a map with MapBox &ndash;&gt;-->
<!--        <div class="w-full overflow-hidden rounded-lg shadow-xs">-->
<!--          <div id="map" bind:this={mapElement}></div>-->
<!--            <pre id="coordinates" class="coordinates"></pre>-->

<!--        </div>-->

<!--      </div>-->
<!--    </main>-->

<!--    <style>-->
<!--      #map {-->
<!--        position: absolute;-->
<!--        top: 0;-->
<!--        left: 0;-->
<!--        width: 100%;-->
<!--        height: 100%;-->
<!--        background: #e5e9ec;-->
<!--        overflow: hidden;-->
<!--      }-->

<!--       .coordinates {-->
<!--           background: rgba(0, 0, 0, 0.5);-->
<!--           color: #fff;-->
<!--           position: absolute;-->
<!--           bottom: 40px;-->
<!--           left: 10px;-->
<!--           padding: 5px 10px;-->
<!--           margin: 0;-->
<!--           font-size: 11px;-->
<!--           line-height: 18px;-->
<!--           border-radius: 3px;-->
<!--           display: none;-->
<!--       }-->

<!--    </style>-->