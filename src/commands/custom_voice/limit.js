const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "limit",
    aliases: [],
    category: "custom_voice",
    description: "Limits the amount of users in the Voice Channel.",
    usage: ["`q.limit userLimit `"],
    async run(bot, message, args) {
        // Fetch channel data from DB
        const activeChannels = bot.dbClient.getActiveChannels(message.guild.id);
        const userSetings = bot.dbClient.getUserSettings(message.author.id);
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

        // Fetch the voice channel
        const voiceChannel = message.guild.channels.resolve(
            currentChannel.voice
        );

        if (
            Number.isNaN(parseInt(args[0])) ||
            parseInt(args[0]) < 0 ||
            parseInt(args[0]) >= 100
        ) {
            const embed = new MessageEmbed()
                .setColor(colors.Red)
                .setDescription("❌ **User limit must be between 0 to 99!**");
            message.channel.send(embed);
            return;
        }

        const userLimit = parseInt(args[0]);

        try {
            voiceChannel.setUserLimit(userLimit);

            userSetings.userLimit = userLimit;
            bot.dbClient.setUserSettings(message.author.id, userSetings);
            if (userLimit === 0) {
                const embed = new MessageEmbed()
                    .setColor(colors.Green)
                    .setDescription(
                        stripIndents`✅ **Removed the Voice Channel's User limit!**`
                    );
                message.channel.send(embed);
            } else {
                const embed = new MessageEmbed()
                    .setColor(colors.Green)
                    .setDescription(
                        stripIndents`✅ **Set the Voice Channel limit to \`${userLimit}\`**`
                    );
                message.channel.send(embed);
            }
        } catch (error) {
            const embed = new MessageEmbed()
                .setColor(colors.Red)
                .setDescription(
                    "❌ **Something went wrong, please try again**"
                );
            message.channel.send(embed);
        }
    },
};
