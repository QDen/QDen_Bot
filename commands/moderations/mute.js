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
            return message.reply("Please provide a person to mute.")
            .then(m => m.delete({timeout: 5000, reason :"It had to be done."}));
        }

        // No reason
        if (!args[1]) {
            return message.reply("Please specify the time!")
            .then(m => m.delete({timeout: 5000, reason :"It had to be done."}));
        }

        // No author permissions
        if (!message.member.hasPermission("MUTE_MEMBERS")) {
            return message.reply("❌ You do not have permissions to mute members. Please contact a staff member")
            .then(m => m.delete({timeout: 5000, reason :"It had to be done."}));

        }
        // No bot permissions
        if (!message.guild.me.hasPermission("MUTE_MEMBERS")) {
            return message.reply("❌ I do not have permissions to mute members. Please contact a staff member")
            .then(m => m.delete({timeout: 5000, reason :"It had to be done."}));
        }

        const toMute = message.mentions.members.first() || message.guild.members.get(args[0]);

        // No member found
        if (!toMute) {
            return message.reply("Couldn't find that member, try again")
            .then(m => m.delete({timeout: 5000, reason :"It had to be done."}));
        }

        // Can't ban urself
        if (toMute.id === message.author.id) {
            return message.reply("You can't mute yourself...")
            .then(m => m.delete({timeout: 5000, reason :"It had to be done."}));
        }

        let muted = message.guild.roles.cache.find(role => role.name === "tuporsiksOwan");
        if (!muted) {
            try {
                muted = await message.guild.roles.create({
                    data: {
                        name: 'MUTED',
                        color: 'BLACK',
                        permissions: []
                    }
                });
                message.guild.channels.cache.forEach(async (channel, id) => {
                    await channel.createOverwrite(muted, {
                        'SEND_MESSAGES': false,
                        'ADD_REACTIONS': false,
                        'CONNECT': false,
                        'SPEAK': false
                    });
                    //message.reply(channel);
                });
            } catch (e) {
                console.log(e.stack);
            }
        }

        let timer = args[1];

        await toMute.roles.add(muted);
        message.channel.send(`Successfuly Muted ${args[0]} for ${ms(ms(timer))}!`).then(m => m.delete({timeout: 15000, reason :"It had to be done."}));

        setTimeout(function(){
            toMute.roles.remove(muted);
            message.channel.send(`${toMute} has been successfully unmuted!`).then(m => m.delete({timeout: 5000, reason :"It had to be done."}));
        }, ms(timer));

    }
};
