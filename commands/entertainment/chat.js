const axios = require("axios");
const colors = require("../../colors.json");
const { MessageEmbed } = require('discord.js');
const { getMember } = require('../../functions.js');

module.exports = {
    name: "chat",
    aliases: ["talk"],
    category:"entertainment",
    description: "come and talk to me.",
    usage: [`\`q!<command | alias>\``],
    run: async (bot, message, args) => {

        if (!args[0]) {
            return message.channel.send(`❌ ERROR: please put a message!`);
        }
        const toSend = args.join(" ");
        
        const { data } = await axios.get(`https://some-random-api.ml/chatbot?message=${toSend}`).catch(err => {
            console.log(err);
            return message.channel.send('My servers got overloaded! Please try again in 5 seconds.');

        });
        //console.log(toSend);
        message.channel.send(data.response);
    }
};
