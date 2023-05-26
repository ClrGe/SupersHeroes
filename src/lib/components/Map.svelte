<style>
    body {
        margin: 0;
        padding: 0;
    }

    #map {
        position: absolute
    }

    #map {
        width: 50%;
        height: 100%;
        right: 1vw;
    }

    #map:before {
        box-shadow: 20px 0 10px -10px rgba(0, 0, 0, 0.15) inset;
        content: '';
        height: 100%;
        left: 0;
        position: absolute;
        width: 20px;
        z-index: -1;
    }

    #geocoder-container > div {
        min-width: 50%;
        margin-left: 25%;
        bottom: 0;
        position: absolute;
    }
    #info {
        display: table;
        position: relative;
        margin: 0px auto;
        word-wrap: anywhere;
        white-space: pre-wrap;
        padding: 10px;
        border: none;
        border-radius: 3px;
        font-size: 12px;
        text-align: center;
        color: #222;
        background: #fff;
    }
</style>

<script>
    import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
    import {activeMapItem} from '$stores/stores.js';
    import {onDestroy, onMount} from 'svelte';
    import {listItems} from '$stores/consts.js';
    import MapboxGeocoder from "mapbox-gl-geocoder";
    import 'mapbox-gl/dist/mapbox-gl.css';
    import {Modal, Radio} from "flowbite-svelte";

    let map;
    export let longitude;
    export let latitude;

    export let latHero;
    export let longHero;

    let ltClick = 0;
    let lgClick = 0;
    export let group;
    export let formModal;
    let formEvent = {
        "incidentId": group,
        "heroId": 1,
        "longitude": -74.0060152,
        "latitude": 40.7127281,
        "status": "pending",
    }
    async function submitForm(){
        // retrieve the value of "group" bound to radio buttons and assign it to the formEvent object incidentId property
        formEvent.incidentId = group;
        formEvent.latitude = ltClick;
        formEvent.longitude = lgClick;
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
    let data = [];
    let eventId = activeMapItem;
    let radioEvent = {
        "incidentId": eventId,
        "heroId": 1,
        "city": "Gotham",
        "longitude": -74.0060152,
        "latitude": 40.7127281,
        "status": "pending",
    }
    const toRadians = (degrees) => {
        return (degrees * Math.PI) / 180;
    };

    onMount(async () => {

        async function submitRadio() {
            // retrieve the value of "group" bound to radio buttons and assign it to the formEvent object incidentId property
            radioEvent.incidentId = eventId;
            try {
                const response = await fetch('http://localhost:5039/api/event/add', {
                    method: 'POST',
                    headers: {
                        'Allow-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(radioEvent)
                });
                console.log(data);
            } catch (e) {
                console.log(e);
            }
        }


        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_ACCESS_TOKEN;

        // Create the map
        map = new mapboxgl.Map({
            accessToken: import.meta.env.VITE_MAPBOX_API_ACCESS_TOKEN,
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [1.0898638503974212, 49.43746834326285],
            zoom: 7
        });

        map.on('load', function () {

            map.addControl(
                new MapboxGeocoder({
                    accessToken: import.meta.env.VITE_MAPBOX_API_ACCESS_TOKEN,
                    mapboxgl: mapboxgl,
                    marker: {
                        color: 'orange'
                    },
                    flyTo: {
                        zoom: 10,
                    },
                })
            );

            // add markers for each values in the arrays "latitude" and "longitude"
            for (let i = 0; i < latitude.length; i++) {
                new mapboxgl.Marker({color: 'red'})
                    .setLngLat([longitude[i], latitude[i]])
                    .addTo(map);
            }


            // add markers for each values in the arrays "latHero" and "longHero"
            for (let i = 0; i < latHero.length; i++) {
                new mapboxgl.Marker({color: 'yellow'})
                    .setLngLat([longHero[i], latHero[i]])
                    .addTo(map);
            }

            // display point  for each values in the arrays "latHero" and "longHero"
            for (let i = 0; i < latHero.length; i++) {
                new mapboxgl.Marker({color: 'yellow'})
                    .setLngLat([longHero[i], latHero[i]])
                    .addTo(map);
            }

            // add control to navigate to user location
            map.addControl(
                new mapboxgl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true
                    },
                    trackUserLocation: true
                })
            );

            var marker = new mapboxgl.Marker();
            const popup = new mapboxgl.Popup({closeOnClick: true})

            let eventId;

            function add_marker(event) {
                formModal = true;
                var coordinates = event.lngLat;
                lgClick = coordinates.lng;
                ltClick = coordinates.lat;

                marker.setLngLat(coordinates).addTo(map);

            }


            // add marker on right click
            map.on('contextmenu', add_marker);

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
                                        // coordinates from click event
                                        'coordinates': [0, 0],
                                    },
                                    'properties': {
                                        'title': 'Event',
                                        'icon': 'monument'
                                    },
                                },
                                {
                                    'type': 'Feature',
                                    'geometry': {
                                        'type': 'Point',
                                        'coordinates': [0, 0],
                                    },
                                    'properties': {
                                        'title': 'Event',
                                        'icon': 'harbor'
                                    }

                                }
                            ]
                        }
                    });
                    map.addLayer({
                        'id': 'points',
                        'type': 'symbol',
                        'source': 'points',
                        'layout': {
                            // get the icon name from the source's "icon" property
                            // concatenate the name to get an icon from the style's sprite sheet
                            'icon-image': ['concat', ['get', 'icon'], '-15'],
                            // get the title name from the source's "title" property
                            'text-field': ['get', 'title'],
                            'text-font': [
                                'Open Sans Semibold',
                                'Arial Unicode MS Bold'
                            ],
                            'text-offset': [0, 0.6],
                            'text-anchor': 'top'
                        }
                    });
                    map.on('click', function (e) {
                        var features = map.queryRenderedFeatures(e.point, {
                            layers: ['points']
                        });
                        if (!features.length) {
                            return;
                        }
                        var feature = features[0];
                        // Populate the popup and set its coordinates
                        // based on the feature found.
                        var popup = new mapboxgl.Popup()
                            .setLngLat(feature.geometry.coordinates)
                            .setHTML(feature.properties.description)
                            .addTo(map);
                    });
                    // Change the cursor to a pointer when the mouse is over the places layer.
                    map.on('mouseenter', 'places', function () {
                        map.getCanvas().style.cursor = 'pointer';
                    });

                    // Change it back to a pointer when it leaves.
                    map.on('mouseleave', 'places', function () {
                        map.getCanvas().style.cursor = '';
                    });
                });

        });
    });
    // Update map center when active list item is updated via list
    const unsubscribeActiveMapItem = activeMapItem.subscribe(newActiveMapItem => {
        if (map) {
            map.flyTo({
                center: listItems[newActiveMapItem].coordinates
            });
        }
    });
    // add markers for each values in the arrays "latitude" and "longitude"
    for (let i = 0; i < latitude.length; i++) {
        new mapboxgl.Marker({color: 'red'})
            .setLngLat([longitude[i], latitude[i]])
            .addTo(map);
    }


    // add markers for each values in the arrays "latHero" and "longHero"
    for (let i = 0; i < latHero.length; i++) {
        new mapboxgl.Marker({color: 'yellow'})
            .setLngLat([longHero[i], latHero[i]])
            .addTo(map);
    }

    //
</script>

<Modal autoclose={false} bind:open={formModal} class="w-full" id="form-modal" size="xl">
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
                <input  bind:value={lgClick}   class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                         id="grid-long"  type="text" required>
            </div>
            <div class="w-full mb-12 md:mb-0">
                <label class="block uppercase tracking-wide text-gray-700  dark:text-gray-100 text-xs font-bold mb-2" for="grid-lat">
                    Latitude
                </label>
                <input bind:value={ltClick}
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-lat"  type="text" required>
            </div>
            <button class="w-full" on:click={submitForm} type="submit">Ajouter</button>
        </form>
    </div>
</Modal>


<div id="map"></div>
