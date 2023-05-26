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

    let map;
    export let longitude;
    export let latitude;

    export let latHero;
    export let longHero;

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

    onMount(async () => {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_ACCESS_TOKEN;

        // Create the map
        map = new mapboxgl.Map({
            accessToken: import.meta.env.VITE_MAPBOX_API_ACCESS_TOKEN,
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            // center: listItems[0].coordinates,
            center: [-74.0060152, 40.7127281],
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
            const popup = new mapboxgl.Popup({closeOnClick: false})
            let eventId;
            let data = [];
            let radioEvent = {
                "incidentId": eventId,
                "heroId": 1,
                "city": "Gotham",
                "longitude": -74.0060152,
                "latitude": 40.7127281,
                "status": "pending",
            }
            async function submitRadio(){
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
            function add_marker(event) {
                var coordinates = event.lngLat;
                marker.setLngLat(coordinates).addTo(map);
                popup.setLngLat(coordinates).setHTML(
                    '                <div class="w-full overflow-hidden rounded-lg shadow-xs flex items-center ">\n' +
                    '                    <form class="w-full p-5" id="form-event">\n' +
                    '                        <div class="flex flex-wrap -mx-3 mb-6">\n' +
                    '                            <label class="block uppercase tracking-wide text-gray-700  dark:text-gray-100 text-xs font-bold mb-2">\n' +
                    '                                Type d\'incident\n' +
                    '                            </label>\n' +
                    '                            <div>\n' +
                    '                                <div class="flex items-center mb-2">\n' +
                    '                                    <input type="radio" bind:eventId class="text-gray-100 mr-2" id="incendies" value={1} >\n' +
                    '                                        Incendie\n' +
                    '                                    </input>\n' +
                    '                                </div>\n' +
                    '                                <div class="flex items-center mb-2">\n' +
                    '                                    <input type="radio" bind:eventId class="text-gray-100 mr-2" id="route" value={2} >\n' +
                    '                                        Accident routier\n' +
                    '                                    </input>\n' +
                    '                                </div>\n' +
                    '                                <div class="flex items-center mb-2">\n' +
                    '                                    <input type="radio" bind:eventId class="text-gray-100 mr-2" id="fleuve" value={3} >\n' +
                    '                                        Accident fluvial\n' +
                    '                                    </input>\n' +
                    '                                </div>\n' +
                    '                                <div class="flex items-center">\n' +
                    '                                    <input type="radio" bind:eventId class="text-gray-100 mr-2" id="air" value={4} >\n' +
                    '                                        Accident aérien\n' +
                    '                                    </input>\n' +
                    '                                </div>\n' +
                    '                                <div class="flex items-center">\n' +
                    '                                    <input type="radio" bind:eventId class="text-gray-100 mr-2" id="eboulement" value={5}>\n' +
                    '                                        Éboulement\n' +
                    '                                    </input>\n' +
                    '                                </div>\n' +
                    '                                <div class="flex items-center mb-2">\n' +
                    '                                    <input type="radio" bind:eventId class="text-gray-100 mr-2" id="serpents" value={6} >\n' +
                    '                                        Invasion de serpents\n' +
                    '                                    </input>\n' +
                    '                                </div>\n' +
                    '                                <div class="flex items-center mb-2">\n' +
                    '                                    <input type="radio" bind:eventId class="text-gray-100 mr-2" id="gaz" value={7} >\n' +
                    '                                        Fuite de gaz\n' +
                    '                                    </input>\n' +
                    '                                </div>\n' +
                    '                                <div class="flex items-center mb-2">\n' +
                    '                                    <input type="radio" bind:eventId class="text-gray-100 mr-2" id="manifestation" value={8}>\n' +
                    '                                        Manifestation\n' +
                    '                                    </input>\n' +
                    '                                </div>\n' +
                    '                                <div class="flex items-center">\n' +
                    '                                    <input type="radio" bind:eventId class="text-gray-100 mr-2" id="braquage" value={9} >\n' +
                    '                                        Braquage\n' +
                    '                                    </input>\n' +
                    '                                </div>\n' +
                    '                                <div class="flex items-center">\n' +
                    '                                    <input type="radio" bind:eventId class="text-gray-100 mr-2" id="evasion" value={10} >\n' +
                    '                                        Évasion d\'un prisonnier\n' +
                    '                                    </input>\n' +
                    '                                </div>\n' +
                    '                            </div>\n' +
                    '                        </div>\n' +
                    '                        </div>\n' +
                    '                        <button class="w-full" on:click={submitRadio} type="submit">Ajouter</button>\n' +
                    '                    </form>\n' +
                    '                </div>\n').addTo(map);
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
                    // display longitude and latitude when clicking on the map
                    map.on('click', function (e) {
                        document.getElementById('info').innerHTML =
                            JSON.stringify(e.point) +
                            '<br />' +
                            JSON.stringify(e.lngLat.wrap());
                    });

                    // display popup when clicking a marker
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

    // Remove listener on unmount
    onDestroy(unsubscribeActiveMapItem);
</script>


<div id="map"></div>
