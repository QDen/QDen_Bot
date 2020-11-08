const { MessageAttachment } = require("discord.js");
const QRCode = require('easyqrcodejs-nodejs');
const fs = require("fs");
const ReadableData = require("stream").Readable;
module.exports = {
    name: "test",
    aliases: [""],
    category: "",
    description: "",
    usage: ["`-<command | alias> `"],
    async run(bot, message, args) {
        // // Options
        // const options = {
        //     text: "I made it look better!",
        //     width: 256,
        //     height: 256,
        //     correctLevel : QRCode.CorrectLevel.H,
        //     dotScale: 1,
        //     quality: 1,
        //     quietZone: 10,
        //     quietZoneColor: 'transparent',
        //     logo: message.guild.iconURL({ format: "png" }),
        // };

        // // New instance with options
        // const qrcode = new QRCode(options);

        // // Save QRCode image
        // qrcode.toDataURL().then(data => {
        //     // console.log(data.replace(/^data:image\/png;base64,/, ''));
        //     const imageBufferData = Buffer.from(data.replace(/^data:image\/png;base64,/, ''), "base64");

        //     const qrcode = new MessageAttachment(imageBufferData);

        //     message.channel.send(qrcode);

        // });
        const regex = /\s*(?:[,|`])\s*/g;
        const toFind = message.mentions.members.first() || args.join(" ").split(regex).filter(arg => arg !== "");

        console.log(toFind);

    },
};
