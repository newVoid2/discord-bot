const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {fetchHourlyForecast} = require('../requests/hourlyforecast');
const Day = 1;

const data = new SlashCommandBuilder()
.setName('hourly')
.setDescription('Replies with the weather forecast for each hour of today.')
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
        const {locationName, weatherData} = await fetchHourlyForecast(location, Day);
        const embed = new EmbedBuilder()
        .setColor(0x3f704d)
        .setTitle(`Weather forecast for ${locationName}`)
        .setDescription(`Using the ${units} system.`)
        .setTimestamp()
        .setFooter({
            text: 'Powered by the weatherapi.com API',
        });
    
        for (const day of weatherData) {
            for (const hour of day.hours) {
                const temperature = isMetric ? hour.hourTemperatureF : hour.hourTemperatureC;
                const windChill = isMetric ? hour.hourWindChillF : hour.hourWindChillC;
                const condition = hour.hourCondition;
                const heatIndex =  isMetric ? hour.hourHeatIndexF : hour.hourHeatIndexC;
                const windSpeedMax = isMetric ? hour.hourWindSpeedMPH : hour.hourWindSpeedKPH;
                const windDirection = hour.hourWindDirection;
                const windDegree = hour.hourWindDegree;
        
                embed.addFields({
                    name: hour.hourTime,
                    value: `${isMetric ? `🌡️ Temperature: ${temperature} F` : `🌡️ Temperature: ${temperature}°C`}\n🛰️ Weather condition: ${condition}\n🍃 The maximum wind speed for this hour is ${isMetric ? `${windSpeedMax} mph` : `${windSpeedMax} kph`} at ${windDegree}° ${windDirection}\n💨 The wind chill for this hour is ${isMetric ? `${windChill} F` : `${windChill}°C`} \nThe heat index for this hour is ${heatIndex}`,
                })
            }
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