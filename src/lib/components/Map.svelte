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

            // add source and layer for the hero markers with values from the arrays "latHero" and "longHero"
            map.addSource('heroes', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    properties: {
                        // display values from the heroesList object looking for the incidentId matching the eventId
                        title: '',
                        description: 'Heroes',
                        'marker-color': '#3bb2d0',
                        'marker-size': 'large',
                        'marker-symbol': 'rocket'
                    },
                    features: latHero.map((lat, i) => ({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [longHero[i], lat]
                        }
                    }))
                }
            });

            map.addLayer({
                id: 'heroes',
                type: 'symbol',
                source: 'heroes',
                layout: {
                    'icon-image': 'rocket-15',
                    'icon-allow-overlap': true
                }
            });



            // add source and layer for the incident markers with values from the arrays "latitude" and "longitude"
            map.addSource('incidents', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    properties: {
                        title: 'Incidents',
                        description: 'Incidents',
                        'marker-color': '#3bb2d0',
                        'marker-size': 'large',
                        'marker-symbol': 'rocket'
                    },
                    features: latitude.map((lat, i) => ({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [longitude[i], lat]
                        }
                    }))
                }
            });

            map.addLayer({
                id: 'incidents',
                type: 'symbol',
                source: 'incidents',
                layout: {
                    'icon-image': 'rocket-15',
                    'icon-allow-overlap': true
                }
            });

            // add popup source and layer for the incident markers
            map.addSource('incidents-popup', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    properties: {
                        title: 'Incidents',
                        description: 'Incidents',
                        'marker-color': '#3bb2d0',
                        'marker-size': 'large',
                        'marker-symbol': 'rocket'
                    },
                    features: latitude.map((lat, i) => ({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [longitude[i], lat]
                        }
                    }))
                }
            });
            // add popup layer for the incident markers
            map.addLayer({
                id: 'incidents-popup',
                type: 'symbol',
                source: 'incidents-popup',
                layout: {
                    'icon-image': 'rocket-15',
                    'icon-allow-overlap': true
                }
            });




            });

        map.on('mouseenter', 'incidents', function (e) {
            // display a 50km radius circle around the marker when clicking it
            map.addSource('circle', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: e.features[0].geometry.coordinates
                    }
                }
            });
            map.flyTo({
                center: e.features[0].geometry.coordinates,
                zoom: 10
            });
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
            const popup = new mapboxgl.Popup({closeOnClick: true})
            const detailsMarkerPopup = new mapboxgl.Popup({closeOnClick: true})

            let eventId;

            function add_marker(event) {
                var coordinates = event.lngLat;
                formModal = true;
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
                    // display a 50km radius circle around the marker when clicking it
                    map.on('click', 'points', function (e) {
                        var coordinates = e.features[0].geometry.coordinates.slice();
                        var description = e.features[0].properties.description;
                        // Ensure that if the map is zoomed out such that multiple
                        // copies of the feature are visible, the popup appears
                        // over the copy being pointed to.
                        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                        }
                        new mapboxgl.Popup()
                            .setLngLat(coordinates)
                            .setHTML(description)
                            .addTo(map);
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
