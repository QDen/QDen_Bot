const { MessageEmbed } = require("discord.js");

const colors = require("../../utils/colors.json");

module.exports = {
    name: "embed",
    aliases: ["embd"],
    category: "entertainment",
    description: "Creates a message embed.",
    usage: ["`-<command | alias> <embed object>`"],
    async run(bot, message, args) {
        if (!message.member.hasPermission("MANAGE_GUILD")) {
            const embed = new MessageEmbed()
                .setDescription("**❌ You don't have access to this command!**")
                .setColor(colors.Red);
            return message.channel.send(embed).then((msg) => {
                if (message.channel.messages.resolve(msg.id)) {
                    msg.delete({ timeout: 5000 }).catch(console.error);
                }
            });
        }

        if (args.length < 1) {
            message.channel.send("No args!");
        }

        message.channel.startTyping();
        setTimeout(async () => {
            try {
                let object;
                // Catches errors if syntax is invalid.
                try {
                    object = JSON.parse(args.join(" "));
                    console.log(object);
                } catch (error) {
                    // syntax error
                    const embed = new MessageEmbed()
                        .setTitle("Oops!")
                        .setColor(colors.Red)
                        .setDescription(
                            "❌ **Wrong syntax! Must be `JSON` form!**"
                        );
                    message.channel.send(embed);
                    message.channel.stopTyping(true);
                    return;
                }
                const embed = new MessageEmbed(object);
                await message.channel.stopTyping(true);
                message.channel.send(embed);
            } catch (err) {
                console.log(err);
            }
        }, 2000);
        message.delete();
    },
};
