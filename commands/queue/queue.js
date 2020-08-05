module.exports = {
    name: "queue",
    aliases: ["qwekqwek", "q"],
    category:"queue",
    description: "Puts you in the queue",
    usage: [`\`q!<command | alias>\``],
    run: async(bot, message, args)=>{

        let index = 0;


        while (bot.queue[index] !== message.author && index !== bot.queue.length) {
            ++index;
        }

        if (index === bot.queue.length) {
            message.channel.send(`Successfuly added <@${message.author.id}> to the queue!`)
            .then(bot.queue.push(message.author)).then(m => m.delete({timeout: 5000, reason:"It had to be done"}));
            message.delete({timeout: 6000, reason:"It had to be done"});
        }
        else {
            message.reply(`You are already in the queue!`)
            .then(m => m.delete({timeout: 5000, reason:"It had to be done"}));
            message.delete({timeout: 6000, reason:"It had to be done"});
        }

    }
};
