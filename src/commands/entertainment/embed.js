const { MessageEmbed } = require("discord.js");
const axios = require("axios").default;
const colors = require("../../utils/colors.json");

module.exports = {
    name: "embed",
    aliases: ["embd"],
    category: "entertainment",
    description: "Creates a message embed.",
    usage: ["`-<command | alias> <embed object>`"],
    async run(bot, message, args) {
        if (!message.member.hasPermission("MANAGE_GUILD")) {
            const embed = new MessageEmbed()
                .setDescription("**❌ You don't have access to this command!**")
                .setColor(colors.Red);
            return message.channel.send(embed).then((msg) => {
                if (message.channel.messages.resolve(msg.id)) {
                    msg.delete({ timeout: 5000 }).catch(console.error);
                }
            });
        }

        if (args.length < 1 && message.attachments.size === 0) {
            message.channel.send("No args!");
            return;
        }
        // const { data } = await axios.get(message.attachments.first().url);
        // console.log(message.attachments.size);
        // const embed = new MessageEmbed(data);
        // message.channel.send(embed);

        message.channel.startTyping();
        let embed;
        // Catches errors if syntax is invalid.
        try {
            if (message.attachments.size > 0) {
                const { data } = await axios.get(
                    message.attachments.first().url
                );
                embed = new MessageEmbed(data);
                // console.log(typ);
            } else {
                embed = new MessageEmbed(JSON.parse(args.join(" ")));
            }
        } catch (error) {
            console.log(error);
            // syntax error
            const embed = new MessageEmbed()
                .setTitle("Oops!")
                .setColor(colors.Red)
                .setDescription("❌ **Wrong syntax! Must be `JSON` form!**");
            message.channel.send(embed);
            message.channel.stopTyping(true);
            return;
        }
        embed.setFooter(
            `${bot.user.username} | By MahoMuri`,
            bot.user.displayAvatarURL()
        );
        await message.channel.stopTyping(true);
        await message.channel.send(embed);
        message.delete();
    },
};
