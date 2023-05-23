<svelte:head>
  <title>Incidents</title>
</svelte:head>

    <script>
      import { onMount } from "svelte";
      import mapboxgl from "mapbox-gl";
      import { Map, Geocoder, Marker, controls } from '@beyonk/svelte-mapbox'

      const { GeolocateControl, NavigationControl, ScaleControl } = controls

      // Usage of methods like setCenter and flyto

      // Define this to handle `eventname` events - see [GeoLocate Events](https://docs.mapbox.com/mapbox-gl-js/api/markers/#geolocatecontrol-events)
      function eventHandler (e) {
          const data = e.detail
          // do something with `data`, it's the result returned from the mapbox event
      }
      let mapElement;

      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_ACCESS_TOKEN;
      onMount(() => {
            const mapElement = document.getElementById("map");
          const coordinates = document.getElementById('coordinates');
          const map = new mapboxgl.Map({
              container: 'map',
              style: 'mapbox://styles/mapbox/streets-v12',
              center: [48.85667, 2.35222],
              zoom: 2
          });
          const marker = new mapboxgl.Marker()
              .setLngLat([48.85667, 2.35222])
              .addTo(map);
          const canvas = map.getCanvasContainer();

          const geojson = {
              'type': 'FeatureCollection',
              'features': [
                  {
                      'type': 'Feature',
                      'geometry': {
                          'type': 'Point',
                          'coordinates': [0, 0]
                      }
                  }
              ]
          };

          function onMove(e) {
              const coords = e.lngLat;

// Set a UI indicator for dragging.
              canvas.style.cursor = 'grabbing';

// Update the Point feature in `geojson` coordinates
// and call setData to the source layer `point` on it.
              geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
              map.getSource('point').setData(geojson);
          }

          function onUp(e) {
              const coords = e.lngLat;

// Print the coordinates of where the point had
// finished being dragged to on the map.
              coordinates.style.display = 'block';
              coordinates.innerHTML = `Longitude: ${coords.lng}<br />Latitude: ${coords.lat}`;
              canvas.style.cursor = '';

// Unbind mouse/touch events
              map.off('mousemove', onMove);
              map.off('touchmove', onMove);
          }

          map.on('load', () => {
// Add a single point to the map.
              map.addSource('point', {
                  'type': 'geojson',
                  'data': geojson
              });

              map.addLayer({
                  'id': 'point',
                  'type': 'circle',
                  'source': 'point',
                  'paint': {
                      'circle-radius': 10,
                      'circle-color': '#F84C4C' // red color
                  }
              });

              map.addLayer({
                  'id': 'point1',
                  'type': 'circle',
                  'source': 'point',
                  'paint': {
                      'circle-radius': 10,
                      'circle-color': '#F84C4C' // red color
                  }
              });

// When the cursor enters a feature in
// the point layer, prepare for dragging.
              map.on('mouseenter', 'point', () => {
                  map.setPaintProperty('point', 'circle-color', '#3bb2d0');
                  canvas.style.cursor = 'move';
              });

              map.on('mouseleave', 'point', () => {
                  map.setPaintProperty('point', 'circle-color', '#3887be');
                  canvas.style.cursor = '';
              });

              map.on('mousedown', 'point', (e) => {
// Prevent the default map drag behavior.
                  e.preventDefault();

                  canvas.style.cursor = 'grab';

                  map.on('mousemove', onMove);
                  map.once('mouseup', onUp);
              });

              map.on('touchstart', 'point', (e) => {
                  if (e.points.length !== 1) return;

// Prevent the default map drag behavior.
                  e.preventDefault();

                  map.on('touchmove', onMove);
                  map.once('touchend', onUp);
              });
          });


      });

    </script>

<main class="h-full pb-16 overflow-y-auto">
  <div class="container px-6 mx-auto grid">
    <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Incidents</h2>
        <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Supers Héros CRM</h2>


        <!-- Display a map with MapBox -->
        <div class="w-full overflow-hidden rounded-lg shadow-xs">
          <div id="map" bind:this={mapElement}></div>
            <pre id="coordinates" class="coordinates"></pre>

        </div>

      </div>
    </main>

    <style>
      #map {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #e5e9ec;
        overflow: hidden;
      }

       .coordinates {
           background: rgba(0, 0, 0, 0.5);
           color: #fff;
           position: absolute;
           bottom: 40px;
           left: 10px;
           padding: 5px 10px;
           margin: 0;
           font-size: 11px;
           line-height: 18px;
           border-radius: 3px;
           display: none;
       }

    </style>