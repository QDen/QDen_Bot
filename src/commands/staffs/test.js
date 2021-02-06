// const { JWT } = require("google-auth-library");
// const { google } = require("googleapis");

module.exports = {
    name: "test",
    aliases: [""],
    category: "",
    description: "",
    usage: ["`-<command | alias> `"],
    async run(bot, message, args) {
        // test commands
        if (!args.length) {
            console.log("");
        }
    },
};
