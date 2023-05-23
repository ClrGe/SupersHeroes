<svelte:head>
    <title>Supers Héros CRM</title>
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
        map.addControl(new mapboxgl.NavigationControl());
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
        });

        map.on("load", () => {
                map.resize();
            }
        );
    }


</script>
<main class="h-full overflow-y-auto">
    <div class="container px-6 mx-auto grid">
        <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Supers Héros CRM</h2>


        <!-- Display a map with MapBox -->
        <div class="w-full map overflow-hidden rounded-lg shadow-xs">
            <div id="map" bind:this={mapElement}></div>
        </div>

    </div>
</main>

<style>
    #map {
        position: absolute;
        top: 12vh;
        left: 10em;
        width: 100%;
        height: 50vh;
        background: #e5e9ec;

    }

    input {
        left: 10em !important;
        margin-left: 5vh !important;
    }
</style>