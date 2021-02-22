const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");
const { getMember } = require("../../utils/functions");

module.exports = {
    name: "allow",
    aliases: ["permit"],
    category: "custom_voice",
    description: "Allows a user into your VC ",
    usage: ["`q.allow @user`"],
    async run(bot, message, args) {
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
                .setDescription("❌ **You're not in a Voice Channel!**");
            message.channel.send(embed);
            return;
        }

        // Fetch the two channels
        const voiceChannel = message.guild.channels.resolve(
            currentChannel.voice
        );

        // Everyone role
        const allowedMember = getMember(message, args.join(" "));

        try {
            voiceChannel.updateOverwrite(allowedMember.user, {
                CONNECT: true,
            });

            const embed = new MessageEmbed()
                .setColor(colors.Green)
                .setDescription(
                    stripIndents`✅ **Allowed ${allowedMember} to the Voice Channel!**`
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
