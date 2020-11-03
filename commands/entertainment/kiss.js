const axios = require("axios");
const colors = require("../../colors.json");
const { MessageEmbed } = require('discord.js');
const { getMember } = require('../../functions.js');

module.exports = {
    name: "kiss",
    aliases: [""],
    category:"entertainment",
    description: "Kisses a person",
    usage: [`\`q!<command | alias>\``],
    run: async (bot, message, args) => {

        if (!message.mentions.members.first()) {
            return message.channel.send(`❌ ERROR: Please tag someone!`);
        }

        let nsg = await message.channel.send("Generating...");
        const member = getMember(message, args.join(" "));

        const { data } = await axios.get(`https://api.tenor.com/v1/random?q=anime%20kiss&key=${process.env.TENOR_API_KEY}&media_filter=minimal&limit=1`);
        //console.log(data.results[0].media[0].gif.url);
        if(!{data}) {
            return message.channel.send ("My processors didn't cooperate with me, Please Try again.");
        }

        let mEmbed = new MessageEmbed()
            .setColor(colors.Dark_Pastel_Blue)
            .setAuthor(`${message.author.username} kissed ${member.user.username}! UwU`, member.user.displayAvatarURL())
            .setImage(data.results[0].media[0].gif.url)
            .setTimestamp()
            .setFooter(`${bot.user.username} | By MahoMuri`, bot.user.displayAvatarURL());
        message.channel.send(mEmbed);
        nsg.delete();
    }
};
