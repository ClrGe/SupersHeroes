<script>
        import { onMount, setContext } from "svelte";
        import { mapbox, keyApp } from "./mapbox.js";

        setContext(keyApp,{
                getMap: () => map
        });

        export let lat;
        export let lon;
        export let zoom;
        export let style;
        let container;
        let map;
        let viewState = {
                longitude: -118.2443409,
                latitude: 34.0544779,
                zoom: 2,
                pitch: 0,
                bearing: 0,
        };

        onMount(() => {

                map = new mapbox.Map({
                        container,
                        style,
                        hash: true,
                        zoom,
                        attributionControl: false
                });


        });
</script>

<style>
        #map {
                position: absolute;
                top: 0;
                bottom: 0;
                width: 100vw;
                height: 100vh;
        }
</style>

<div id="map" bind:this={container}>
        {#if map}
                <slot />
        {/if}
</div>