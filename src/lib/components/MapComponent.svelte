<script>
    import { Map, Geocoder, Marker, controls } from '@beyonk/svelte-mapbox'

    const { GeolocateControl, NavigationControl, ScaleControl } = controls
    let mapComponent;

    // Usage of methods like setCenter and flyto

    // Define this to handle `eventname` events - see [GeoLocate Events](https://docs.mapbox.com/mapbox-gl-js/api/markers/#geolocatecontrol-events)
    function eventHandler (e) {
        const data = e.detail
        // do something with `data`, it's the result returned from the mapbox event
    }
    const AccessToken = import.meta.env.VITE_MAPBOX_API_ACCESS_TOKEN;


</script>
<Map>
        accessToken ="pk.eyJ1IjoiY2xhaXJnZSIsImEiOiJjbGdxNmtiNTkwNmRmM2pzM3drbnA5a3h5In0.akdkLqiIt0WArmknZwTNCw";
bind:this={mapComponent} // Get reference to your map component to use methods
on:recentre={e => console.log(e.detail.center.lat, e.detail.center.lng) } // recentre events
options={{ scrollZoom: false }} // // add arbitrary options to the map from the mapbox api
>
<Marker lat={-79.4512} lng={43.6568} color="rgb(255,255,255)" label="some marker label" popupClassName="class-name" /> // built in Marker component
<GeolocateControl options={{ some: 'control-option' }} on:eventname={eventHandler} />
<ScaleControl />

</Map>

<style>
    :global(.mapboxgl-map) {
        height: 200px;
    }
</style>