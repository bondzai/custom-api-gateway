require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3358;
const apiKey = process.env.WAKATIME_APIKEY;

const apiUrl = 'https://wakatime.com/api/v1/users/current/stats/all_time';

const fetchWakatimeData = async () => {
    try {
        const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': `Basic ${Buffer.from(apiKey).toString('base64')}`
            }
        });

        const { 
            human_readable_range,
            days_including_holidays, 
            human_readable_total_including_other_language,
            operating_systems,
            editors, 
            languages,
            best_day,
        } = response.data.data;

        return {
            human_readable_range,
            days_including_holidays,
            human_readable_total_including_other_language,
            operating_systems,
            editors, 
            languages,
            best_day,
        };

    } catch (error) {
        console.error('Error fetching Wakatime data:', error);
        throw new Error('An error occurred while fetching data.');
    }
};

app.get('/wakatime', async (req, res) => {
    try {
        const wakatimeData = await fetchWakatimeData();
        res.json(wakatimeData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
