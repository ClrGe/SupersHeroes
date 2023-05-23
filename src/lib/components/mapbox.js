// @ts-ignore
import mapbox from "mapbox-gl";
// https://docs.mapbox.com/help/glossary/access-token/
mapbox.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const keyApp = {};

export { mapbox, keyApp };