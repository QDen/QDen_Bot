const ms = require("ms");

module.exports = {
    name: "mute",
    category: "moderations",
    description: "Mutes the member",
    usage: `\`-<command | alias> <time>\``,
    run: async (bot, message, args) => {
        if (message.deletable) {
            message.delete();
        }

        // No args
        if (!args[0]) {
            message
                .reply("Please provide a person to mute.")
                .then((m) =>
                    m.delete({ timeout: 5000, reason: "It had to be done." })
                );
            return;
        }

        // No reason
        if (!args[1]) {
            message
                .reply("Please specify the time!")
                .then((m) =>
                    m.delete({ timeout: 5000, reason: "It had to be done." })
                );
            return;
        }

        // No author permissions
        if (!message.member.hasPermission("MUTE_MEMBERS")) {
            message
                .reply(
                    "❌ You do not have permissions to mute members. Please contact a staff member"
                )
                .then((m) =>
                    m.delete({ timeout: 5000, reason: "It had to be done." })
                );
            return;
        }
        // No bot permissions
        if (!message.guild.me.hasPermission("MUTE_MEMBERS")) {
            message
                .reply(
                    "❌ I do not have permissions to mute members. Please contact a staff member"
                )
                .then((m) =>
                    m.delete({ timeout: 5000, reason: "It had to be done." })
                );
            return;
        }

        const toMute =
            message.mentions.members.first() ||
            message.guild.members.get(args[0]);

        // No member found
        if (!toMute) {
            message
                .reply("Couldn't find that member, try again")
                .then((m) =>
                    m.delete({ timeout: 5000, reason: "It had to be done." })
                );
            return;
        }

        // Can't ban urself
        if (toMute.id === message.author.id) {
            message
                .reply("You can't mute yourself...")
                .then((m) =>
                    m.delete({ timeout: 5000, reason: "It had to be done." })
                );
            return;
        }

        const position = message.guild.roles.cache.find(
            (role) => role.name === "Q-tizens"
        ).position;
        const restrictedCategies = [
            "690515530393583636",
            "740926177690124418",
            "690510113634517002",
        ];
        let muted = message.guild.roles.cache.find(
            (role) => role.name === "Muted"
        );
        if (!muted) {
            try {
                muted = await message.guild.roles.create({
                    data: {
                        name: "Muted",
                        color: "BLACK",
                        position: position + 1,
                        permissions: [],
                    },
                });
                message.guild.channels.cache.forEach(async (channel) => {
                    if (channel.type === "category") {
                        if (!restrictedCategies.includes(channel.id)) {
                            await channel.updateOverwrite(muted, {
                                SEND_MESSAGES: false,
                                ADD_REACTIONS: false,
                                CONNECT: false,
                                SPEAK: false,
                            });
                        }
                    }

                    // message.reply(channel);
                });
            } catch (e) {
                console.log(e.stack);
            }
        }

        const timer = args[1];
        await toMute.roles.add(muted);
        message.channel
            .send(`Successfuly Muted ${toMute} for ${ms(ms(timer))}!`)
            .then((m) =>
                m.delete({ timeout: 15000, reason: "It had to be done." })
            );

        setTimeout(() => {
            toMute.roles.remove(muted);
            message.channel
                .send(`${toMute} has been successfully unmuted!`)
                .then((m) =>
                    m.delete({ timeout: 5000, reason: "It had to be done." })
                );
        }, ms(timer));
    },
};
