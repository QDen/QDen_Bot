const axios = require("axios");
const Discord = require("discord.js");
const colors = require("../../utils/colors.json");

module.exports = {
    name: "meme",
    aliases: ["hitme"],
    category: "entertainment",
    description: "Displays a random meme",
    usage: [`\`q!<command | alias>\``],
    run: async (bot, message) => {
        const nsg = await message.channel.send("Generating...");

        const { data } = await axios.get("https://some-random-api.ml/meme");
        // console.log(data.data.title, data.data.body, data.data.image);
        if (!data) {
            message.channel.send(
                "My processors didn't cooperate wiht me, Please Try again."
            );
            return;
        }

        const mEmbed = new Discord.MessageEmbed()
            .setColor(colors.Beige)
            .setAuthor(`${data.caption}`, message.author.displayAvatarURL())
            .setImage(data.image)
            .setTimestamp()
            .setFooter(
                `${bot.user.username} | By MahoMuri`,
                bot.user.displayAvatarURL()
            );

        message.channel.send(mEmbed);
        nsg.delete();
    },
};

// module.exports.config = {
//     name: "meme",
//     aliases:["meme", "hitme"]
// }
