const { JWT } = require("google-auth-library");
const { GoogleSpreadsheet } = require("google-spreadsheet");
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
        // const client = new JWT({
        //     email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        //     key: process.env.GOOGLE_PRIVATE_KEY,
        //     scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        //     subject: null,
        // });

        // const sheets = google.sheets({
        //     version: "v4",
        //     auth: client,
        // });

        const url = new URL(args.join(""));
        const regex = /([^spreadsheets?:\/\s])([^\/\s]+)([^\/edit\s])/g;
        const spreadsheetID = url.pathname.match(regex).join("");

        const sheets = new GoogleSpreadsheet(spreadsheetID);
        await sheets.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY,
        });
        await sheets.loadInfo();
        console.log(sheets.title);
        // const spreadsheet = await sheets.spreadsheets.get({
        //     spreadsheetId: spreadsheetID,
        // });
        // const res = await sheets.spreadsheets.values.get({
        //     spreadsheetId: spreadsheetID,
        //     range: "A2:Z",
        // });

        // console.log(`Showing values for ${spreadsheet.data.properties.title}:`);
        // console.log(res.data.values);
        // console.log(JSON.stringify(require("../../QDen-google.json")));
    },
};
