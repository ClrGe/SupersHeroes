<svelte:head>
    <title>Supers Héros CRM</title>
    <script src='https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.js'></script>
    <link href='https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css' rel='stylesheet'/>
    <link href='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.css'
          rel='stylesheet'/>
    <script src='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.min.js'></script>
    <script>import inView from "in-view/src/in-view.js";</script>
</svelte:head>
<script>
    import {onMount} from "svelte";
    import mapboxgl from "mapbox-gl";
    import MapboxGeocoder from "mapbox-gl-geocoder";


    let mapElement;
    let map = null;
    let accessToken = import.meta.env.VITE_MAPBOX_API_ACCESS_TOKEN;
    let mapStyle = "mapbox://styles/mapbox/streets-v12";
    let viewState = {
        longitude: -118.2443409,
        latitude: 34.0544779,
        zoom: 2,
        pitch: 0,
        bearing: 0,
    };

    onMount(() => {
        createMap();
        const nav = new mapboxgl.NavigationControl({
            visualizePitch: true,
        });
        map.addControl(nav, 'bottom-right');

        map.addControl(
            new MapboxGeocoder({
                accessToken: accessToken,
                mapboxgl: mapboxgl,
                marker: true,
                flyTo: {
                    zoom: 10,
                },
            })
        );
    });

    function coordinatesGeocoder(query) {
        var matches = query.match(
            /(-?\d+\.?\d*)[, ]+(-?\d+\.?\d*)[, ]+(-?\d+\.?\d*)/
        );
        if (!matches) return null;

        function coordinateFeature(lng, lat) {
            return {
                center: [lng, lat],
                geometry: {
                    type: "Point",
                    coordinates: [lng, lat],
                },
                place_name: "Lat: " + lat + " Lng: " + lng,
                place_type: ["coordinate"],
                properties: {},
                type: "Feature",
            };
        }

        var coord1 = Number(matches[1]);
        var coord2 = Number(matches[2]);
        var coord3 = Number(matches[3]);
        var geocodes = [];

        if (coord1 < -90 || coord1 > 90) {
            // must be lng, lat, [alt]
            geocodes.push(coordinateFeature(coord1, coord2, coord3));
        }

        if (coord3 < -90 || coord3 > 90) {
            // must be lat, lng, [alt]
            geocodes.push(coordinateFeature(coord3, coord2, coord1));
        }

        if (geocodes.length === 0) {
            // else could be either lng, lat or lat, lng
            geocodes.push(coordinateFeature(coord2, coord1, coord3));
            geocodes.push(coordinateFeature(coord2, coord3, coord1));
        }

        return geocodes;
    }

    function createMap() {
        mapboxgl.accessToken = accessToken;
        map = new mapboxgl.Map({
            container: mapElement,
            style: mapStyle,
            center: [viewState.longitude, viewState.latitude],
            zoom: viewState.zoom,
            pitch: viewState.pitch,
            bearing: viewState.bearing,
            attributionControl: false

        });

        var marker = new mapboxgl.Marker();

        function add_marker (event) {
            var coordinates = event.lngLat;
            console.log('Lng:', viewState.longitude, 'Lat:', viewState.latitude);
            marker.setLngLat(coordinates).addTo(map);
        }

        map.on('click', add_marker);


        map.on("load", () => {
                // Add an image to use as a custom marker
                map.loadImage(
                    'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
                    (error, image) => {
                        if (error) throw error;
                        map.addImage('custom-marker', image);
// Add a GeoJSON source with 2 points
                        map.addSource('points', {
                            'type': 'geojson',
                            'data': {
                                'type': 'FeatureCollection',
                                'features': [
                                    {
// feature for Mapbox DC
                                        'type': 'Feature',
                                        'geometry': {
                                            'type': 'Point',
                                            'coordinates': [
                                                -77.03238901390978, 38.913188059745586
                                            ]
                                        },
                                        'properties': {
                                            'title': 'Mapbox DC'
                                        }
                                    },
                                    {
// feature for Mapbox SF
                                        'type': 'Feature',
                                        'geometry': {
                                            'type': 'Point',
                                            'coordinates': [-122.414, 37.776]
                                        },
                                        'properties': {
                                            'title': 'Mapbox SF'
                                        }
                                    }
                                ]
                            }
                        });

// Add a symbol layer
                        map.addLayer({
                            'id': 'points',
                            'type': 'symbol',
                            'source': 'points',
                            'layout': {
                                'icon-image': 'custom-marker',
// get the title name from the source's "title" property
                                'text-field': ['get', 'title'],
                                'text-font': [
                                    'Open Sans Semibold',
                                    'Arial Unicode MS Bold'
                                ],
                                'text-offset': [0, 1.25],
                                'text-anchor': 'top'
                            }
                        });
                    }
                );
                map.resize();
            }
        );
    }


</script>
<main class="h-full overflow-y-auto">
    <div class="container px-6 mx-auto grid">
        <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Supers Héros CRM</h2>


        <!-- Display a map with MapBox -->
        <div class="w-1/2 map overflow-hidden rounded-lg shadow-xs">
            <div id="map" bind:this={mapElement}></div>
        </div>

    </div>
</main>

<style>
    #map {
        position: absolute;
        top: 15vh;
        left: 25em;
        width: 80%;
        height: 50vh;
        background: #e5e9ec;

    }

</style>