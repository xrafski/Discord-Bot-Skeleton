const axios = require('axios');

function isValidJSON(jsonString) {
    try {
        JSON.parse(jsonString);
        return true;
    } catch (error) {
        return false;
    }
}

function apiCall(url, method, data) {
    return new Promise((resolve, reject) => {

        // Validate JSON input parameter.
        if (isValidJSON(data) === false) reject(new Error('Data must be a valid JSON string.'));

        // Make options object for Axios to handle requests.
        const options = {
            baseURL: 'http://localhost:1995/v1/',
            method,
            url,
            data: data ? data : undefined,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'tea-discord-bot',
                'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjg0NzQ4OTkzfQ.DR2Tlj1qtmxL799H0GS_-G7iuQItZQWKitgd8wo-M54',
            },
        };

        // Use Axios to create the http request.
        axios(options)
            .then(response => resolve(response.data))
            .catch(reject);
    });
}

module.exports.apiCall = apiCall;