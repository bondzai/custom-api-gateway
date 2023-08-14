require('dotenv').config();
const express = require('express');
const axios = require('axios');
const Redis = require('ioredis'); // Import the Redis library
const app = express();
const port = process.env.PORT || 3358;
const apiKey = process.env.WAKATIME_APIKEY;
const apiUrl = process.env.WAKATIME_URL;

// Create a Redis client
const redisClient = new Redis(process.env.REDIS_URL); // Use the Redis URL

const fetchWakatimeData = async () => {
    try {
        const cachedData = await redisClient.get('wakatimeData'); // Check if data exists in Redis cache
        if (cachedData) {
            return JSON.parse(cachedData);
        } else {
            const response = await axios.get(apiUrl, {
                headers: {
                    'Authorization': `Basic ${Buffer.from(apiKey).toString('base64')}`
                }
            });

            const wakatimeData = {
                human_readable_range: response.data.data.human_readable_range,
                days_including_holidays: response.data.data.days_including_holidays,
                human_readable_total_including_other_language: response.data.data.human_readable_total_including_other_language,
                operating_systems: response.data.data.operating_systems,
                editors: response.data.data.editors,
                languages: response.data.data.languages,
                best_day: response.data.data.best_day
            };

            // Store fetched data in Redis cache
            await redisClient.set('wakatimeData', JSON.stringify(wakatimeData));
            return wakatimeData;
        }
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
