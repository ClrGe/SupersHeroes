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
    import {Button, Modal} from "flowbite-svelte";
    import {onMount} from "svelte";
    import {load} from "$src/routes/superheros/incidents/+page.js";

    let submitForm;
    let formModal = false;
    let mapComponent;
    let name;
    let email;
    let phone;

    let data = {
        "name": name || "Batman",
        "incidentId": 1,
        "heroId": 1,
        "city": "Gotham",
        "longitude": -74.0060152,
        "latitude": 40.7127281,
        "status": "pending",
    }
    let result = [];

    onMount(async () => {

        submitForm = async () => {
            await load(data);
        }
    });
</script>

<main class="h-full overflow-y-auto">
    <div class="container  mx-auto grid">
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
        <div>
        <Button class="!bg-white !text-black " on:click={() => formModal = true}>Signaler un incident</Button>
        </div>
        <Modal autoclose={false} bind:open={formModal} class="w-full" id="form-modal" size="xl">
            <!-- Form -->
            <div class="w-full overflow-hidden rounded-lg shadow-xs flex items-center ">
                <form class="w-full p-5" id="form-hero">
                    <div class="flex flex-wrap -mx-3 mb-6">

                        <div class="w-full  px-3 mb-6 md:mb-0">
                            <label class="block uppercase tracking-wide text-gray-700  dark:text-gray-100 text-xs font-bold mb-2"
                                   for="grid-city">
                                Ville
                            </label>
                            <input bind:value="{data.city}"
                                   class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                   id="grid-city" placeholder="Gotham" type="text">
                        </div>
                            <label class="block uppercase tracking-wide text-gray-700  dark:text-gray-100 text-xs font-bold mb-2">
                                Type d'incident
                            </label>
                            <div>
                                <div class="flex items-center mb-2">
                                    <input type="checkbox" id="incendies" class="text-gray-100 mr-2" />
                                    <label for="incendies" class="text-gray-700  dark:text-gray-100">Incendie</label>
                                </div>
                                <div class="flex items-center mb-2">
                                    <input type="checkbox" id="serpents" class="text-gray-100 mr-2" />
                                    <label for="serpents"  class="text-gray-700  dark:text-gray-100">Invasion de serpents</label>
                                </div>
                                <div class="flex items-center">
                                    <input type="checkbox" id="eboulement" class="text-gray-100 mr-2" />
                                    <label for="eboulement"  class="text-gray-700  dark:text-gray-100">Éboulement</label>
                                </div>
                                <div class="flex items-center mb-2">
                                    <input type="checkbox" id="fleuve" class="text-gray-100 mr-2" />
                                    <label for="fleuve"  class="text-gray-700  dark:text-gray-100">Accident fluvial</label>
                                </div>
                                <div class="flex items-center mb-2">
                                    <input type="checkbox" id="route" class="text-gray-100 mr-2" />
                                    <label for="route"  class="text-gray-700  dark:text-gray-100">Accident routier</label>
                                </div>
                                <div class="flex items-center">
                                    <input type="checkbox" id="air" class="text-gray-100 mr-2" />
                                    <label for="air"  class="text-gray-700  dark:text-gray-100">Accident aérien</label>
                                </div>
                                <div class="flex items-center mb-2">
                                    <input type="checkbox" id="manifestation" class="text-gray-100 mr-2" />
                                    <label for="manifestation"  class="text-gray-700  dark:text-gray-100">Manifestation</label>
                                </div>
                                <div class="flex items-center mb-2">
                                    <input type="checkbox" id="gaz" class="text-gray-100 mr-2" />
                                    <label for="gaz"  class="text-gray-700  dark:text-gray-100">Fuite de gaz</label>
                                </div>
                                <div class="flex items-center">
                                    <input type="checkbox" id="braquage" class="text-gray-100 mr-2" />
                                    <label for="braquage"  class="text-gray-700  dark:text-gray-100">Braquage</label>
                                </div>
                                <div class="flex items-center">
                                    <input type="checkbox" id="evasion" class="text-gray-700  dark:text-gray-100 mr-2" />
                                    <label for="evasion"  class="text-gray-700  dark:text-gray-100">Évasion d'un prisonnier</label>
                                </div>
                            </div>
                        </div>
                        <div class="w-full  mb-12 md:mb-0">
                            <label
                                    class="block uppercase tracking-wide text-gray-700  dark:text-gray-100 text-xs font-bold mb-2"
                                    for="grid-long">
                                Longitude
                            </label>
                            <input  bind:value="{data.longitude}" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-long" placeholder="48.85667" type="text">
                        </div>
                    <div class="w-full mb-12 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700  dark:text-gray-100 text-xs font-bold mb-2"
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
    <div class="pane left">
        <List />
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