const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const colors = require("../../utils/colors.json");

const prefixes = JSON.parse(
    fs.readFileSync(`${__dirname}/../../utils/prefixes.json`, "utf8")
);

module.exports = {
    name: "prefix",
    aliases: [],
    category: "info",
    description:
        "Displays the prefix of this server or changes the prefix of this server",
    usage: [`\`q!<command | alias> <desired prefix>\``],
    run: async (bot, message, args) => {
        const mode = args[0];
        // checks if mode is true
        if (mode) {
            mode.toLowerCase();
            // checks if mode is equal to set
            if (mode === "set") {
                if (!message.member.hasPermission("MANAGE_GUILD")) {
                    message.reply("You don't have the permission to do this!");
                    return;
                }
                // checks for prefix to be given
                if (!args[1]) {
                    message.channel.send("You must provide a prefix!");
                    return;
                }

                prefixes[message.guild.id] = {
                    prefixes: args[1],
                };

                fs.writeFileSync(
                    "./src/utils/prefixes.json",
                    JSON.stringify(prefixes, null, "\t"),
                    (err) => {
                        if (err) {
                            console.error(err);
                        }
                    }
                );

                const sEmbed = new MessageEmbed()
                    .setColor(colors.Green_Sheen)
                    .setTitle("Prefix Set!")
                    .setDescription(`Server's prefix is set to \`${args[1]}\``);

                message.channel.send(sEmbed);
            } else {
                message.channel.send(
                    `**I don't know the command** \`${mode}\``
                );
            }
        } else {
            const pEmbed = new MessageEmbed()
                .setColor(colors.Dark_Pastel_Blue)
                .setTitle("Server's Prefix").setDescription(`**Prefix is \`${
                prefixes[message.guild.id].prefixes
            }\`**
                Type \`${
                    prefixes[message.guild.id].prefixes
                }prefix set <prefix here>\` to change this server's prefix!`);
            message.channel.send(pEmbed);
        }
    },
};
