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

        if (voiceChannel.members.has(currentChannel.owner)) {
            if (message.author.id === currentChannel.owner) {
                const embed = new MessageEmbed()
                    .setColor(colors.Red)
                    .setDescription("❌ **You already own this!**");
                message.channel.send(embed);
            } else {
                const embed = new MessageEmbed()
                    .setColor(colors.Red)
                    .setDescription("❌ **The Owner is still in the VC!**");
                message.channel.send(embed);
            }
        } else {
            try {
                // Updates active channel's owner id
                const foundIndex = activeChannels.findIndex(
                    (channel) => channel.owner === currentChannel.owner
                );

                activeChannels[foundIndex].owner = message.author.id;

                bot.dbClient.setActiveChannels(guildID, activeChannels);

                const successEmbed = new MessageEmbed()
                    .setTitle("Success!")
                    .setColor(colors.Green)
                    .setDescription(
                        stripIndents`✅ **I have passed ownership to ${message.author}!**`
                    );
                message.channel.send(successEmbed);
            } catch (error) {
                console.log(error.stack);
                const embed = new MessageEmbed()
                    .setTitle("Error!")
                    .setColor(colors.Red)
                    .setDescription(
                        "❌ **Something went wrong, please try again**"
                    );
                message.channel.send(embed);
            }
        }
    },
};
