const {REST, Routes} = require('discord.js');
const rest = new REST({version: '10'}).setToken(process.env.DISCORD_TOKEN);

async function clientReadyHandler(client) {

    try {
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            {
                body: client.commands.map((command) => {
                    return command.data.toJSON();
                })
            }
        );
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    clientReadyHandler,
};