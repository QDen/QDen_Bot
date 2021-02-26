// const { JWT } = require("google-auth-library");
// const { google } = require("googleapis");
const { MessageAttachment, MessageEmbed } = require("discord.js");
const stringSimilarity = require("string-similarity");

module.exports = {
    name: "test",
    aliases: [],
    category: "",
    description: "",
    usage: ["`-<command | alias> `"],
    async run(bot, message, args) {
        // const location = stringSimilarity.findBestMatch(
        //     args.join(" "),
        //     bot.covidAPI.locations
        // );

        // // const data = await bot.covidAPI.getDataByLocationAndDate(
        // //     location.bestMatch.target,
        // //     bot.covidAPI.lastDate
        // // );

        // const attachment = new MessageAttachment(
        //     Buffer.from(bot.covidAPI.locations.join("\n")),
        //     "Available locations.txt"
        // );

        // message.channel.send(attachment);

        // const embed = new MessageEmbed()
        //     .setColor(colors.Turquoise)
        //     .setDescription(args.join(" "));
        // message.channel.send(embed);

        console.log(args.shift());
    },
};
