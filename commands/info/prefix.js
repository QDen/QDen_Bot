const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const colors = require("../../colors.json");
const { prefix } = require("../../botprefix.json");
let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));


module.exports = {
    name: "prefix",
    aliases: [""],
    category:"info",
    description: "Displays the prefix of this server or changes the prefix of this server",
    usage: [`\`-<command | alias> <desired prefix>\``],
    run: async(bot, message, args, prefix)=>{
        const guild = bot.guilds.cache.get('690499818489118722');
        const staff = guild.roles.cache.find(role => role.name === 'STAFFS');
        const member = guild.member(message.author);

        if (!args[0]) {

            let pEmbed = new MessageEmbed()
            .setColor(colors.Dark_Pastel_Blue)
            .setTitle("Server's Prefix")
            .setDescription(`Prefix is \`${prefix}\`. You can also use this command to change the prefix of the server.`);

            message.channel.send(pEmbed);
        }
        else {

            if (!member.roles.cache.has(staff.id)) {
                message.reply('You cannot do that.');
            }

            prefixes[message.guild.id] = {
                prefixes: args[0]
            };

            fs.writeFileSync("./prefixes.json", JSON.stringify(prefixes), (err) => {
                if (err) {
                    console.error(err);
                }
            });

            let sEmbed = new MessageEmbed()
                .setColor(colors.Green_Sheen)
                .setTitle("Prefix Set!")
                .setDescription(`Set to \`${args[0]}\``);

            message.channel.send(sEmbed);

        }

    }
};
