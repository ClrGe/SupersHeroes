import Axios from "axios"
import {env} from "$env/dynamic/public";
// POST Hero to http://localhost:5039/api/Hero/add
export async function load(hero) {
    let url = "http://localhost:5039/api/Hero"
    try {
        const resGet = await Axios.get(url , {
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
        const heros = await resGet.json();
        console.log(heros)
        // add headers to prevent CORS error
        const res = await Axios.post(url +"/add", hero, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        });

    } catch (e) {
        return null;
    }
}