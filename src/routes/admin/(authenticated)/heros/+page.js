import Axios from "axios"
// POST Hero to http://localhost:5039/api/Hero/add
export async function load(hero) {
    try {
        // add headers to prevent CORS error
        const res = await Axios.post("http://localhost:5039/api/Hero/add", hero, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        });

    } catch (e) {
        return null;
    }
}