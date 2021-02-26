const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "show",
    aliases: ["sh"],
    category: "custom_voice",
    description: "Shows the Voice channel",
    usage: ["`q.show`"],
    async run(bot, message) {
        // Fetch channel data from DB
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

        // Fetch the voice channel
        const voiceChannel = message.guild.channels.resolve(
            currentChannel.voice
        );

        const originalPermissions = bot.dbClient.getChannelPermissions(
            voiceChannel.id
        );

        try {
            voiceChannel.overwritePermissions(originalPermissions);

            const embed = new MessageEmbed()
                .setColor(colors.Green)
                .setDescription("✅ **Voice Channel is now public!**");
            message.channel.send(embed);
        } catch (error) {
            console.log(error.stack);
            const embed = new MessageEmbed()
                .setColor(colors.Red)
                .setDescription(
                    "❌ **Something went wrong, please try again**"
                );
            message.channel.send(embed);
        }
    },
};
