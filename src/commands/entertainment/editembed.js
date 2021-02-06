const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "editembed",
    aliases: ["ee"],
    category: "entertainment",
    description: "edits and embed",
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

        try {
            if (!args.length) {
                message.channel.send("❌ **Please provide a message link!**");
            } else {
                const url = new URL(args.join(""));
                const [channelID, msgID] = url.pathname.split("/").slice(3);

                const channel = await message.guild.channels.cache.get(
                    channelID
                );
                const fetchedMessage = await channel.messages.fetch(msgID);
                if (fetchedMessage) {
                    message.channel.send("Please enter the new embed message.");

                    const filter = (m) =>
                        m.author === message.author &&
                        m.author.id !== bot.user.id;

                    const collected = await message.channel
                        .awaitMessages(filter, {
                            max: 1,
                            time: ms("2m"),
                            errors: ["time"],
                        })
                        .catch(() =>
                            message.channel.send("❌ Edit Embed canceled!")
                        );
                    // Converts string to JSON
                    message.channel.startTyping();
                    setTimeout(async () => {
                        try {
                            let object;
                            // Catches errors if syntax is invalid.
                            try {
                                object = JSON.parse(collected.first().content);
                                console.log(object);
                            } catch (error) {
                                // syntax error
                                const embed = new MessageEmbed()
                                    .setTitle("Oops!")
                                    .setColor(colors.Red)
                                    .setDescription(
                                        "❌ **Wrong syntax! Must be `JSON` form!**"
                                    );
                                message.channel.send(embed);
                                message.channel.stopTyping(true);
                                return;
                            }

                            // Converts JSON to Embed
                            const embed = new MessageEmbed(object);
                            await message.channel.stopTyping(true);
                            collected.first().delete();
                            fetchedMessage.edit(embed);
                            message.channel.send(
                                "✅ **Message Embed successfully edited!**"
                            );
                        } catch (err) {
                            console.log(err);
                        }
                    }, 2000);
                }
            }
        } catch (error) {
            if (error.message === "Invalid URL:") {
                message.channel.send("❌ Inavlid URL!");
            }
        }
    },
};
