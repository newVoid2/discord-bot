const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

const data = new SlashCommandBuilder()
.setName('welcome')
.setDescription('Replies with the the introduction!');

async function execute(interaction) {
    await interaction.deferReply();

    const embed = new EmbedBuilder()
    .setColor(0x3f704d)
    .setTitle(`Welcome to the weather bot`)
    .setDescription(`The weather bot has 4 commands to get various weather conditions of your location.`)
    .addFields({
        name: '/current',
        value: '🌎 The current command get the current weather condition',
    },
    {
        name: '/astro',
        value: '🌌 The astro command get the astronomical information on the sun and the moon for the number of days specify.',
    },
    {
        name: '/forecast',
        value: '🌦️ The forecast command get the weather condition for the number of days specify.',
    },
    {
        name: '/hourly',
        value: '🕑 The hourly command get the weather condition for each hour of the day.',
    })
    .setTimestamp()
    .setFooter({
        text: 'Powered by the weatherapi.com API',
    });

    await interaction.editReply({
        embeds: [embed],
    });  
}

module.exports = {
    data, 
    execute,
}