module.exports = (bot) => {
    bot.on("guildMemberUpdate", (oldMember, newMember) => {
        const qtizens = newMember.guild.roles.cache.find(
            (role) => role.name === "Q-tizens"
        );
        const qtizenCount = newMember.guild.members.cache.map((member) =>
            member.roles.cache.has(qtizens.id)
        );
        const channelCounter = newMember.guild.channels.cache.find(
            (channel) => channel.id === "744894597410455604"
        );

        // New Q-Tizens
        if (
            !oldMember.roles.cache.has(qtizens.id) &&
            newMember.roles.cache.has(qtizens.id)
        ) {
            channelCounter.setName(`${qtizens.name}: ${qtizenCount.length}`);
        }

        // Leaving Q-Tizens
        if (
            oldMember.roles.cache.has(qtizens.id) &&
            !newMember.roles.cache.has(qtizens.id)
        ) {
            channelCounter.setName(`${qtizens.name}: ${qtizenCount.length}`);
        }
    });
};
