const { MessageAttachment } = require("discord.js");
const QRCode = require('easyqrcodejs-nodejs');
const fs = require("fs");
const ReadableData = require("stream").Readable;
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
        google.options({
            auth: JSON.stringify(require("../../QDen-google.json")),
        });
        const sheets = google.sheets("v4");
        const url = new URL(args.join(""));
        const regex = /([^spreadsheets?:\/\s])([^\/\s]+)([^\/edit\s])/g;
        const spreadsheetId = url.pathname.match(regex).join("");
        const res = await sheets.spreadsheets.values.get(
            {
                spreadsheetId: spreadsheetId,
                range: "A2:Z",
            }
        );

        console.log(res.data.values);
        // const auth = new google.auth.GoogleAuth({
            
        // })
        // console.log(JSON.stringify(require("../../QDen-google.json")));

    },
};
