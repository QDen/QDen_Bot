const { MessageEmbed } = require("discord.js");

const colors = require(`../colors.json`);
const fs = require("fs");

const bots = JSON.parse(fs.readFileSync(`${__dirname}/../bots.json`, "utf-8"));

module.exports = (bot) => {
    bot.on("messageReactionAdd", async (reaction, user) => {
        const carlbot = reaction.message.guild.roles.cache
            .find((role) => role.name === "BOTS")
            .members.find((m) => m.user.username === "Carl-bot");

        if (
            bots[carlbot.user.id] &&
            bots[carlbot.user.id].status === "online"
        ) {
            const logChannel = await bot.channels.cache.get(
                "694217906296455188"
            );
            const verificationChannel = await bot.channels.cache.get(
                "694572542236688437"
            );
            const verificationMessage = await verificationChannel.messages.fetch(
                "737708438456369293"
            );

            if (reaction.partial) {
                try {
                    await reaction.fetch();
                } catch (err) {
                    console.log(
                        "Something went wrong while fetching the message.",
                        err
                    );
                }
            }

            const member = reaction.message.guild.member(user);
            const role = member.guild.roles.cache.find(
                (role) => role.name === "Q-tizens"
            );

            if (
                reaction.emoji.name === "✅" &&
                reaction.message.content === verificationMessage.content
            ) {
                if (member.roles.cache.has(role.id)) {
                    user.send(`You are already a Q-tizen!`);
                    return;
                }
                await member.roles.add(role);

                const lEmbed = new MessageEmbed()
                    .setTitle("New Q-tizen!")
                    .setColor(colors.Green)
                    .setThumbnail(member.user.displayAvatarURL())
                    .setDescription(
                        `**${member.displayName}** has became and official member of the Q-Den Family!`
                    );

                logChannel.send(lEmbed);
            }
        }
    });
};
