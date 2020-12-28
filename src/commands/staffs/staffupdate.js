const { MessageEmbed } = require("discord.js");

const { stripIndents } = require("common-tags");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const StaffSheets = require("../../models/staffsheets");
const colors = require("../../utils/colors.json");
const { updateStaffInfo } = require("../../utils/UpdateStaff");
const config = require("../../utils/botconfig.json");
const { validURL } = require("../../utils/functions");

module.exports = {
    name: "staffupdate",
    aliases: ["stmodify", "stupdate"],
    category: "staffs",
    description: "Updates information of a staff member.",
    usage: ["`-<command | alias> < Staff Member (Tag or Name) >`"],
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

        const sheets = new GoogleSpreadsheet(
            bot.spreadsheetID !== null
                ? bot.spreadsheetID
                : config.default_spreadsheet
        );
        await sheets.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY,
        });
        await sheets.loadInfo();

        let toModify;
        let staffMember;
        if (message.mentions.members.first()) {
            toModify = message.mentions.members.first();
            staffMember = await StaffSheets.findOne({
                $or: [{ name: toModify.user.username }, { uid: toModify.id }],
            }).exec();
        } else {
            const regex = /\s*(?:[,|`])\s*/g;
            toModify = args
                .join(" ")
                .split(regex)
                .filter((arg) => arg !== "");
            staffMember = await StaffSheets.findOne({
                $or: [{ uid: toModify[0] }, { name: toModify[0] }],
            }).exec();
        }

        if (!staffMember) {
            const embed = new MessageEmbed()
                .setDescription("**❌ Staff Member not found!**")
                .setColor(colors.Red);
            message.channel.send(embed);
        } else {
            // Specify which spreadsheet to work with
            const embed = new MessageEmbed()
                .setTitle("**✅ Member Found!**")
                .setDescription(
                    stripIndents`**Selected Member:** ${staffMember.name}
                **Selected Spreadsheet:** ${sheets.title}
                
                **Is this the right spreadsheet? (Y/n)**`
                );

            message.channel.send(embed);
            const filter = (m) => m.author !== bot.user;
            const channel = message.channel;
            channel
                .awaitMessages(filter, { max: 1 })
                .then(async (collected) => {
                    const choice = collected
                        .first()
                        .content.toLowerCase()
                        .trim();
                    if (choice === "y" || choice === "yes") {
                        await updateStaffInfo(bot, message, staffMember);
                    } else if (choice === "n" || choice === "no") {
                        channel.send(
                            "**Please send the new Google Sheets link**"
                        );
                        channel
                            .awaitMessages(filter, { max: 1 })
                            .then(async (collected) => {
                                const url = collected.first().content;
                                const valid = validURL(url);

                                if (valid) {
                                    const url = new URL(args.join(""));
                                    const regex = /([^spreadsheets?:\/\s])([^\/\s]+)([^\/edit\s])/g;
                                    const spreadsheetID = url.pathname
                                        .match(regex)
                                        .join("");
                                    bot.spreadsheetID = spreadsheetID;
                                    const sheets = new GoogleSpreadsheet(
                                        spreadsheetID
                                    );
                                    await sheets.useServiceAccountAuth({
                                        client_email:
                                            process.env
                                                .GOOGLE_SERVICE_ACCOUNT_EMAIL,
                                        private_key:
                                            process.env.GOOGLE_PRIVATE_KEY,
                                    });
                                    await sheets.loadInfo();

                                    const embed = new MessageEmbed().setDescription(
                                        `**Now using ${sheets.title}**`
                                    );
                                    message.channel.send(embed);
                                } else {
                                    // TODO: Figure out how to repeat this check in case of human error
                                }
                            });
                    }
                });
        }
    },
};
