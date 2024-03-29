const { MessageEmbed } = require("discord.js");
const colors = require("../../utils/colors.json");
const { getMember } = require("../../utils/functions");

module.exports = {
    name: "wasted",
    aliases: [],
    category: "entertainment",
    description: "Puts a wasted overlay",
    usage: [`\`q!<command | alias>\``],
    run: async (bot, message, args) => {
        const nsg = await message.channel.send("Generating...");
        const member = getMember(message, args.join(" "));

        const avatar = await member.user.displayAvatarURL({ format: "png" });
        const data = `https://some-random-api.ml/canvas/wasted?avatar=${avatar}`;
        // console.log(reader.readAsDataURL(data));
        if (!data) {
            message.channel.send(
                "My processors didn't cooperate wiht me, Please Try again."
            );
            return;
        }

        const mEmbed = new MessageEmbed()
            .setColor(colors.Lumber)
            .setAuthor(
                `${member.user.username} got wasted!!!`,
                bot.user.displayAvatarURL()
            )
            .setImage(data)
            .setTimestamp()
            .setFooter(
                `${bot.user.username} | By MahoMuri`,
                bot.user.displayAvatarURL()
            );

        message.channel.send(mEmbed);
        nsg.delete();
    },
};
