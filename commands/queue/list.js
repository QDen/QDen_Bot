const { MessageEmbed } = require('discord.js');
const colors = require('../../colors.json');

module.exports = {
    name: "list",
    aliases: ["listahan"],
    category:"queue",
    description: "Displays the list of the queue",
    usage: [`\`q!<command | alias>\``],
    run: async(bot, message, args)=>{

        if (bot.queue.length === 0) {
            message.reply("The queue is paking empty! Go and add more people!")
            .then(m => m.delete({timeout: 5000, reason:"It had to be done"}));
            message.delete({timeout: 5000, reason:"It had to be done"});
            return;
        }

        const role = message.guild.roles.cache.find(role => role.name === "Performer");
        const member = bot.guilds.cache.get('690499818489118722').member(bot.queue[0]);
        const performer = member.roles.cache.has(role.id);

        if (bot.queue.length > 0) {

            let queueList = [];
            for (let i = 0; i < bot.queue.length; i++) {

                if (i === 0 && performer) {
                    if (queueList.length === 0) {
                        queueList = `${i + 1}. ${bot.queue[i]} (Currently Performing)\n\n`;
                    } else{
                        queueList = queueList + `${i + 1}. ${bot.queue[i]} (Currently Performing)\n\n`;
                    }
                }
                else {
                    if (queueList.length === 0) {
                        queueList = `${i + 1}. ${bot.queue[i]} (Currently Performing)\n\n`;
                    } else{
                        queueList = queueList + `${i + 1}. ${bot.queue[i]} (Currently Performing)\n\n`;
                    }
                }
            }

            let lEmbed = new MessageEmbed()
                .setColor(colors.Green_Sheen)
                .setTitle("**Quareoke Den**")
                .setDescription(queueList)
                .setTimestamp()
                .setFooter("Quareoke Den | By MahoMuri");

            message.channel.send(lEmbed);

            message.delete({timeout: 5000, reason:"It had to be done"});
        }

    }
};
