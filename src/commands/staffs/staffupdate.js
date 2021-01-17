const { MessageEmbed } = require("discord.js");

const { GoogleSpreadsheet } = require("google-spreadsheet");
const StaffSheets = require("../../models/staffsheets");
const colors = require("../../utils/colors.json");
const { updateStaffInfo } = require("../../utils/UpdateStaff");
const config = require("../../utils/botconfig.json");

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
            const sheets = new GoogleSpreadsheet(config.default_spreadsheet);
            await sheets.useServiceAccountAuth({
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY,
            });
            await sheets.loadInfo();

            const embed = new MessageEmbed()
                .setTitle("Spreadsheet Link Established!")
                .setColor(colors.Green)
                .setDescription(`**Now using ${sheets.title}**`);
            message.channel.send(embed);
            await updateStaffInfo(bot, message, staffMember, sheets);
        }
    },
};
