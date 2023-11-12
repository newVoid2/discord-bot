const axios = require('axios');
const LANG = 'en';
async function fetchForecast(location, forecast_days) {
    return await axios({
        url: `https://api.weatherapi.com/v1/forecast.json`,
        method: 'get',
        params: {
            q: location,
            days: forecast_days,
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
                date: forecastDay.date,

                temperatureMinC: forecastDay.day.mintemp_c,
                temperatureMaxC: forecastDay.day.maxtemp_c,
                temperatureMinF: forecastDay.day.mintemp_f,
                temperatureMaxF: forecastDay.day.maxtemp_f,
                windMaxMPH: forecastDay.day.maxwind_mph,
                windMaxKPH: forecastDay.day.maxwind_kph,
                chanceOfRain: forecastDay.day.daily_chance_of_rain,
                chanceOfSnow: forecastDay.day.daily_chance_of_snow,
                weatherCondition: forecastDay.day.condition.text,

                sunriseTime: forecastDay.astro.sunrise,
                sunsetTime: forecastDay.astro.sunset,
                moonriseTime: forecastDay.astro.moonrise,
                moonsetTime: forecastDay.astro.moonset,

            };
        });

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
    fetchForecast,
}