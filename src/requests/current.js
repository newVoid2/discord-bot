const axios = require('axios');
const LANG = 'en';
async function fetchCurrent(location) {
    return await axios({
        url: `https://api.weatherapi.com/v1/current.json`,
        method: 'get',
        params: {
            q: location,
            key: process.env.WEATHER_API_KEY,
            lang: LANG
        },
        responseType: 'json',
    })
    .then((response) => {
        const city = response.data.location.name;
        const region = response.data.location.region;
        const country = response.data.location.country;
        const locationName = `${city}, ${region}, ${country}`;

        const weatherData = response.data.current;

        return {
            locationName,
            weatherData,
        };
    })
    .catch((error) => {
        console.error(error);
        throw new Error(`Error fetching forecast for ${locationName}.`)
    })
}

module.exports = {
    fetchCurrent,
}