const { getMember } = require('../../functions.js');

module.exports = {
    name: "remove",
    aliases: ["umalis"],
    category:"queue",
    description:"Removes the memebr from the queue",
    usage: [`\`q!<command | alias>\``],
    run: async(bot, message, args)=>{

        const dj = message.guild.roles.cache.find(role => role.name === "Queue Master");
        if(!args[0]){
            message.reply('Please provide a member to remove.')
            .then(m => m.delete({timeout: 5000, reason:"It had to be done"}));
            message.delete({timeout: 6000, reason:"It had to be done"});
            return;
        }
        if (!message.member.roles.cache.has(dj.id)) {
            message.reply('You cannot use this command!')
            .then(m => m.delete({timeout: 5000, reason:"It had to be done"}));
            message.delete({timeout: 6000, reason:"It had to be done"});
            return;
        }

        //message.channel.send(args[0]);

        const member = getMember(message, args.join(" "));
        const toRemove = bot.queue.indexOf(member.user);

        //message.channel.send(toRemove);

         if (toRemove === -1) {
            message.channel.send(`Couldn't find that member!`)
            .then(m => m.delete({timeout: 5000, reason:"It had to be done"}));
            message.delete({timeout: 6000, reason:"It had to be done"});
        }
        else {
            message.channel.send(`Successfuly removed ${member} from the queue!`)
            .then(bot.queue.splice(toRemove, 1)).then(m => m.delete({timeout: 5000, reason:"It had to be done"}));
            message.delete({timeout: 6000, reason:"It had to be done"});

        }

    }
};
