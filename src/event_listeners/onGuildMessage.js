/**
 * @file message listener (2/2)
 */
const { DMChannel } = require("discord.js");
const fs = require("fs");

const { default_prefix } = require(`${__dirname}/../utils/botconfig.json`);

module.exports = async (bot) => {
    bot.on("message", async (message) => {
        if (message.channel instanceof DMChannel) {
            return;
        }

        const prefixes = JSON.parse(
            fs.readFileSync(`${__dirname}/../utils/prefixes.json`, "utf8")
        );

        if (!prefixes[message.guild.id]) {
            prefixes[message.guild.id] = {
                prefixes: default_prefix,
            };

            fs.writeFileSync(
                `${__dirname}/../utils/prefixes.json`,
                JSON.stringify(prefixes, null, "\t")
            );
        }

        const lsprfxes = [
            prefixes[message.guild.id].prefixes,
            `<@${bot.user.id}>`,
            `<@&${bot.user.id}>`,
            `<@!${bot.user.id}>`,
        ];

        const prefix = lsprfxes
            .filter((prfx) => message.content.startsWith(prfx))
            .join("");

        if (message.author.bot || !message.guild || prefix.length <= 0) {
            return;
        }

        // If message.member is uncached, cache it.
        if (!message.member) {
            message.member = await message.guild.fetchMember(message);
        }

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();

        if (cmd.length === 0) {
            return;
        }

        // Get the command
        let command = bot.commands.get(cmd);

        // If none is found, try to find it by alias
        if (!command) {
            command = bot.commands.get(bot.aliases.get(cmd));
        }

        // If a command is finally found, run the command
        if (command) {
            command.run(bot, message, args, prefix);
        }
    });
};
