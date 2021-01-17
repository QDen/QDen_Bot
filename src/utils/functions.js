/* eslint-disable no-useless-concat */
const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");
const colors = require("./colors.json");

class Utilities {
    static validURL(str) {
        let check;
        try {
            new URL(str);
            check = true;
        } catch (error) {
            check = false;
        }

        return check;
    }

    static getMember(message, toFind = "") {
        toFind.toLowerCase();

        let target = message.guild.roles.cache.get(toFind);

        if (!target && message.mentions.members) {
            target = message.mentions.members.first();
        }

        if (!target && toFind) {
            target = message.guild.roles.cache.find(
                (member) =>
                    member.displayName.toLowerCase().includes(toFind) ||
                    member.user.tag.toLowerCase().includes(toFind)
            );
        }

        if (!target) {
            target = message.member;
        }

        return target;
    }

    static formatDate(date) {
        return new Intl.DateTimeFormat("en-US").format(date);
    }

    static async promptMessage(message, author, time, validReactions) {
        // We put in the time as seconds, with this it's being transfered to MS
        time *= 1000;

        // For every emoji in the static parameters, react in the good order.
        validReactions.forEach(async (reaction) => {
            await message.react(reaction);
        });

        // Only allow reactions from the author,
        // and the emoji must be in the array we provided.
        const filter = (reaction, user) =>
            validReactions.includes(reaction.emoji.name) &&
            user.id === author.id;

        // And ofcourse, await the reactions
        const reactions = message
            .awaitReactions(filter, { max: 1, time, errors: ["time"] })
            .then(
                (collected) => collected.first() && collected.first().emoji.name
            )
            .catch(async () => {
                await message.delete();
                message.channel.send(
                    "**❌ Session Expired, please try again.**"
                );
            });

        return reactions;
    }

    static computeAge(birthDate) {
        const diff_ms = Date.now() - new Date(birthDate).getTime();
        const age_dt = new Date(diff_ms);
        const age = Math.abs(age_dt.getUTCFullYear() - 1970);

        return age;
    }

    static isLeapYear(year) {
        let leapYear = new Date(year, 1, 29).getMonth();

        if (leapYear === 1) {
            leapYear = true;
        } else {
            leapYear = false;
        }

        return leapYear;
    }

