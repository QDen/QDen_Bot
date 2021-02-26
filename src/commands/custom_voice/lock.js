const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "lock",
    aliases: ["lck"],
    category: "custom_voice",
    description: "Locks the VC",
    usage: ["`-<command | alias> `"],
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

        // Fetch the two channels
        const voiceChannel = message.guild.channels.resolve(
            currentChannel.voice
        );

        // Everyone role
        const everyone = message.guild.roles.cache.find(
            (role) => role.name === "@everyone"
        );

        try {
            voiceChannel.updateOverwrite(everyone, {
                CONNECT: false,
            });

            const embed = new MessageEmbed()
                .setColor(colors.Green)
                .setDescription(
                    "🔒 **Successfully locked the Voice Channel!**"
                );
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
