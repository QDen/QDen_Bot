// const { JWT } = require("google-auth-library");
// const { google } = require("googleapis");

module.exports = {
    name: "test",
    aliases: [],
    category: "",
    description: "",
    usage: ["`-<command | alias> `"],
    async run(bot, message, args) {
        const activeChannels = bot.dbClient.getActiveChannels(message.guild.id);

        console.log(activeChannels, args);
        // console.log(bot.dbClient.getGuildSettings(message.guild.id));
        console.log(bot.dbClient.getUserSettings(message.author.id));
    },
};
