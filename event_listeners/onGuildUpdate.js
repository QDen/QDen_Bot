/**
 * @file premiumTier listener
 */
const { MessageEmbed } = require('discord.js');
const colors = require('../colors.json');


 module.exports = async bot =>{

    bot.on('guildUpdate' , async (oldGuild, newGuild) =>{
        const channel = bot.channels.cache.get('740615971038822500');
        const testChannel = bot.channels.cache.get('694568193292763157');
        const basic = oldGuild.premiumSubscriptionCount;
        const premium = newGuild.premiumSubscriptionCount;
        const date = new Date(Date.now());

        if (oldGuild.name && oldGuild.name !== newGuild.name) {

            const member = newGuild.members.cache
            .map(m => {
                let subscribers = {};
                let username = m.user.username;
                let premium = m.premiumSince;
                subscribers = {
                    username: username,
                    premium: premium
                };
                return subscribers;
            })
            .filter(function(m) {
                return m.premium !== null;
            }).sort((a,b) => b.premium - a.premium);

            if (member[0].premium.toLocaleDateString() === date.toLocaleDateString()) {
                const embed = new MessageEmbed()
                    .setTitle('**New Server Boost!**')
                    .setDescription(`Cheers! ${member[0].username} has just boosted the server!`)
                    .setColor(colors.Blue);
                channel.send(embed);
                
            }


        }

    });
 };