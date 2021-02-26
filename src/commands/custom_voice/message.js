const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "message",
    aliases: ["msg"],
    category: "custom_voice",
    description: "Changes the join/leave message in the text channel.",
    usage: ["`q.message join <message> OR q.msg leave <message>`"],
    placeholders: `
    \`%user%\` => The User who joined/left the channel
    \`%user_mention%\` => User Mention for join /leave
    \`%channelName% \` => The name of the **text** channel`,
    async run(bot, message, args) {
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

        if (userSettings) {
            const errorEmbed = new MessageEmbed()
                .setTitle("Invalid Usage!")
                .setColor(colors.Red)
                .setDescription(
                    stripIndents`❌ **Invalid usage of \`q.message\` command!**
                
                **Proper Usage:**
                \`\`\`
                q.message join %user% join the VC!
                q.message leave %user% left the VC!
                \`\`\`
                **Placeholders:**
                \`\`\`
                %user% => User's name
                %user_mention% => User Mention
                %channelName% => Channel Name
                \`\`\`
                *NOTE: Markdown is accepted!*`
                );
            if (args.length) {
                const joinMsg = "**%user% joined!**";
                const leaveMsg = "**%user% left!**";
                const code = args[0].toLowerCase();
                const content = args.slice(1).join(" ");
                const embed = new MessageEmbed().setColor(colors.Green);

                if (code === "join") {
                    userSettings.joinMsg = content;
                    embed.setDescription(
                        `✅ **Successfully changed Join Message to \`${content}\`**`
                    );
                } else if (code === "leave") {
                    userSettings.leaveMsg = content;
                    embed.setDescription(
                        `✅ **Successfully changed Leave Message to \`${content}\`**`
                    );
                } else if (code === "reset") {
                    if (content === "join") {
                        userSettings.joinMsg = joinMsg;
                        embed.setDescription(
                            `✅ **Successfully reset Join Message!**`
                        );
                    } else if (content === "leave") {
                        userSettings.leaveMsg = leaveMsg;
                        embed.setDescription(
                            `✅ **Successfully reset Leave Message!**`
                        );
                    }
                } else {
                    // Sends error embed should the provided code is not join or leave
                    message.channel.send(errorEmbed);
                }

                message.channel.send(embed);
                bot.dbClient.setUserSettings(message.author.id, userSettings);
            } else {
                // Send error embed when no args are provided
                message.channel.send(errorEmbed);
            }
        } else {
            const embed = new MessageEmbed()
                .setColor(colors.Red)
                .setDescription(
                    "❌ **I couldn't find your data, please try joining one of my custom vc's**"
                );
            message.channel.send(embed);
        }
    },
};
