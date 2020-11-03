const axios = require("axios");
const colors = require("../../colors.json");
const { MessageEmbed } = require('discord.js');
const { getMember } = require('../../functions.js');

module.exports = {
    name: "pat",
    aliases: [""],
    category:"entertainment",
    description: "Pats someone gently",
    usage: [`\`q!<command | alias>\``],
    run: async (bot, message, args) => {

    if (!message.mentions.members.first()) {
        return message.channel.send(`❌ ERROR: Please tag someone!`);
    }

    let nsg = await message.channel.send("Generating...");
    const member = getMember(message, args.join(" "));

    const { data } = await axios.get('https://some-random-api.ml/animu/pat');
    //console.log(data.data.title, data.data.body, data.data.image);
    if(!{data}) {
        return message.channel.send ("My processors didn't cooperate with me, Please Try again.");
    }

        let mEmbed = new MessageEmbed()
            .setColor(colors.Lumber)
            .setAuthor(`${message.author.username} pats ${member.user.username} wahhhhh!`, member.user.displayAvatarURL())
            .setImage(data.link)
            .setTimestamp()
            .setFooter(`${bot.user.username} | By MahoMuri`, bot.user.displayAvatarURL());
        message.channel.send(mEmbed);
        nsg.delete();
    }
};
