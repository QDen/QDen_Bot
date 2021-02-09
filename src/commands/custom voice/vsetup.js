const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
    name: "vsetup",
    aliases: ["vs"],
    category: "custom voice",
    description: "",
    usage: ["`-<command | alias> `"],
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

        const guildID = message.guild.id;
        const filter = (msg) => msg.author.id === message.author.id;
        message.channel.send(
            "**Enter the name of the category to create channels in: (2 mins to answer)**"
        );

        const category = await message.channel
            .awaitMessages(filter, {
                max: 1,
                timeout: ms("2m"),
                errors: "time",
            })
            .catch(() => message.channel.send("**❌ You ran out of time!**"));

        console.log(category.first().content);
    },
};
