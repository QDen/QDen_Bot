//const colors = require("../../colors.json");
const { stripIndents } = require("common-tags");
const Discord = require('discord.js');


module.exports = {
  name: "serverinfo",
  aliases: ["info", "aboutme"],
  category:"info",
  usage: "<prefix>[command | alias]",
  run: async (bot, message, args) => {
    //const member = getMember(message, args.join(" "));

    const staff = message.guild.roles.cache
    .get('690507218650660874').members
    .map(m => m.user.username);

    const CoOwner = message.guild.roles.cache
    .get('737698900517060669').members
    .map(m => m.user.username);

    let staffList = [];
    let CoOwnerList = [];

    for (let i = 0; i < staff.length; i++) {
      if (staffList.length === 0) {
        staffList = `${i + 1}. ${staff[i]}\n`;
      } else {
        staffList = staffList + `${i + 1}. ${staff[i]}\n`;
      }
    }

    for (let i = 0; i < CoOwner.length; i++) {
      if (CoOwnerList.length === 0) {
        CoOwnerList = `${i + 1}. ${CoOwner[i]}\n`;
      } else {
        CoOwnerList = CoOwnerList + `${i + 1}. ${CoOwner[i]}\n`;
      }
      
    }

    let sEmbed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle("Server Info")
    .setThumbnail(bot.user.displayAvatarURL())
    .setAuthor(`${message.guild.name}`, bot.user.displayAvatarURL())
    .addFields(
      { name: stripIndents `**Display name:**`, value: stripIndents `${message.guild.name}`, inline: true },
      { name: `**Server Owner:**`, value:`${message.guild.owner.user.username}`, inline: true },
      { name: `**Co Owners:**`, value:`${CoOwnerList}`, inline: true },
      { name: `**Staff Members:** `, value:`${staffList}`, inline: true},
      { name: `**Member Count:** `, value:`${message.guild.memberCount}`, inline: true},
      { name: `**Role Count:**`, value:`${message.guild.roles.cache.size}`, inline: true},
      { name: ` **Created At:**`, value:`${message.guild.createdAt}`, inline: true}
    )
    .setTimestamp()
    .setFooter(`QDen | By MahoMuri`, bot.user.displayAvatarURL());
    message.channel.send(sEmbed);

  }

};
