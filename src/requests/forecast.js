const axios = require('axios');
const LANG = 'en';
async function fetchForecast(location, forecast_days) {
    return await axios({
        url: `${process.env.URL}/forecast.json`,
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

                // hourTime: forecastDay.hour.time,
                // hourTemperatureC: forecastDay.hour.temp_c,
                // hourTemperatureF: forecastDay.hour.temp_f,
                // hourCondition: forecastDay.hour.condition.text,
                // hourWindDirection: forecastDay.hour.wind_dir,
                // hourWindDegree: forecastDay.hour.wind_degree,
                // hourWindSpeedMPH: forecastDay.hour.wind_mph,
                // hourWindSpeedKPH: forecastDay.hour.wind_kph,
                // hourWindChillC: forecastDay.hour.windchill_c,
                // hourWindChillF: forecastDay.hour.windchill_f,
                // hourHeatIndexC: forecastDay.hour.heatindex_c,
                // hourHeatIndexF: forecastDay.hour.heatindex_f,
                // hourWillItRain: forecastDay.hour.will_it_rain,
                // hourWillItSnow: forecastDay.hour.will_it_snow,



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