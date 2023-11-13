const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {fetchCurrent} = require('../requests/current');

const data = new SlashCommandBuilder()
.setName('current')
.setDescription('Replies with the current weather.')
.addStringOption((option) => {
    return option
        .setName('location')
        .setDescription('The location can be a city, zip/postal code, or a latitude and longitude.')
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
    const units = interaction.options.getString('units') || 'imperial';
    const isMetric = units === 'imperial';

    try {
        const {locationName, weatherData} = await fetchCurrent(location);
        const embed = new EmbedBuilder()
        .setColor(0x3f704d)
        .setTitle(`Current weather for ${locationName}`)
        .setDescription(`Using the ${units} system.`)
        .setTimestamp()
        .setFooter({
            text: 'Powered by the weatherapi.com API',
        });

        const temperature = isMetric ? weatherData.temp_f : weatherData.temp_c;
        const feelsLike = isMetric ? weatherData.feelslike_f : weatherData.feelslike_c;
        const condition = weatherData.condition.text;
        const conditionIcon = weatherData.condition.icon;
        const windSpeed = isMetric ? weatherData.wind_mph : weatherData.wind_kph;
        const windDirection = weatherData.wind_dir;
        const windDegree = weatherData.wind_dir;
        const humidity = weatherData.humidity;
        const pressure = weatherData.pressure_mb;
        const lastTime = weatherData.last_updated;

        embed.addFields({
            name: lastTime,
            value: `${isMetric ? `🌡️ Temperature: ${temperature} F` : `🌡️ Temperature: ${temperature}°C`}\n🛰️ Weather condition: ${condition}\n🍃 The wind speed is ${isMetric ? `${windSpeed} mph` : `${windSpeed} kph`} at ${windDegree}° ${windDirection}\n⛅ The temperature feels like ${isMetric ? `${feelsLike} F` : `${feelsLike}°C`}\n☁️ The atmospheric pressure: ${pressure} millibars\n🌁 The humidity: ${humidity}`,
        })
    
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