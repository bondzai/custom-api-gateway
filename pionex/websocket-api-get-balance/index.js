require('dotenv').config()
const WebSocket = require('ws');
const crypto = require('crypto');

const API_KEY = process.env.PIONEX_APIKEY;
const API_SECRET = process.env.PIONEX_APISECRET;

const websocketURL = 'wss://ws.pionex.com/ws';

const timestamp = Date.now();
const queryParams = {
    key: API_KEY,
    timestamp: timestamp.toString(), // timestamp should be a string
};

const sortedParams = Object.keys(queryParams)
    .sort()
    .map((key) => `${key}=${queryParams[key]}`)
    .join('&');

const path = '/ws';
const pathURL = `${path}?${sortedParams}`;
const message = `${pathURL}websocket_auth`;

const signature = crypto
    .createHmac('sha256', API_SECRET)
    .update(message)
    .digest('hex');

const authenticatedURL = `${websocketURL}?${sortedParams}&signature=${signature}`;

const subscribePayload = {
    op: 'SUBSCRIBE',
    topic: 'BALANCE',
};


const ws = new WebSocket(authenticatedURL);

ws.on('open', () => {
    console.log('WebSocket connection opened');
    ws.send(JSON.stringify(subscribePayload));
});

ws.on('message', (message) => {
    const response = JSON.parse(message);
    if (response.op === 'PING') {
        ws.send(JSON.stringify({ op: 'PONG', timestamp: Date.now() }));
    } else {
        console.log('Message received:', response);
        if (response.topic === 'BALANCE') {
            console.log('Balance update received:', response.data);
        }
    }
});


ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});

ws.on('close', () => {
    console.log('WebSocket connection closed');
});
