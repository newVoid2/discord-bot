const axios = require('axios');
const URL = 'https://api.weatherapi.com/v1';
const FORECAST_DAYS = 3;
const LANG = 'fr';
async function fetchForecast(location) {
    return await axios({
        url: `${URL}/forecast.json`,
        method: 'get',
        params: {
            q: location,
            days: FORECAST_DAYS,
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

        const weatherData = response.data.forecast.forecastday.map((forecastDay) => {
            return {
                data: forecastDay.date,

                temperatureMinC: forecastDay.day.mintemp_c,
                temperatureMaxC: forecastDay.day.maxtemp_c,
                temperatureMinF: forecastDay.day.mintemp_f,
                temperatureMaxF: forecastDay.day.maxtemp_f,

                condition: forecastDay.day.condition.text,
                conditionIcon: forecastDay.day.condition.icon,
            };
        });

        return {
            locationName,
            weatherData,
        };
    })
    .catch((error) => {
        console.error(error);
    })
}

module.exports = {
    fetchForecast,
}