const { MessageEmbed } = require("discord.js");
const colors = require("../../colors.json");

module.exports = {
    name: "list",
    aliases: ["listahan"],
    category: "queue",
    description: "Displays the list of the queue",
    usage: [`\`q!<command | alias>\``],
    run: async (bot, message) => {
        if (bot.queue.length === 0) {
            message
                .reply(
                    "🙁 **The queue is empty! Go and add more people with `q!queue or q!q`!**"
                )
                .then((m) =>
                    m.delete({ timeout: 5000, reason: "It had to be done" })
                );
            message.delete({ timeout: 5000, reason: "It had to be done" });
            return;
        }

        const role = message.guild.roles.cache.find(
            (role) => role.name === "Performer"
        );
        // const member = bot.guilds.cache.get(message.guild.id).member(bot.queue[0]);
        const performer = bot.queue[0].roles.cache.has(role.id);

        if (bot.queue.length > 0) {
            let queueList = [];
            for (let i = 0; i < bot.queue.length; i++) {
                if (queueList.length === 0 && performer) {
                    queueList = `${i + 1}. ${
                        bot.queue[i]
                    }  ➡  (Currently Performing)\n\n`;
                } else if (bot.queue[i] === message.member) {
                    queueList += `${i + 1}. ${
                        bot.queue[i]
                    }  ⬅  You are here!\n\n`;
                } else {
                    queueList += `${i + 1}. ${bot.queue[i]}\n\n`;
                }
            }

            const lEmbed = new MessageEmbed()
                .setColor(colors.Green_Sheen)
                .setTitle(`${message.guild.name}'s Queue`)
                .setDescription(queueList)
                .setTimestamp()
                .setFooter(
                    `${bot.user.username} | By MahoMuri`,
                    bot.user.displayAvatarURL()
                );

            message.channel.send(lEmbed);

            message.delete({ timeout: 5000, reason: "It had to be done" });
        }
    },
};
