const { MessageEmbed } = require("discord.js");
const colors = require("../../utils/colors.json");
const { getMember } = require("../../utils/functions");

module.exports = {
    name: "avatar",
    aliases: ["me", "about"],
    category: "info",
    description: "Gives your avatar or the avatar of another user",
    usage: `\`q!<command | alias> [@user]\``,
    run: async (bot, message, args) => {
        const member = getMember(message, args.join(" "));

        // Member variables
        const embed = new MessageEmbed()

            .setAuthor(`${member.user.tag}`)
            .setTitle("Avatar URL")
            .setURL(
                member.user.displayAvatarURL({
                    format: "png",
                    dynamic: true,
                    size: 256,
                })
            )
            .setImage(
                member.user.displayAvatarURL({
                    format: "png",
                    dynamic: true,
                    size: 256,
                })
            )
            .setColor(colors.Black);

        message.channel.send(embed);
    },
};
