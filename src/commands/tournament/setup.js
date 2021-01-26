const { MessageEmbed } = require("discord.js");
const { JWT } = require("google-auth-library");
const { google } = require("googleapis");

const colors = require("../../utils/colors.json");

module.exports = {
    name: "setup",
    aliases: [],
    category: "tournament",
    description: "Creates a Trounament environment for a specific game",
    usage: ["`-<command | alias> `"],
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
            message.channel.send("**❌ Please provide a valid URL**");
        } else {
            const client = new JWT({
                email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, "\n"),
                scopes: ["https://www.googleapis.com/auth/spreadsheets"],
                subject: null,
            });
            const sheets = google.sheets({
                version: "v4",
                auth: client,
            });
            const url = new URL(args.join(""));
            const regex = /([^spreadsheets?:\/\s])([^\/\s]+)([^\/edit\s])/g;
            const spreadsheetID = url.pathname.match(regex).join("");
            const res = await sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetID,
                range: "A1:Z",
            });
            console.log(res.data.values);
        }
    },
};
