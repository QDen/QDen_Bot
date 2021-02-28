const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "name",
    aliases: ["cn"],
    category: "custom_voice",
    description: "Changes the name of your voice channel",
    usage: [
        "`q.name <newName> OR q.name text <newName> OR q.name voice <newName>`",
    ],
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
        } else {
            const embed = new MessageEmbed()
                .setColor(colors.Red)
                .setDescription("❌ **You're not in a Custom Voice Channel!**");
            message.channel.send(embed);
            return;
        }

        // Fetch the two channels
        const voiceChannel = message.guild.channels.resolve(
            currentChannel.voice
        );
        const textChannel = message.guild.channels.resolve(currentChannel.text);
        const successEmbed = new MessageEmbed().setColor(colors.Green);

        if (args.length) {
            const option = args[0].toLowerCase();
            const data = args.slice(1).join(" ");

            if (option === "voice") {
                try {
                    await voiceChannel.edit({
                        name: data,
                    });

                    userSetings.VCName = voiceChannel.name;
                    bot.dbClient.setUserSettings(
                        message.author.id,
                        userSetings
                    );
                    successEmbed.setDescription(
                        `✅ **Successfully changed Voice Channel name to \`${voiceChannel.name}\`**`
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
                    successEmbed.setDescription(
                        `✅ **Successfully changed Text Channel name to \`${textChannel.name}\`**`
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
            } else {
                const newName = args.join(" ");

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
                    await voiceChannel.edit({
                        name: newName,
                    });

                    await textChannel.edit({
                        name: newName,
                    });

                    userSetings.VCName = newName;
                    userSetings.TCName = newName;
                    bot.dbClient.setUserSettings(
                        message.author.id,
                        userSetings
                    );
                    successEmbed.setDescription(
                        `✅ **Successfully changed channel names to \`${newName}\`**`
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
                message.channel.send(successEmbed);
            }
        } else {
            const embed = new MessageEmbed().setColor(colors.Red)
                .setDescription(stripIndents`❌ **Invalid usage of \`q.name\` command!**
                
                **Proper Usage:**
                \`\`\`
                q.name <new name for text and voice channels>
                q.name text <this is a text channel name>
                q.name voice <this is a voice channel name>
                \`\`\`
               `);
            message.channel.send(embed);
        }
    },
};
