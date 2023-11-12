require('dotenv').config();
const {Client, GatewayIntentBits, Events, Collection} = require('discord.js');
const {clientReadyHandler} = require('./events/clientReady');
const {interactionCreateHandler} = require('./events/interactionCreate');

const pingCommand = require('./commands/ping');
const forecastCommand = require('./commands/forecast');
const astroCommand = require('./commands/astro');
const hourlyCommand = require('./commands/hourly');
const currentCommand = require('./commands/current');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ]
});

client.commands = new Collection();
client.commands.set(pingCommand.data.name, pingCommand);
client.commands.set(forecastCommand.data.name, forecastCommand);
client.commands.set(astroCommand.data.name, astroCommand);
client.commands.set(hourlyCommand.data.name, hourlyCommand);
client.commands.set(currentCommand.data.name, currentCommand);

client.once(Events.ClientReady, clientReadyHandler);
client.on(Events.InteractionCreate, interactionCreateHandler)

client.login(process.env.DISCORD_TOKEN);