const { MessageEmbed } = require("discord.js");
const colors = require("../../utils/colors.json");

module.exports = {
    name: "substats",
    aliases: [],
    category: "info",
    description: "Displays the subscription status of the server",
    usage: `\`q!<command | alias>\``,
    run: async (bot, message) => {
        const guild = bot.guilds.cache.get(message.guild.id);
        const emoji = guild.emojis.cache.find(
            (emoji) => emoji.name === "boost_animated"
        );
        const subscribers = guild.members.cache
            .map((m) => {
                let subscribers = {};
                const username = m.user.username;
                const userid = m.user.id;
                const premium = m.premiumSince;
                subscribers = {
                    username,
                    id: userid,
                    premium,
                };
                return subscribers;
            })
            .filter((m) => m.premium !== null)
            .sort((a, b) => b.premium - a.premium);

        let subscriberList = [];
        for (let i = 0; i < subscribers.length; i++) {
            if (subscribers.length === 0) {
                subscriberList = `${i + 1}. ${subscribers[i].username}`;
            } else {
                subscriberList += `${i + 1}. ${subscribers[i].username}\n`;
            }
        }

        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        let subscribedAt = [];
        for (let i = 0; i < subscribers.length; i++) {
            if (subscribers.length === 0) {
                subscribedAt = `${subscribers[i].premium.toLocaleDateString(
                    "en-US",
                    options
                )}`;
            } else {
                subscribedAt += `${subscribers[i].premium.toLocaleDateString(
                    "en-US",
                    options
                )}\n`;
            }
        }

        const levels = [0, 2, 15, 30];
        const boosts = guild.premiumSubscriptionCount;
        let boostGap;

        if (boosts < levels[3] && boosts > levels[2]) {
            boostGap = levels[3] - boosts;
        } else if (boosts < levels[2] && boosts > levels[1]) {
            boostGap = levels[2] - boosts;
        } else if (boosts < levels[1] && boosts > levels[0]) {
            boostGap = levels[1] - boosts;
        } else {
            boostGap = 0;
        }

        const embed = new MessageEmbed()
            .setTitle(`${emoji} **Server Boost Status**`)
            .setColor(colors.Cotton_Candy)
            .addFields(
                {
                    name: "Number of boosts:",
                    value: `${guild.premiumSubscriptionCount} boosts`,
                    inline: true,
                },
                {
                    name: "Current Boost Level:",
                    value: `Level ${guild.premiumTier}`,
                    inline: true,
                },
                {
                    name: "Boosts left until the next level:",
                    value: `${boostGap} boosts more!`,
                    inline: true,
                },
                {
                    name: "Current Server Boosters:",
                    value: `${subscriberList}`,
                    inline: true,
                },
                {
                    name: "Boosted on:",
                    value: `${subscribedAt}`,
                    inline: true,
                }
            );
        message.channel.send(embed);
    },
};
