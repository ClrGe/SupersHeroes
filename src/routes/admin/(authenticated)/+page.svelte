<svelte:head>
  <title>Supers Héros CRM</title>
</svelte:head>
<script>
import { onMount } from "svelte";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "mapbox-gl-geocoder";

let mapElement;
let map = null;
let accessToken = import.meta.env.VITE_MAPBOX_API_ACCESS_TOKEN;
let mapStyle = "mapbox://styles/mapbox/light-v9";
let viewState = {
        longitude: -118.2443409,
        latitude: 34.0544779,
        zoom: 2,
        pitch: 0,
        bearing: 0,
};

onMount(() => {
        createMap();
});

function createMap() {
        map = new mapboxgl.Map({
          accessToken: accessToken,
          container: mapElement,
          interactive: true,
          style: mapStyle,
          center: [viewState.longitude, viewState.latitude],
          zoom: viewState.zoom,
          pitch: viewState.pitch,
          bearing: viewState.bearing,
        });
        map.addControl(
                new MapboxGeocoder({
                  accessToken: accessToken,
                  mapboxgl: mapboxgl
                })
        );


}
</script>
<main class="h-full overflow-y-auto">
  <div class="container px-6 mx-auto grid">
    <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Supers Héros CRM</h2>


    <!-- Display a map with MapBox -->
    <div class="w-full overflow-hidden rounded-lg shadow-xs">
      <div id="map" bind:this={mapElement}></div>
    </div>

  </div>
</main>

<style>
  #map {
    position: absolute;
    top: 12vh;
    left: 0;
    width: 100%;
    height: 50vh;
    background: #e5e9ec;
    overflow: hidden;
  }
</style>