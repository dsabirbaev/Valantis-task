

import axios from "axios";




const api = axios.create({
    baseURL: "https://api.valantis.store:41000/",
});


export default api;