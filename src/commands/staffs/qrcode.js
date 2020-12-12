const { MessageAttachment } = require("discord.js");
const QRCode = require("easyqrcodejs-nodejs");

module.exports = {
    name: "qrcode",
    aliases: ["mkqr"],
    category: "staffs",
    description: "Creates QRCode",
    usage: ["`-<command | alias> < to QR Code >`"],
    async run(bot, message, args) {
        const toQR = args.join(" ");

        if (!toQR) {
            return message.channel.send(
                "**❌ Please put a value to generate!**"
            );
        }

        // Options
        const options = {
            text: toQR,
            width: 256,
            height: 256,
            correctLevel: QRCode.CorrectLevel.H,
            dotScale: 1,
            quality: 1,
            quietZone: 10,
            quietZoneColor: "transparent",
            logo: message.guild.iconURL({ format: "png" }),
        };

        // New instance with options
        const qrcode = new QRCode(options);

        // Save QRCode image
        qrcode.toDataURL().then(async (data) => {
            const imageBufferData = Buffer.from(
                data.replace(/^data:image\/png;base64,/, ""),
                "base64"
            );
            const qrcode = new MessageAttachment(imageBufferData);

            await message.channel.send(
                `✅ **QR Code for \`${toQR}\` successfully generated!**`
            );
            message.channel.send(qrcode);
        });
    },
};
