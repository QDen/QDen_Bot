const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "convertshells",
    aliases: ["shells", "toshells"],
    category: "shellconverter",
    description: "RP to Garena Shells Converter",
    usage: ["`-<command | alias> `"],
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
            const converted = toConvert / CONVERTION_RATE;
            const shells = message.guild.emojis.cache.find(
                (emoji) => emoji.name === "shells"
            );
            const rp = message.guild.emojis.cache.find(
                (emoji) => emoji.name === "rp"
            );
            const embed = new MessageEmbed()
                .setTitle("Garena RP Converter")
                .setThumbnail(
                    "https://cdngarenanow-a.akamaihd.net/gop/app/0000/010/095/icon.png"
                )
                .setDescription(
                    stripIndents`
                    **Mode: __RP to Shells__**

                    **LoL RP:** ${toConvert} ${rp}
                    **Convertion Method**: x = (n / 5.4)
                    **Total Shells:** ${Math.ceil(converted)} ${shells}
                    
                    *Note: These convertions are at the closest estimate.*

                    For more information about the convertions please click [here](https://lol.garena.ph/news/5202)`
                );
            message.channel.send(embed);
        }
    },
};
