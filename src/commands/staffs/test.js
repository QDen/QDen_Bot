const { JWT } = require("google-auth-library");
const { google } = require("googleapis");

module.exports = {
    name: "test",
    aliases: [""],
    category: "",
    description: "",
    usage: ["`-<command | alias> `"],
    async run(bot, message, args) {
        // https://docs.google.com/spreadsheets/d/15PUfYN8vta0bdWeOydwdk3HEPFZ07wHcl6Otbg04emk/edit#gid=1750226729
        // TODO: Implement this to tournamnet sheets

        if (args.length < 1) {
            message.channel.send("**❌ Please provide a valid URL**");
        } else {
            const client = new JWT({
                email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                key: process.env.GOOGLE_PRIVATE_KEY,
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
