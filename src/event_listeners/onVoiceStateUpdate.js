const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");

module.exports = (bot) => {
    bot.on("voiceStateUpdate", async (oldState, newState) => {
        if (newState.channelID) {
            // Declaring IDs
            const channelID = newState.channelID;
            const userID = newState.id;
            const guildID = newState.guild.id;

            // Fetch guild settings and active channels from local db
            const guildSettings = bot.dbClient.getGuildSettings(
                newState.guild.id
            );
            const activeChannels = bot.dbClient.getActiveChannels(guildID);

            if (guildSettings) {
                // Check if memeber's new voice channel is equal to one of the active channels
                if (guildSettings.channels.includes(channelID)) {
                    const defaultName = `${newState.member.user.username}'s Channel`;
                    let userSettings = bot.dbClient.getUserSettings(
                        newState.id
                    );

                    // If the user is new
                    if (!userSettings) {
                        // Voice channel creation
                        const userVoiceChannel = await newState.guild.channels.create(
                            defaultName,
                            {
                                type: "voice",
                                parent: guildSettings.categoryID,
                                bitrate: 64000,
                                userLimit: 0,
                            }
                        );

                        // Text channel creation
                        const userTextChannel = await newState.guild.channels.create(
                            defaultName,
                            {
                                type: "text",
                                parent: guildSettings.categoryID,
                                permissionOverwrites: [
                                    {
                                        id: "690499818489118722", // everyone role
                                        deny: ["VIEW_CHANNEL"],
                                    },
                                ],
                            }
                        );

                        // Voice channel perms
                        userVoiceChannel.createOverwrite(newState.member.user, {
                            VIEW_CHANNEL: true,
                            MANAGE_CHANNELS: true,
                        });

                        // Text channel perms
                        userTextChannel.createOverwrite(newState.member.user, {
                            VIEW_CHANNEL: true,
                            MANAGE_CHANNELS: true,
                        });

                        // Bot perms
                        userVoiceChannel.createOverwrite(bot.user, {
                            VIEW_CHANNEL: true,
                            MANAGE_CHANNELS: true,
                            MANAGE_PERMISSIONS: true,
                            MOVE_MEMBERS: true,
                        });

                        userTextChannel.createOverwrite(bot.user, {
                            VIEW_CHANNEL: true,
                            MANAGE_CHANNELS: true,
                            MANAGE_PERMISSIONS: true,
                        });

                        userSettings = {
                            channelName: defaultName,
                            voicechannelID: userVoiceChannel.id,
                            textChannelID: userTextChannel.id,
                            userLimit: 0,
                            bitrate: 64000,
                        };

                        activeChannels.push({
                            voice: userVoiceChannel.id,
                            text: userTextChannel.id,
                        });

                        // Set the changes to DB
                        bot.dbClient.setUserSettings(userID, userSettings);
                        bot.dbClient.setActiveChannels(guildID, activeChannels);

                        // Move member to new channel
                        newState.setChannel(userVoiceChannel);
                    } else {
                        // Voice channel creation
                        const userVoiceChannel = await newState.guild.channels.create(
                            userSettings.channelName,
                            {
                                type: "voice",
                                parent: guildSettings.categoryID,
                            }
                        );

                        // Text channel creation
                        const userTextChannel = await newState.guild.channels.create(
                            userSettings.channelName,
                            {
                                type: "text",
                                parent: guildSettings.categoryID,
                            }
                        );
                        // Voice channel perms
                        userVoiceChannel.createOverwrite(newState.member.user, {
                            VIEW_CHANNEL: true,
                            MANAGE_CHANNELS: true,
                        });

                        // Text channel perms
                        userTextChannel.createOverwrite(newState.member.user, {
                            VIEW_CHANNEL: true,
                            MANAGE_CHANNELS: true,
                        });

                        // Bot perms
                        userVoiceChannel.createOverwrite(bot.user, {
                            VIEW_CHANNEL: true,
                            MANAGE_CHANNELS: true,
                            MANAGE_PERMISSIONS: true,
                            MOVE_MEMBERS: true,
                        });

                        userTextChannel.createOverwrite(bot.user, {
                            VIEW_CHANNEL: true,
                            MANAGE_CHANNELS: true,
                            MANAGE_PERMISSIONS: true,
                        });

                        // Add the newly creted channel to the array of active channels
                        activeChannels.push({
                            voice: userVoiceChannel.id,
                            text: userTextChannel.id,
                        });
                        bot.dbClient.setActiveChannels(guildID, activeChannels);

                        // Move member to new channel
                        newState.setChannel(userVoiceChannel);
                    }
                } else if (activeChannels) {
                    if (newState.channel.members.size > 1) {
                        const textChannel = oldState.guild.channels.resolve(
                            activeChannels.find(
                                (channel) => channel.voice === channelID
                            ).text
                        );

                        if (
                            activeChannels.find(
                                (channel) => channel.voice === channelID
                            )
                        ) {
                            const embed = new MessageEmbed()
                                .setColor(colors.Turquoise)
                                .setDescription(
                                    stripIndents`**${newState.member} joined!**`
                                );
                            textChannel.send(embed);
                        }
                    }
                }
            }
        }

        if (oldState.channelID) {
            // Declaring IDs
            const channelID = oldState.channelID;
            const guildID = oldState.guild.id;

            // Fetch guild settings and active channels from local db

            const activeChannels = bot.dbClient.getActiveChannels(guildID);

            if (activeChannels.find((channel) => channel.voice === channelID)) {
                const voiceChannel = oldState.guild.channels.resolve(channelID);
                const textChannelID = activeChannels.find(
                    (channel) => channel.voice === channelID
                ).text;
                const textChannel = oldState.guild.channels.resolve(
                    textChannelID
                );
                if (voiceChannel.members.size === 0) {
                    voiceChannel.delete();
                    textChannel.delete();

                    bot.dbClient.setActiveChannels(
                        guildID,
                        activeChannels.filter(
                            (channel) => channel.voice !== channelID
                        )
                    );
                } else {
                    const embed = new MessageEmbed()
                        .setColor(colors.Turquoise)
                        .setDescription(
                            stripIndents`**${oldState.member} left!**`
                        );
                    textChannel.send(embed);
                }
            }
        }
    });
};
