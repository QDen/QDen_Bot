/**
 *  @file New Member listener
 */

module.exports = async (bot) => {
    bot.on("guildMemberAdd", async (member) => {
        const guild = member.guild;
        guild.channels.cache.find((c) => c.id === "694217906296455188");
    });
};
