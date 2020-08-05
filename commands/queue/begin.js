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
        const member = getMember(message, args.join(" "));
        const performer = bot.guilds.cache.get('690499818489118722').member(bot.queue[0]);

        if (bot.queue.length === 0) {
            message.reply("The queue is paking empty! Go and add more people!")
            .then(m => m.delete({timeout: 5000, reason:"It had to be done"}));
            message.delete({timeout: 5000, reason:"It had to be done"});
        }
        else if (bot.queue.length > 0 && member.roles.cache.has(dj.id)) {
            message.channel.send(`Let's begin! For our first performer, give it up for ${bot.queue[0]}!`)
            .then(performer.roles.add(role)).then(m => m.delete({timeout: 5000, reason:"It had to be done"}));
            message.delete({timeout: 5000, reason:"It had to be done"});
        }
        else {
            message.reply(`You don't have the ${dj.name} role!`).then(m => m.delete({timeout: 5000, reason:"It had to be done"}));
            message.delete({timeout: 5000, reason:"It had to be done"});
        }
    }
};
