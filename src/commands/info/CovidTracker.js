const rp = require("request-promise");
const $ = require("cheerio");

const url = "https://www.worldometers.info/coronavirus/?";
const phurl = "https://www.worldometers.info/coronavirus/country/philippines/";
const { MessageEmbed } = require("discord.js");
const colors = require("../../colors.json");
const { addCommas } = require("../../functions.js");

module.exports = {
    name: "covid",
    aliases: ["ctracker"],
    category: "info",
    description: "Sends a message about the current status of COVID-19",
    usage: ["q!<command | alias>"],
    run: async (bot, message) => {
        const guild = bot.guilds.cache.get("690499818489118722");
        const channel = guild.channels.cache.find(
            (c) => c.id === "739175214344044586"
        );

        const title = [];
        const data = [];
        const embed = new MessageEmbed();

        message.react("👌");
        rp(url)
            .then((html) => {
                let allCases = 0;
                let deaths = 0;
                let recovered = 0;
                let ActiveCases = 0;

                // success!
                $("h1", html).each(function (i) {
                    title[i] = $(this).text();
                });
                $(".maincounter-number", html).each(function (i) {
                    data[i] = $(this).text();
                });

                allCases = parseInt(data[0].replace(/,/g, ""));
                deaths = parseInt(data[1].replace(/,/g, ""));
                recovered = parseInt(data[2].replace(/,/g, ""));
                ActiveCases = allCases - deaths - recovered;

                embed
                    .setTitle(
                        `
                        ┌─────────── ∘°❉°∘ ────────────┐
                                **Corona Tracker**
└─────────── °∘❉∘° ────────────┘`
                    )
                    .setDescription("🌎 **Worldwide**\n")
                    .addFields(
                        {
                            name: `🦠 Confirmed Cases:`,
                            value: `**${data[0].trim()}**`,
                            inline: true,
                        },
                        {
                            name: `🤒 Active Cases:`,
                            value: `**${addCommas(ActiveCases)}**`,
                            inline: true,
                        },
                        {
                            name: `☠️ Deaths:`,
                            value: `**${data[1].trim()}**`,
                            inline: true,
                        },
                        {
                            name: `💕Recovered:`,
                            value: `**${data[2].trim()}**`,
                            inline: true,
                        },
                        {
                            name: "\u2800",
                            value: `✩｡:*•.────────────  ❁ ❁  ─────────────.•*:｡✩`,
                        }
                    )
                    .setColor(colors.Covid)
                    .setTimestamp()
                    .setFooter(
                        `Q-Den | By MahoMuri`,
                        bot.user.displayAvatarURL()
                    );

                channel.startTyping();
            })
            .catch((err) => {
                // handle error
                console.log(err);
            })
            .finally(() => {
                rp(phurl)
                    .then(async (html) => {
                        let allCases = 0;
                        let deaths = 0;
                        let recovered = 0;
                        let ActiveCases = 0;

                        // success!
                        $("h1", html).each(function (i) {
                            title[i] = $(this).text();
                        });

                        $(".maincounter-number", html).each(function (i) {
                            data[i] = $(this).text();
                        });

                        allCases = parseInt(data[0].replace(/,/g, ""));
                        deaths = parseInt(data[1].replace(/,/g, ""));
                        recovered = parseInt(data[2].replace(/,/g, ""));
                        ActiveCases = allCases - deaths - recovered;

                        embed.addFields(
                            {
                                name: `\u2800`,
                                value: `:flag_ph: **${title[0].trim()}**`,
                            },
                            {
                                name: `🦠 Confirmed Cases:`,
                                value: `**${data[0].trim()}**`,
                                inline: true,
                            },
                            {
                                name: `🤒 Active Cases:`,
                                value: `**${addCommas(ActiveCases)}**`,
                                inline: true,
                            },
                            {
                                name: `☠️ Deaths:`,
                                value: `**${data[1].trim()}**`,
                                inline: true,
                            },
                            {
                                name: `💕Recovered:`,
                                value: `**${data[2].trim()}**`,
                                inline: true,
                            }
                        );
                        await channel.send(embed);
                        channel.stopTyping();
                        message.delete();
                    })
                    .catch((err) => {
                        // handle error
                        console.log(err);
                    });
            });
    },
};
