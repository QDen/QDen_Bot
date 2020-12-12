module.exports = {
    name: "remove",
    aliases: ["umalis"],
    category: "queue",
    description: "Removes the memebr from the queue",
    usage: [`\`q!<command | alias>\``],
    run: async (bot, message) => {
        const member = message.mentions.members.first();
        if (member) {
            if (
                member !== message.member &&
                !message.member.roles.cache.some(
                    (role) => role.name === "Queue Master"
                )
            ) {
                message
                    .reply(
                        "🛑 **You cannot remove anyone other than yourself!**"
                    )
                    .then((m) =>
                        m.delete({ timeout: 5000, reason: "It had to be done" })
                    );
                message.delete({ timeout: 6000, reason: "It had to be done" });
                return;
            }
            // message.channel.send(args[0]);
            const toRemove = bot.queue.indexOf(member);
            // message.channel.send(toRemove);
            if (toRemove === -1) {
                message.channel
                    .send(`🛑 **Couldn't find that member!**`)
                    .then((m) =>
                        m.delete({ timeout: 5000, reason: "It had to be done" })
                    );
                message.delete({ timeout: 6000, reason: "It had to be done" });
            } else {
                message.channel
                    .send(
                        `✅ **Successfuly removed ${member} from the queue!**`
                    )
                    .then(bot.queue.splice(toRemove, 1))
                    .then((m) =>
                        m.delete({ timeout: 5000, reason: "It had to be done" })
                    );
                message.delete({ timeout: 6000, reason: "It had to be done" });
            }
        } else {
            // message.channel.send(args[0]);
            const toRemove = bot.queue.indexOf(message.member);
            // message.channel.send(toRemove);
            if (toRemove === -1) {
                message.channel
                    .send(`🛑 **Couldn't find that member!**`)
                    .then((m) =>
                        m.delete({ timeout: 5000, reason: "It had to be done" })
                    );
                message.delete({ timeout: 6000, reason: "It had to be done" });
            } else {
                message.channel
                    .send(
                        `✅ **Successfuly removed ${message.member} from the queue!**`
                    )
                    .then(bot.queue.splice(toRemove, 1))
                    .then((m) =>
                        m.delete({ timeout: 5000, reason: "It had to be done" })
                    );
                message.delete({ timeout: 6000, reason: "It had to be done" });
            }
        }
    },
};
