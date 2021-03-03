const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");
const Utilities = require("../utils/functions");

module.exports = (bot) => {
    bot.on("voiceStateUpdate", async (oldState, newState) => {
        if (oldState.channel === newState.channel) {
            return;
        }
        if (newState.channelID) {
            // Declaring IDs
            const channelID = newState.channelID;
            const userID = newState.id;
            const guildID = newState.guild.id;

            // Fetch guild settings and active channels from local db
            const guildSettings = bot.dbClient.getGuildSettings(
                newState.guild.id
            );

            if (!guildSettings) {
                return;
            }

            // Everyone role
            const everyone = newState.guild.roles.cache.find(
                (role) => role.name === "@everyone"
            );
            const activeChannels = bot.dbClient.getActiveChannels(guildID);

            if (guildSettings) {
                // Check if memeber's new voice channel is equal to one of the active channels
                if (guildSettings.channels.includes(channelID)) {
                    const defaultName = `${newState.member.user.username}'s Channel`;
                    const joinMsg = "**%user% joined!**";
                    const leaveMsg = "**%user% left!**";
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
                                        id: everyone.id, // everyone role
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
                            owner: newState.member.user.id,
                            VCName: userVoiceChannel.name,
                            TCName: userTextChannel.name,
                            joinMsg,
                            leaveMsg,
                            userLimit: 0,
                            bitrate: 64000,
                        };

                        activeChannels.push({
                            owner: newState.member.user.id,
                            voice: userVoiceChannel.id,
                            text: userTextChannel.id,
                        });

                        // Set the changes to DB
                        bot.dbClient.setUserSettings(userID, userSettings);
                        bot.dbClient.setActiveChannels(guildID, activeChannels);

                        // Move member to new channel
                        newState.setChannel(userVoiceChannel);
                        userTextChannel.send(
                            Utilities.channelInfo(newState.guild, userSettings)
                        );
                    } else {
                        // The user has data in the db
                        // Voice channel creation
                        const userVoiceChannel = await newState.guild.channels.create(
                            userSettings.VCName,
                            {
                                type: "voice",
                                parent: guildSettings.categoryID,
                                userLimit: userSettings.userLimit,
                            }
                        );

                        let MAX_BITRATE;
                        if (newState.guild.premiumTier === 0) {
                            MAX_BITRATE = 96;
                        } else if (newState.guild.premiumTier === 1) {
                            MAX_BITRATE = 128;
                        } else if (newState.guild.premiumTier === 2) {
                            MAX_BITRATE = 256;
                        } else if (newState.guild.premiumTier === 3) {
                            MAX_BITRATE = 384;
                        }

                        let warningEmbed;
                        if (userSettings.bitrate > MAX_BITRATE * 1000) {
                            userVoiceChannel.setBitrate(MAX_BITRATE * 1000);
                            warningEmbed = new MessageEmbed()
                                .setTitle("Warning!")
                                .setColor(colors.Yellow)
                                .setDescription(
                                    stripIndents`⚠ **Your bitrate is too powerful for this server to handle! I've reduced it to \`${MAX_BITRATE}kbps!\`**
        
                                    *NOTE: Your original bitrate is not changed.*`
                                );
                        } else {
                            userVoiceChannel.setBitrate(userSettings.bitrate);
                        }

                        // Text channel creation
                        const userTextChannel = await newState.guild.channels.create(
                            userSettings.TCName,
                            {
                                type: "text",
                                parent: guildSettings.categoryID,
                                permissionOverwrites: [
                                    {
                                        id: everyone.id, // everyone role
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

                        // Add the newly creted channel to the array of active channels
                        activeChannels.push({
                            owner: newState.member.user.id,
                            voice: userVoiceChannel.id,
                            text: userTextChannel.id,
                        });
                        bot.dbClient.setActiveChannels(guildID, activeChannels);

                        // Move member to new channel
                        newState.setChannel(userVoiceChannel);
                        userTextChannel.send(
                            Utilities.channelInfo(newState.guild, userSettings)
                        );
                        if (warningEmbed) {
                            userTextChannel.send(warningEmbed);
                        }
                    }
                } else if (activeChannels) {
                    const defaultName = `${newState.member.user.username}'s Channel`;
                    const joinMsg = "**%user% joined!**";
                    const leaveMsg = "**%user% left!**";
                    const currentChannel = activeChannels.find(
                        (channel) => channel.voice === channelID
                    );
                    if (currentChannel) {
                        const userSettings = bot.dbClient.getUserSettings(
                            currentChannel.owner
                        );

                        // Get user settings to check if memeber is cached in the db
                        let userCache = bot.dbClient.getUserSettings(
                            newState.id
                        );
                        // If not cached, cache it.
                        if (!userCache) {
                            userCache = {
                                owner: newState.member.user.id,
                                VCName: defaultName,
                                TCName: defaultName,
                                joinMsg,
                                leaveMsg,
                                userLimit: 0,
                                bitrate: 64000,
                            };

                            bot.dbClient.setUserSettings(
                                newState.id,
                                userCache
                            );
                        }

                        if (newState.channel.members.size > 1) {
                            const textChannel = oldState.guild.channels.resolve(
                                activeChannels.find(
                                    (channel) => channel.voice === channelID
                                ).text
                            );

                            textChannel.updateOverwrite(newState.member.user, {
                                VIEW_CHANNEL: true,
                            });

                            const embed = new MessageEmbed()
                                .setColor(colors.Turquoise)
                                .setDescription(
                                    Utilities.replacePlaceholders(
                                        newState,
                                        userSettings.joinMsg
                                    )
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

            // Fetch user settings and active channels from local db
            const activeChannels = bot.dbClient.getActiveChannels(guildID);
            if (!activeChannels) {
                return;
            }
            const currentChannel = activeChannels.find(
                (channel) => channel.voice === channelID
            );

            if (currentChannel) {
                const userSettings = bot.dbClient.getUserSettings(
                    currentChannel.owner
                );
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
                    const userPerms = textChannel.permissionOverwrites.find(
                        (permission) =>
                            permission.id === oldState.member.user.id
                    );
                    if (userPerms) {
                        userPerms.delete();
                    }
                    const embed = new MessageEmbed()
                        .setColor(colors.Turquoise)
                        .setDescription(
                            Utilities.replacePlaceholders(
                                oldState,
                                userSettings.leaveMsg
                            )
                        );
                    textChannel.send(embed);
                }
            }
        }
    });
};
