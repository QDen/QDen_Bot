const {getMember} = require('../../functions.js');

module.exports = {
    name: "begin",
    aliases: ["magsimula"],
    category:"queue",
    description: "Begins the queue",
    usage: [`\`q!<command | alias>\``],
    run: async(bot, message, args)=>{

        const role = message.guild.roles.cache.find(role => role.name === "Performer");
        const dj = message.guild.roles.cache.find(role => role.name === "Queue Master");
        const member = message.member;
        const performer = bot.queue[0];

        if (bot.queue.length === 0) {
            return message.reply("🙁 **The queue is empty! We can't start with an empty list!**")
            .then(m => m.delete({timeout: 10000, reason:"It had to be done"}));

        }
        else if (bot.queue.length > 0 && member.roles.cache.has(dj.id)) {
            return message.channel.send(`🎉 **Let's begin! For our first performer, give it up for ${performer}! 👏👏👏**`)
            .then(performer.roles.add(role));

        }
        else if (!member.roles.cache.has(dj.id)){
            return message.reply(`🛑 **You don't have the \`${dj.name}\` role!**`);
        }
    }
};
