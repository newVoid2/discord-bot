const axios = require('axios');
const LANG = 'en';
async function fetchHourlyForecast(location, forecast_days) {
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
                hours: forecastDay.hour.map((hour) => {
                    return {
                        hourTime: hour.time,
                        hourTemperatureC: hour.temp_c,
                        hourTemperatureF: hour.temp_f,
                        hourCondition: hour.condition.text,
                        hourWindDirection: hour.wind_dir,
                        hourWindDegree: hour.wind_degree,
                        hourWindSpeedMPH: hour.wind_mph,
                        hourWindSpeedKPH: hour.wind_kph,
                        hourWindChillC: hour.windchill_c,
                        hourWindChillF: hour.windchill_f,
                        hourHeatIndexC: hour.heatindex_c,
                        hourHeatIndexF: hour.heatindex_f,
                    }
                }),
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
    fetchHourlyForecast,
}