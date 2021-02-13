module.exports = (bot) => {
    bot.on("voiceStateUpdate", async (oldState, newState) => {
        if (newState.channelID) {
            // Declaring Channel ID
            const channelID = newState.channelID;
            const userID = newState.id;

            // Fetch active channels from local db
            const activeChannels = bot.dbClient.getActiveChannels(
                newState.guild.id
            );

            // Check if memeber's new voice channel is equal to one of the active channels
            if (activeChannels.channels.includes(channelID)) {
                const defaultName = `${newState.member.user.username}'s Channel`;
                let userSettings = bot.dbClient.getUserSettings(newState.id);
                if (!userSettings) {
                    // Voice channel creation
                    const userVoiceChannel = await newState.guild.channels.create(
                        defaultName,
                        {
                            type: "voice",
                            parent: activeChannels.categoryID,
                        }
                    );

                    // Text channel creation
                    const userTextChannel = await newState.guild.channels.create(
                        defaultName,
                        {
                            type: "text",
                            parent: activeChannels.categoryID,
                            permissionOverwrites: [
                                {
                                    id: "690499818489118722", // everyone role
                                    deny: ["VIEW_CHANNEL"],
                                },
                            ],
                        }
                    );

                    // Voice channel perms
                    userVoiceChannel.createOverwrite(bot.user, {
                        VIEW_CHANNEL: true,
                        MANAGE_CHANNELS: true,
                        MANAGE_PERMISSIONS: true,
                        MOVE_MEMBERS: true,
                    });

                    // Text channel perms
                    userTextChannel.createOverwrite(bot.user, {
                        VIEW_CHANNEL: true,
                        MANAGE_CHANNELS: true,
                        MANAGE_PERMISSIONS: true,
                    });

                    userTextChannel.createOverwrite(newState.member.user, {
                        VIEW_CHANNEL: true,
                    });

                    userSettings = {
                        channelName: defaultName,
                        userLimit: "none",
                        bitrate: 64,
                    };

                    bot.dbClient.setUserSettings(userID, userSettings);

                    // Move member to new channel
                    newState.setChannel(userVoiceChannel);
                } else {
                    // Voice channel creation
                    const userVoiceChannel = await newState.guild.channels.create(
                        userSettings.channelName,
                        {
                            type: "voice",
                            parent: activeChannels.categoryID,
                        }
                    );

                    // Text channel creation
                    const userTextChannel = await newState.guild.channels.create(
                        userSettings.channelName,
                        {
                            type: "text",
                            parent: activeChannels.categoryID,
                            permissionOverwrites: [
                                {
                                    id: "690499818489118722", // everyone role
                                    deny: ["VIEW_CHANNEL"],
                                },
                            ],
                        }
                    );

                    // Voice channel perms
                    userVoiceChannel.createOverwrite(bot.user, {
                        VIEW_CHANNEL: true,
                        MANAGE_CHANNELS: true,
                        MANAGE_PERMISSIONS: true,
                        MOVE_MEMBERS: true,
                    });

                    // Text channel perms
                    userTextChannel.createOverwrite(bot.user, {
                        VIEW_CHANNEL: true,
                        MANAGE_CHANNELS: true,
                        MANAGE_PERMISSIONS: true,
                    });

                    userTextChannel.createOverwrite(newState.member.user, {
                        VIEW_CHANNEL: true,
                    });

                    // Move member to new channel
                    newState.setChannel(userVoiceChannel);
                }
            }
        }

        // TODO: Channel deletion on disconnect
    });
};
