/**
 * @file premiumTier listener
 */
const { MessageEmbed } = require('discord.js');
const colors = require('../colors.json');


 module.exports = async bot =>{

    bot.on('guildUpdate' , async (oldGuild, newGuild) =>{
        const channel = bot.channels.cache.get('740615971038822500');
        const testChannel = bot.channels.cache.get('694568193292763157');
        const oldCount = oldGuild.premiumSubscriptionCount;
        const newCount = newGuild.premiumSubscriptionCount;
        const date = new Date(Date.now());
        //oldGuild.name && newGuild.name !== oldGuild.name

        if (oldCount && newCount > oldCount) {

            const member = newGuild.members.cache
            .map(m => {
                let subscribers = {};
                let username = m.user.username;
                let userid = m.user.id;
                let premium = m.premiumSince;
                subscribers = {
                    username: username,
                    id: userid,
                    premium: premium
                };
                return subscribers;
            })
            .filter(function(m) {
                return m.premium !== null;
            }).sort((a,b) => b.premium - a.premium);

            if (member[0].premium.toLocaleDateString() === date.toLocaleDateString()) {
                const emoji = newGuild.emojis.cache.find(emoji => emoji.name === "boost");
                const embed = new MessageEmbed()
                    .setTitle(`${emoji} ** New Server Boost!**`)
                    .setDescription(`**Cheers! 🎉 <@${member[0].id}> has just boosted the server!**`)
                    .setImage('https://media.giphy.com/media/Is1O1TWV0LEJi/giphy.gif')
                    .setFooter(`${bot.user.username} | By MahoMuri`, bot.user.displayAvatarURL())
                    .setColor(colors.Blue);
                channel.send(embed);
            }

        }

    });
 };