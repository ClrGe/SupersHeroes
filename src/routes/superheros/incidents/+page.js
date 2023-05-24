import Axios from "axios"
import {env} from "$env/dynamic/public";
// POST Incident to http://localhost:5039/api/Event
export async function load(incident) {
    let url = "http://localhost:5039/api/Event/add"
    let getIncidents = [];
    let PostIncident = [];

    try {
        // add headers to prevent CORS error
        const res = await Axios.post(url, incident, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        });

    } catch (e) {
        return null;
    }
}