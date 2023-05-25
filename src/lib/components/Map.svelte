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

    onMount(async () => {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_ACCESS_TOKEN;

        // Create the map
        map = new mapboxgl.Map({
            accessToken: import.meta.env.VITE_MAPBOX_API_ACCESS_TOKEN,
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            // center: listItems[0].coordinates,
            center: [-79.4512, 43.6568],
            zoom: 13
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
                new mapboxgl.Marker()
                    .setLngLat([longitude[i], latitude[i]])
                    .addTo(map);
            }


            var marker = new mapboxgl.Marker();
            const popup = new mapboxgl.Popup({closeOnClick: false})

            function add_marker(event) {
                var coordinates = event.lngLat;
                console.log('Lng: ' + coordinates.lng + '. Lat: ' + coordinates.lat);
                marker.setLngLat(coordinates).addTo(map);
                popup.setLngLat(coordinates).setHTML(coordinates.lng, ' ', coordinates.lat).addTo(map);
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
                            // e.point is the x, y coordinates of the mousemove event relative
                            // to the top-left corner of the map
                            JSON.stringify(e.point) +
                            '<br />' +
                            // e.lngLat is the longitude, latitude geographical position of the event
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


//                     mapRef.loadImage(
//                         'https://cdn3.iconfinder.com/data/icons/funky/136/Fire-512.png',
//                         (error, image) => {
//                             if (error) throw error;
//
// // Add the image to the map style.
//                             mapRef.addImage('fire', image);
//                         }
//                     );
//                     // Add markers to map
//                     mapRef.addLayer({
//                         id: 'places',
//                         type: 'symbol',
//                         source: {
//                             type: 'geojson',
//                             data: {
//                                 type: 'FeatureCollection',
//                                 features: listItems.map(generateFeature)
//                             }
//                         },
//                         layout: {
//                             'icon-image': 'fire',
//                             'icon-size': 0.1,
//                             'icon-allow-overlap': true
//                         }
//                     });
//
//                     // When clicking on a map marker
//                     mapRef.on('click', 'places', function (e) {
//                         const coordinates = e.features[0].geometry.coordinates.slice();
//                         const description = e.features[0].properties.description;
//
// // Ensure that if the map is zoomed out such that multiple
// // copies of the feature are visible, the popup appears
// // over the copy being pointed to.
//                         while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
//                             coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
//                         }
//
//                         // Show popup
//                         new mapboxgl.Popup()
//                             .setLngLat(coordinates)
//                             .setHTML(description)
//                             .addTo(mapRef);
//                     });
//
//                     // Change the cursor to a pointer when the mouse is over the places layer.
//                     mapRef.on('mouseenter', 'places', function () {
//                         mapRef.getCanvas().style.cursor = 'pointer';
//                     });
//
//                     // Change it back to a pointer when it leaves.
//                     mapRef.on('mouseleave', 'places', function () {
//                         mapRef.getCanvas().style.cursor = '';
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
