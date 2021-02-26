const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "claim",
    aliases: ["clm"],
    category: "custom_voice",
    description: "Claims the VC if the owner is no longer present.",
    usage: ["`q.claim`"],
    async run(bot, message) {
        // Constants declaration
        const guildID = message.guild.id;
        // Fetch channel data from DB
        const activeChannels = bot.dbClient.getActiveChannels(guildID);
        const userSettings = bot.dbClient.getUserSettings(message.author.id);
        const currentChannel = activeChannels.find(
            (channel) =>
                channel.text === message.channel.id ||
                channel.voice === message.member.voice.channelID
        );

        if (!currentChannel) {
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
        const textChannel = message.guild.channels.resolve(currentChannel.text);

        if (voiceChannel.members.has(currentChannel.owner)) {
            const embed = new MessageEmbed()
                .setColor(colors.Red)
                .setDescription("❌ **The Owner is still in the VC!**");
            message.channel.send(embed);
        } else {
            try {
                await voiceChannel.edit({
                    name: userSettings.VCName,
                });

                await voiceChannel.setUserLimit(userSettings.userLimit);

                let MAX_BITRATE;
                if (message.guild.premiumTier === 0) {
                    MAX_BITRATE = 96;
                } else if (message.guild.premiumTier === 1) {
                    MAX_BITRATE = 128;
                } else if (message.guild.premiumTier === 2) {
                    MAX_BITRATE = 256;
                } else if (message.guild.premiumTier === 3) {
                    MAX_BITRATE = 384;
                }

                if (userSettings.bitrate > MAX_BITRATE * 1000) {
                    voiceChannel.setBitrate(MAX_BITRATE * 1000);
                    const embed = new MessageEmbed()
                        .setTitle("Warning!")
                        .setColor(colors.Yellow)
                        .setDescription(
                            stripIndents`⚠ **Your bitrate is too powerful for this server to handle! I've reduced it to \`${MAX_BITRATE}kbps!\`**

                            *NOTE: Your original bitrate is not changed.*`
                        );
                    message.channel.send(embed);
                } else {
                    voiceChannel.setBitrate(userSettings.bitrate);
                }

                await textChannel.edit({
                    name: userSettings.TCName,
                });

                // Updates active channel's owner id
                const foundIndex = activeChannels.findIndex(
                    (channel) => channel.owner === currentChannel.owner
                );
                activeChannels[foundIndex].owner = message.author.id;

                bot.dbClient.setActiveChannels(guildID, activeChannels);

                const successEmbed = new MessageEmbed()
                    .setColor(colors.Green)
                    .setDescription(
                        stripIndents`✅ **Successfully passed ownership to ${message.author}! All your settings were loaded properly!**`
                    );
                message.channel.send(successEmbed);
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
    },
};