    static async paginationEmbed(
        msg,
        channel,
        ticket,
        pages,
        emojiList,
        idleTimer = 120000
    ) {
        if (!msg && !msg.channel) {
            throw new Error("Channel is inaccessible.");
        }
        if (!pages) {
            throw new Error("Pages are not given.");
        }

        let page = 0;

        await channel.send(`Hello ${msg.author}! Welcome to your ticket!`);
        const curPage = await channel.send(
            pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)
        );
        emojiList.slice(1).forEach(async (emoji) => {
            await curPage.react(emoji);
        });
        const reactionCollector = curPage.createReactionCollector(
            (reaction, user) =>
                emojiList.includes(reaction.emoji.name) && !user.bot,
            { idle: idleTimer }
        );
        reactionCollector.on("collect", async (reaction) => {
            reaction.users.remove(msg.author);
            switch (reaction.emoji.name) {
                case emojiList[0]:
                    page = 0;
                    curPage.reactions.removeAll().then(async () => {
                        emojiList.slice(1).forEach(async (emoji) => {
                            await curPage.react(emoji);
                        });
                    });
                    break;
                case emojiList[1]:
                    page = 1;
                    break;
                case emojiList[2]:
                    page = 2;
                    break;
                case emojiList[3]:
                    page = 3;
                    break;
                case emojiList[4]:
                    reactionCollector.stop(["User assisted!"]);
                    return;
                default:
                    break;
            }
            curPage
                .edit(
                    pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)
                )
                .then(async () => {
                    if (page !== 0) {
                        curPage.reactions.removeAll();
                        await curPage.react(emojiList[0]);
                        await curPage.react(emojiList[4]);
                    }
                });
        });

        reactionCollector.on("end", async () => {
            await channel.send(`Closing ticket...`);
            await curPage.reactions.removeAll();
            await curPage.delete();
            await ticket.delete();
            await channel.delete();
        });
    }

    static addCommas(nStr) {
        nStr += "";
        const x = nStr.split(".");
        let x1 = x[0];
        const x2 = x.length > 1 ? `.${x[1]}` : "";
        const rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, "$1" + "," + "$2");
        }
        return x1 + x2;
    }

    static filterBreed(sentence, common) {
        const wordArr = sentence.match(/\w+/g);
        const commonObj = {};
        const uncommonArr = [];
        let word;
        let i;

        common = common.split(",");
        for (i = 0; i < common.length; i++) {
            commonObj[common[i].trim()] = true;
        }

        for (i = 0; i < wordArr.length; i++) {
            word = wordArr[i].trim().toLowerCase();
            if (!commonObj[word]) {
                uncommonArr.push(word);
            }
        }

        return uncommonArr.join("-");
    }

    static staffInfoEmbed(staff, message) {
        return new MessageEmbed()
            .setThumbnail(
                message.guild.member(staff.uid).user.displayAvatarURL()
            )
            .addFields(
                {
                    name: "Name:",
                    value: staff.name,
                    inline: true,
                },
                {
                    name: "Age:",
                    value: staff.age,
                    inline: true,
                },
                {
                    name: "Gender:",
                    value: staff.gender,
                    inline: true,
                },
                {
                    name: "Position:",
                    value: staff.position,
                    inline: true,
                },
                {
                    name: "Occupation:",
                    value: staff.occupation,
                    inline: true,
                },
                {
                    name: "Schedule:",
                    value: staff.schedule,
                    inline: true,
                },
                {
                    name: "Contact:",
                    value: staff.contact,
                    inline: true,
                }
            );
    }

    static getStaffInfo(bot, message, time, value, originalValue, staffMember) {
        time *= 1000;

        const filter = (m) => m.author !== bot.user;
        const embed = new MessageEmbed()
            .setTitle(`Changing ${value}.`)
            .setThumbnail(
                message.guild.member(staffMember.uid).user.displayAvatarURL()
            )
            .setDescription(
                stripIndents`*Original value: ${originalValue}*

                **Please enter the new __${value}__ you wish to enter:**`
            )
            .setFooter("Message becomes invalid after 2 mins");
        message.channel.send(embed);

        return message.channel
            .awaitMessages(filter, { max: 1, time })
            .then(
                (collected) => collected.first() && collected.first().content
            );
    }

    static sendError(bot, err, message, cmd) {
        // Sends to error log channel
        const errEmbed = new MessageEmbed()
            .setTitle(`Error on ${message.channel.name}!`)
            .setDescription(
                stripIndents`**Something went wrong while using \`${cmd}\`!**
    
            \`\`\`js
            ${err}
            \`\`\`
            Please attend to this error ASAP!
            `
            )
            .setFooter(
                `${bot.user.username} | MahoMuri`,
                bot.user.displayAvatarURL()
            )
            .setTimestamp()
            .setColor(colors.Red);
        bot.error.send(errEmbed);

        // Sends to user's channel
        const embed = new MessageEmbed()
            .setTitle("Whoops...")
            .setDescription(
                stripIndents`**Something went wrong while using \`${cmd}\`!**
    
            \`\`\`js
            ${err}
            \`\`\`
            This issue has been logged, one of the Team Coders will fix this ASAP.
            `
            )
            .setFooter(
                `${bot.user.username} | MahoMuri`,
                bot.user.displayAvatarURL()
            )
            .setTimestamp()
            .setColor(colors.Red);
        message.channel.send(embed);
    }

    static toSentenceCase(sentence) {
        return sentence[0].toUpperCase() + sentence.slice(1);
    }
}

module.exports = Utilities;
