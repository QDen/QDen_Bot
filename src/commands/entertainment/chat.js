const axios = require("axios");

module.exports = {
    name: "chat",
    aliases: ["talk"],
    category: "entertainment",
    description: "come and talk to me.",
    usage: [`\`q!<command | alias>\``],
    run: async (bot, message, args) => {
        if (!args[0]) {
            message.channel.send(`❌ ERROR: please put a message!`);
            return;
        }
        const toSend = args.join(" ");

        const { data } = await axios
            .get(`https://some-random-api.ml/chatbot?message=${toSend}`)
            .catch((err) => {
                console.log(err);
                message.channel.send(
                    "My servers got overloaded! Please try again in 5 seconds."
                );
            });
        // console.log(toSend);
        message.channel.send(data.response);
    },
};
