/**
 * @file ready listener
 */
const ms = require("ms");
const mongoose = require("mongoose");
const { statusMessages } = require("../utils/statuses.json");

module.exports = async (bot) => {
    bot.on("ready", async () => {
        // Initialize connection to Main DataBase
        await mongoose
            .connect(process.env.STAFF_SHEET_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false,
            })
            .then((connection) => {
                if (connection.connections[0].readyState === 1) {
                    console.log(
                        `✅ Successfully connected to ${connection.connections[0].name} DataBase!`
                    );
                }
            })
            .catch((err) => console.log("Error on staffsheet\n", err));

        const logChannel = await bot.channels.cache.get("694217906296455188");
        const logMsg = `✅ **${bot.user.username} Bot is online!**`;

        // logChannel.send(logMsg);
        console.log(logMsg);
        bot.user
            .setActivity(" q!help | with you", {
                type: "LISTENING",
            })
            .then(() => {
                setInterval(() => {
                    const status =
                        statusMessages[
                            Math.floor(Math.random() * statusMessages.length)
                        ];

                    bot.user.setActivity(status, {
                        type: "LISTENING",
                    });
                }, ms("10 minutes"));
            });

        bot.error = await bot.channels.cache.find(
            (ch) => ch.id === "774273629147103283"
        );
    });
};
