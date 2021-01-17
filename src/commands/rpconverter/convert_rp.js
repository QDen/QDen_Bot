const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "convertrp",
    aliases: ["rp", "torp"],
    category: "rpconverter",
    description: "Garena Shells to RP Converter",
    usage: ["`-<command | alias> <number to convert>`"],
    async run(bot, message, args) {
        const toConvert = args.join("");
        const CONVERTION_RATE = 5.4;
        if (isNaN(toConvert)) {
            console.log("Input must be a number!", `Input: ${toConvert}`);
        } else if (toConvert < 0) {
            console.log("Cannot be a negative number", `Input: ${toConvert}`);
            message.channel.send("**❌ Number cannot be negative!**");
        } else if (toConvert % 1 !== 0) {
            console.log("Cannot be float!\n", `Input: ${toConvert}`);
        } else {
            const converted = toConvert * CONVERTION_RATE;
            const shells = message.guild.emojis.cache.find(
                (emoji) => emoji.name === "shells"
            );
            const rp = message.guild.emojis.cache.find(
                (emoji) => emoji.name === "rp"
            );
            const embed = new MessageEmbed()
                .setTitle("Garena RP Converter")
                .setThumbnail("https://i.imgur.com/WouNYek.png")
                .setDescription(
                    stripIndents`
                    **Mode: __Shells to RP__ **

                    **Garena Shells:** ${toConvert} ${shells}
                    **Convertion Method**: x = (n * 5.4)
                    **Total RP:** ${Math.floor(converted)} ${rp}
                    
                    *Note: These convertions are at the closest estimate.* 

                    For more information about the convertions please click [here](https://lol.garena.ph/news/5202)`
                );
            message.channel.send(embed);
        }
    },
};
