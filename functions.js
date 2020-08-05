const { MessageEmbed } = require('discord.js');

module.exports = {
    getMember: function(message, toFind = '') {
        toFind = toFind.toLowerCase();

        let target = message.guild.roles.cache.get(toFind);

        if (!target && message.mentions.members){
            target = message.mentions.members.first();

        }

        if (!target && toFind) {
            target = message.guild.roles.cache.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                member.user.tag.toLowerCase().includes(toFind);
            });
        }

        if (!target){
            target = message.member;

        }

        return target;
    },

    formatDate: function(date) {
        return new Intl.DateTimeFormat('en-US').format(date);
    },

    promptMessage: async function (message, author, time, validReactions) {
        // We put in the time as seconds, with this it's being transfered to MS
        time *= 1000;

        // For every emoji in the function parameters, react in the good order.
        for (const reaction of validReactions) {
            await message.react(reaction);

        }

        // Only allow reactions from the author,
        // and the emoji must be in the array we provided.
        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

        // And ofcourse, await the reactions
        return message
            .awaitReactions(filter, { max: 1, time: time})
            .then(collected => collected.first() && collected.first().emoji.name);
    },

    computeAge: function(birthDate) {
        let diff_ms = Date.now() - new Date(birthDate).getTime();
        let age_dt = new Date(diff_ms);
        let age = Math.abs(age_dt.getUTCFullYear() - 1970);

        return age;
    },

    isLeapYear: function(year) {
        let leapYear = new Date(year, 1, 29).getMonth();

        if (leapYear === 1) {
            leapYear = true;
        }
        else {
            leapYear = false;
        }

        return leapYear;
    },
    paginationEmbed: async function(msg, channel, ticket, pages, emojiList, idleTimer = 120000){
        if (!msg && !msg.channel) {
            throw new Error('Channel is inaccessible.');
        }
        if (!pages) {
            throw new Error('Pages are not given.');
        }

        let page = 0;

        await channel.send(`Hello ${msg.author}! Welcome to your ticket!`);
        const curPage = await channel.send(pages[page].setFooter(`Page ${page + 1} / ${pages.length}`));
        for (const emoji of emojiList.slice(1)) {
            await curPage.react(emoji);
        }
        const reactionCollector = curPage.createReactionCollector(
            (reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot,
            { idle: idleTimer }
        );
        reactionCollector.on('collect', async reaction => {
            reaction.users.remove(msg.author);
            switch (reaction.emoji.name) {
                case emojiList[0]:
                    page = 0;
                    curPage.reactions.removeAll().then(async () => {
                        for (const emoji of emojiList.slice(1)) {
                            await curPage.react(emoji);
                        }
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
                    reactionCollector.stop(['User assisted!']);
                    return;
                default:
                    break;
            }
            curPage.edit(pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)).then(async () => {
                if (page !== 0 ) {
                    curPage.reactions.removeAll();
                    await curPage.react(emojiList[0]);
                    await curPage.react(emojiList[4]);
                }
            });
        });

        reactionCollector.on('end', async () => {
            await channel.send(`Closing ticket...`);
            await curPage.reactions.removeAll();
            await curPage.delete();
            await ticket.delete();
            await channel.delete();

        });
    },
    addCommas: function (nStr){
        nStr += '';
        let x = nStr.split('.');
        let x1 = x[0];
        let x2 = x.length > 1 ? '.' + x[1] : '';
        let rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
         x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    },
    filterBreed: function (sentence, common) {
        let wordArr = sentence.match(/\w+/g),
            commonObj = {},
            uncommonArr = [],
            word, i;

        common = common.split(',');
        for ( i = 0; i < common.length; i++ ) {
            commonObj[ common[i].trim() ] = true;
        }

        for ( i = 0; i < wordArr.length; i++ ) {
            word = wordArr[i].trim().toLowerCase();
            if ( !commonObj[word] ) {
                uncommonArr.push(word);
            }
        }

        return uncommonArr.join('-');
    }
};

