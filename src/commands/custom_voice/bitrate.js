const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");
const Utilities = require("../../utils/functions");

module.exports = {
    name: "bitrate",
    aliases: ["bt"],
    category: "custom_voice",
    description: "Sets the bitate of the voice channel",
    usage: ["`q.bitrate`"],
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
                .setDescription("❌ **You're not in a Voice Channel!**");
            message.channel.send(embed);
            return;
        }

        // Fetch the voice channel
        const voiceChannel = message.guild.channels.resolve(
            currentChannel.voice
        );

        if (
            Number.isNaN(parseInt(args[0])) ||
            parseInt(args[0]) < 8 ||
            parseInt(args[0]) > 128
        ) {
            const embed = new MessageEmbed()
                .setColor(colors.Red)
                .setDescription(
                    "❌ **Bitrate must be between 8kpbs to 128kbps!**"
                );
            message.channel.send(embed);
            return;
        }

        const bitrate = parseInt(args[0]) * 1000;

        try {
            voiceChannel.setBitrate(bitrate);

            userSetings.bitrate = bitrate;
            bot.dbClient.setUserSettings(message.author.id, userSetings);

            const embed = new MessageEmbed()
                .setColor(colors.Green)
                .setDescription(
                    stripIndents`✅ **Voice Channel's bitrate is now \`${Utilities.formatBitrate(
                        bitrate
                    )}\`**`
                );
            message.channel.send(embed);
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
