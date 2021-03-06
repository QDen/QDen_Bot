const fs = require("fs");

const bots = JSON.parse(
    fs.readFileSync(`${__dirname}/../utils/bots.json`, "utf-8")
);

module.exports = (bot) => {
    bot.on("presenceUpdate", async (oldPresence, newPresence) => {
        if (
            newPresence.member.roles.cache.has("805793096490549259") &&
            newPresence.status === "online"
        ) {
            if (
                newPresence.activities.length > 0 &&
                newPresence.status === "online"
            ) {
                return;
            }
            console.log(`${newPresence.user.username} has come online`);

            if (!bots[newPresence.userID]) {
                bots[newPresence.userID] = {
                    name: newPresence.user.username,
                    status: newPresence.status,
                };

                fs.writeFileSync(
                    `${__dirname}/../utils/bots.json`,
                    JSON.stringify(bots, null, "\t")
                );
            }

            if (bots[newPresence.userID].status === "offline") {
                bots[newPresence.userID].status = newPresence.status;

                fs.writeFileSync(
                    `${__dirname}/../utils/bots.json`,
                    JSON.stringify(bots, null, "\t")
                );
            }

            // if (newPresence.user.username === "Carl-bot") {
            //     const staffchat = await newPresence.guild.channels.cache.find(
            //         (c) => c.id === "805793217090027561"
            //     );
            //     const embed = new MessageEmbed()
            //         .setTitle(`${newPresence.user.username} is now online!`)
            //         .setDescription(
            //             "I have now disabled temporary verifications!"
            //         )
            //         .setColor(colors.Green);
            //     staffchat.send(embed);
            // }
        } else if (
            newPresence.member.roles.cache.has("805793096490549259") &&
            newPresence.status === "offline"
        ) {
            console.log(`${newPresence.user.username} has gone offline`);
            if (!bots[newPresence.userID]) {
                bots[newPresence.userID] = {
                    name: newPresence.user.username,
                    status: newPresence.status,
                };

                fs.writeFileSync(
                    `${__dirname}/../utils/bots.json`,
                    JSON.stringify(bots, null, "\t")
                );
            }

            if (bots[newPresence.userID].status === "online") {
                bots[newPresence.userID].status = newPresence.status;

                fs.writeFileSync(
                    `${__dirname}/../utils/bots.json`,
                    JSON.stringify(bots, null, "\t")
                );
            }

            // if (newPresence.user.username === "Carl-bot") {
            //     const staffchat = await newPresence.guild.channels.cache.find(
            //         (c) => c.id === "805793217090027561"
            //     );
            //     const embed = new MessageEmbed()
            //         .setTitle(`${newPresence.user.username} has gone offline!`)
            //         .setDescription(
            //             "I have now enabled temporary verifications!"
            //         )
            //         .setColor(colors.Red);
            //     staffchat.send(embed);
            // }
        }
    });
};
