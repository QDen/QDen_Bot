const mongoose = require("mongoose");
const ms = require("ms");
const Savedlist = require("../../models/savedlist");

let saveTimer;

module.exports = {
    name: "save",
    aliases: ["s"],
    category: "queue",
    description: "Saves the current list to the database",
    usage: [`\`-<command | alias>\``],
    run: async (bot, message, args) => {
        if (bot.queue.length === 0) {
            message
                .reply(":x: **The queue is empty! There is nothing to save!**")
                .then((m) =>
                    m.delete({ timeout: 5000, reason: "It had to be done" })
                );
            message.delete({ timeout: 6000, reason: "It had to be done" });
            return;
        }

        if (bot.queue.length > 0) {
            // ============================ "Debugging" ============================
            // const date = new Date(), y = date.getFullYear(), m = date.getMonth(), d = date.getDate(), h = date.getHours(),
            // min = date.getMinutes(), seconds = date.getSeconds(), ms = date.getMilliseconds();
            // const thisMonth = new Date(y, m, d, h, min, seconds, ms);
            // const lastMonth = new Date(y, m-4, d, h, min, seconds, ms);

            if (args.length !== 0) {
                const mode = args[0].toString().toLowerCase();
                if (mode === "auto") {
                    let interval;
                    if (args[1]) {
                        const check = ms(args.splice(1).join(" "));
                        if (Number.isNaN(check)) {
                            return message.channel.send(
                                "**❌ Error, invalid interval!**"
                            );
                        }
                        if (check < ms("5 minutes")) {
                            return message.channel.send(
                                "**❌ Error, interval cannot be less than 5 minutes!**"
                            );
                        }
                        interval = args[1];
                        message.channel.send(
                            `**✅ Automatic save has been enabled and set to ${ms(
                                ms(interval),
                                { long: true }
                            )}! To stop, type \`q!save stop\`**`
                        );

                        // interval = args[1];
                    } else {
                        interval = "15m";
                        message.channel.send(
                            `**✅ Automatic save has been enabled and set to default value of ${ms(
                                ms(interval),
                                { long: true }
                            )}! To stop, type \`q!save stop\`**`
                        );
                    }
                    // console.log(interval);
                    saveTimer = setInterval(async () => {
                        const members = bot.queue.map((m) => m.id);
                        const list = new Savedlist({
                            author: mongoose.Types.ObjectId(),
                            title: `${message.guild.name}'s Queue`,
                            body: members.toString().split(","),
                            date: Date(),
                        });

                        await message.channel.send("Saving...").then((msg) => {
                            list.save()
                                .then((item) => {
                                    msg.edit(
                                        "✅ **List has been saved successfully to the database!**"
                                    );
                                    console.log(
                                        "✅ **List has been saved successfully to the database!**\n",
                                        item
                                    );
                                })
                                .catch((err) => {
                                    msg.edit(
                                        "❌ **Failed to save list the database! Contact a Programmer for assistance!**"
                                    );
                                    console.log(err);
                                });
                        });
                    }, ms(interval));
                } else if (mode === "stop") {
                    await message.react("👌").then(async (reaction) => {
                        reaction.message.channel
                            .send("**Stopping...**")
                            .then(async (msg) => {
                                clearInterval(saveTimer);
                                msg.edit(
                                    "✅ **Successfully stopped the interval!**"
                                );
                            });
                    });
                }
            } else {
                const members = bot.queue.map((m) => m.id);
                const list = new Savedlist({
                    author: mongoose.Types.ObjectId(),
                    title: `${message.guild.name}'s Queue`,
                    body: members.toString().split(","),
                    date: Date(),
                });

                await message.channel.send("Saving...").then((msg) => {
                    list.save()
                        .then((item) => {
                            msg.edit(
                                "✅ **List has been saved successfully to the database!**"
                            );
                            console.log(
                                "✅ **List has been saved successfully to the database!**\n",
                                item
                            );
                        })
                        .catch((err) => {
                            msg.edit(
                                "🛑 **Failed to save list the database! Contact a Programmer for assistance!**"
                            );
                            console.log(err);
                        });
                });
            }
        }
    },
};
