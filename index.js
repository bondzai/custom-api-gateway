require('dotenv').config()
const axios = require('axios');

const apiKey = process.env.WAKATIME_APIKEY;
// const apiUrl = 'https://wakatime.com/api/v1/users/current/stats/last_7_days';
// const apiUrl = 'https://wakatime.com/api/v1/users/current/all_time_since_today';
// const apiUrl = 'https://wakatime.com/api/v1/leaders';
const apiUrl = 'https://wakatime.com/api/v1/users/current/stats/all_time';

const getData = (async() =>{
    return axios.get(apiUrl,{
        headers: {
            'Authorization': `Basic ${Buffer.from(apiKey).toString('base64')}`
        }
    })
});

const main = (async() => {
    let data = await getData()
    console.log(data.data)
});

main()