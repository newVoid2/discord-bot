const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {fetchForecast} = require('../requests/forecast');

const data = new SlashCommandBuilder()
.setName('forecast')
.setDescription('Replies with the weather forecast')
.addStringOption((option) => {
    return option
        .setName('location')
        .setDescription('The location can be a city, zip/postal code, or a latitude and longitude.')
        .setRequired(true);
})
.addStringOption((option) => {
    return option
        .setName('days')
        .setDescription('The number of forecast days of your location, maximum 3 days.')
        .setRequired(true);
})
.addStringOption((option) => {
    return option
        .setName('units')
        .setDescription('The unit system of the results: either "metrics or "imperial.')
        .setRequired(false)
        .addChoices(
            {name: 'Metric', value: 'metric'},
            {name: 'Imperial', value: 'imperial'},
        );
});

async function execute(interaction) {
    await interaction.deferReply();

    const location = interaction.options.getString('location');
    const forecast_days = interaction.options.getString('days');
    const units = interaction.options.getString('units') || 'imperial';
    const isMetric = units === 'imperial';

    try {
        const {locationName, weatherData} = await fetchForecast(location, Number(forecast_days));
        const embed = new EmbedBuilder()
        .setColor(0x3f704d)
        .setTitle(`Weather forecast for ${locationName}`)
        .setDescription(`Using the ${units} system.`)
        .setTimestamp()
        .setFooter({
            text: 'Powered by the weatherapi.com API',
        });
    
        for (const day of weatherData) {
            const temperatureMin = isMetric ? day.temperatureMinF : day.temperatureMinC;
            const temperatureMax = isMetric ? day.temperatureMaxF : day.temperatureMaxC;
            const condition = day.weatherCondition;
            const windSpeedMax = isMetric ? day.windMaxMPH : day.windMaxKPH;
            const chanceOfRain = day.chanceOfRain;
            const chanceOfSnow = day.chanceOfSnow;
    
            embed.addFields({
                name: day.date,
                value: `${isMetric ? `⬇️ Low: ${temperatureMin} F, ⬆️ High: ${temperatureMax} F` : `⬇️ Low: ${temperatureMin}°C, ⬆️ High: ${temperatureMax}°C`}\n🛰️ Weather condition: ${condition}\n🍃 The maximum wind speed is ${isMetric ? `${windSpeedMax} mph` : `${windSpeedMax} kph`}\n☔ The chance of it raining today is ${chanceOfRain}%\n☃️ The chance of it snowing today is ${chanceOfSnow}%`
            })
        }
    
        await interaction.editReply({
            embeds: [embed],
        });
    } catch(error) {
        await interaction.editReply(error);
    }
   
}

module.exports = {
    data,
    execute,
}