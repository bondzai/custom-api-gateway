require('dotenv').config()
const axios = require('axios');
const crypto = require('crypto');

const API_KEY = process.env.PIONEX_APIKEY;
const API_SECRET = process.env.PIONEX_APISECRET;

const baseURL = 'https://api.pionex.com';

const getBalance = async () => {
    const timestamp = Date.now();
    const queryParams = {
        timestamp,
    };

    const sortedParams = Object.keys(queryParams)
        .sort()
        .map((key) => `${key}=${queryParams[key]}`)
        .join('&');

    const path = '/api/v1/account/balances';
    const pathURL = `${path}?${sortedParams}`;
    const method = 'GET';
    const message = `${method}${pathURL}`;

    const signature = crypto
        .createHmac('sha256', API_SECRET)
        .update(message)
        .digest('hex');

    const headers = {
        'PIONEX-KEY': API_KEY,
        'PIONEX-SIGNATURE': signature,
    };

    const url = `${baseURL}${pathURL}`;
    const response = await axios.get(url, { headers });

    console.log('*****')
    console.log(response.data);
    console.log('*****')
    console.log(response.data.data);

    return response.data;
};

getBalance().catch(console.error);
