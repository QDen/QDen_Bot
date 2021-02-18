const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "name",
    aliases: ["cn"],
    category: "custom_voice",
    description: "Changes the name of your voice channel",
    usage: ["`-<command | alias> `"],
    async run(bot, message, args) {
        // Fetch channel data from the db
        const userSetings = bot.dbClient.getUserSettings(message.author.id);
        const activeChannels = bot.dbClient.getActiveChannels(message.guild.id);
        const currentChannel = activeChannels.find(
            (channel) =>
                channel.text === message.channel.id ||
                channel.voice === message.member.voice.channelID
        );

        if (currentChannel) {
            if (currentChannel.owner !== message.author.id) {
                const embed = new MessageEmbed()
                    .setColor(colors.Red)
                    .setDescription(
                        "❌ **You're not the owner of this channel!**"
                    );
                message.channel.send(embed);
                return;
            }
        }

        // Fetch the two channels
        const voiceChannel = message.guild.channels.resolve(
            currentChannel.voice
        );
        const textChannel = message.guild.channels.resolve(currentChannel.text);
        const embed = new MessageEmbed().setColor(colors.Green);

        if (args.length) {
            const option = args[0].toLowerCase();
            const data = args.slice(1).join(" ");

            if (option === "voice") {
                try {
                    const newVoiceChannel = await voiceChannel.edit({
                        name: data,
                    });

                    userSetings.VCName = newVoiceChannel.name;
                    bot.dbClient.setUserSettings(
                        message.author.id,
                        userSetings
                    );
                    embed.setDescription(
                        "✅ **Successfully changed Voice Channel Name!**"
                    );
                } catch (error) {
                    console.log(error.stack);
                    const embed = new MessageEmbed()
                        .setColor(colors.Red)
                        .setDescription(
                            "❌ **Something went wrong, please try again**"
                        );
                    message.channel.send(embed);
                }
            } else if (option === "text") {
                try {
                    await textChannel.edit({
                        name: data,
                    });

                    userSetings.TCName = textChannel.name;
                    bot.dbClient.setUserSettings(
                        message.author.id,
                        userSetings
                    );
                    embed.setDescription(
                        "✅ **Successfully changed Text Channel Name!**"
                    );
                } catch (error) {
                    console.log(error.stack);
                    const embed = new MessageEmbed()
                        .setColor(colors.Red)
                        .setDescription(
                            "❌ **Something went wrong, please try again**"
                        );
                    message.channel.send(embed);
                }
            }
        } else {
            const filter = (m) => m.author.id === message.author.id;

            // Getter for voice channel name
            const voiceEmbed = new MessageEmbed()
                .setColor(colors.Turquoise)
                .setDescription("**Enter the new name of the Voice Channel:**")
                .setFooter("2 mins to answer");
            message.channel.send(voiceEmbed);

            const newVCName = await message.channel
                .awaitMessages(filter, {
                    max: 1,
                    timeout: ms("2m"),
                    errors: "time",
                })
                .catch(() =>
                    message.channel.send("**❌ You ran out of time!**")
                );
            console.log(newVCName.first().content);

            // Getter for text channel name
            const textEmbed = new MessageEmbed()
                .setColor(colors.Turquoise)
                .setDescription("**Enter the new name of the Text Channel:**")
                .setFooter("2 mins to answer");
            message.channel.send(textEmbed);

            const newTCName = await message.channel
                .awaitMessages(filter, {
                    max: 1,
                    timeout: ms("2m"),
                    errors: "time",
                })
                .catch(() =>
                    message.channel.send("**❌ You ran out of time!**")
                );
            console.log(newTCName.first().content);

            // Fetch the two channels
            const voiceChannel = message.guild.channels.resolve(
                currentChannel.voice
            );
            const textChannel = message.guild.channels.resolve(
                currentChannel.text
            );

            try {
                const userSetings = bot.dbClient.getUserSettings(
                    message.author.id
                );
                const newVoiceChannel = await voiceChannel.edit({
                    name: newVCName.first().content,
                });

                const newTextChannel = await textChannel.edit({
                    name: newTCName.first().content,
                });

                userSetings.VCName = newVoiceChannel.name;
                userSetings.TCName = newTextChannel.name;
                bot.dbClient.setUserSettings(message.author.id, userSetings);
                embed.setDescription(
                    "✅ **Successfully changed channel names!**"
                );
            } catch (error) {
                console.log(error.stack);
                const embed = new MessageEmbed()
                    .setColor(colors.Red)
                    .setDescription(
                        "❌ **Something went wrong, please try again**"
                    );
                message.channel.send(embed);
            }
            message.channel.send(embed);
        }
    },
};
