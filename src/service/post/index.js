

import api from "../axios";

import md5 from 'crypto-js/md5'; 

const generateAuthString = () => {
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
    return `${"Valantis"}_${timestamp}`;
};
  
const calculateMD5 = (str) => {
    return md5(str).toString();
};

const authString = generateAuthString();
const authHeader = { 'X-Auth': calculateMD5(authString) };


const headers = {
    ...authHeader,
    'Content-Type': 'application/json',
}



const getAPI = {
    getID: async (data) => api.post(" ", data, { headers }),
    getData: async (data) => api.post(" ", data, { headers }),
    getField: async (data) => api.post(" ", data, { headers }),
    getFilter: async (data) => api.post(" ", data, { headers }),
}

export default getAPI;