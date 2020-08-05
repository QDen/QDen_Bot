/**
 * @file premiumTier listener
 */
const { MessageEmbed } = require('discord.js');
const colors = require('../colors.json');


 module.exports = async bot =>{

    // bot.on('guildUpdate' , async (oldGuild, newGuild) =>{
    //     const channel = bot.channels.cache.get('740615971038822500');
    //     const testChannel = bot.channels.cache.get('694568193292763157');
    //     const basic = oldGuild.premiumSubscriptionCount;
    //     const premium = newGuild.premiumSubscriptionCount;
    //     const date = new Date(Date.now());

    //     if (oldGuild.name && oldGuild.name !== newGuild.name) {
    //         const subscriber = newGuild.members.cache
    //         .map(m => m.premiumSince);
    //         const member = newGuild.members.cache.filter(m => m.premiumSince);
            
            
    //         const dates = subscriber.filter(function(m) {
    //             return m !== null;
    //         });

    //         let subscribers = [];

    //         for (let i = 0; i < dates.length; i++) {
    //             if (dates.length === 0) {
    //                 subscribers =`${i + 1}. ${new Date(dates[i])}`;
    //             } else {
    //                 subscribers = subscribers + `${i + 1}. ${new Date(dates[i])}\n`;
    //             }
    //         }

    //         console.log(member.filter(function(member) {
    //             return member.user.username;
    //         }));

    //         // const embed = new MessageEmbed()
    //         //     .setTitle('**New Server Boost!**')
    //         //     .setDescription(`Cheers! ${member} has just boosted the server!`)
    //         //     .setColor(colors.Blue);
    //         // channel.send(embed);
    //     }

    // });
 };