/**
 * @file DM listener for Q-Den complaints
 */
const { TextChannel, MessageEmbed } = require("discord.js");
const colors = require("../utils/colors.json");

module.exports = async (bot) => {
    bot.on("message", (message) => {
        const text = message.content.toLowerCase();

        if (text === "report") {
            if (message.channel instanceof TextChannel) {
                return;
            }

            const guild = bot.guilds.cache.get("690499818489118722");
            const channel = guild.channels.cache.find(
                (c) => c.id === "805793150815436801"
            );

            message.reply("**Hello there, please type your complaint now.**");
            const filter = (m) => m.author.id !== bot.user.id;

            message.channel
                .awaitMessages(filter, { max: 1 })
                .then((collected) => {
                    if (collected) {
                        message.reply(
                            "**Thank you for your complaint! Have a nice day!**"
                        );
                        const embed = new MessageEmbed()
                            .setTitle("**New Complaint!**")
                            .addFields(
                                {
                                    name:
                                        "──────────────── ∘°❉°∘ ─────────────────",
                                    value: `${collected.first().content}`,
                                    inline: true,
                                },
                                {
                                    name: "\u2800",
                                    value: "\u2800",
                                    inline: true,
                                },
                                {
                                    name:
                                        "──────────────── °∘❉∘° ─────────────────",
                                    value: "\u2800",
                                }
                            )
                            .setColor(colors.Turquoise)
                            .setFooter(
                                `${bot.user.username} | By MahoMuri`,
                                bot.user.displayAvatarURL()
                            )
                            .setTimestamp();
                        channel.send(embed);
                    }
                });
        }
    });
};
