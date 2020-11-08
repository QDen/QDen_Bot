const { stripIndents } = require("common-tags");
const Pagination = require("discord-paginationembed");
const { MessageEmbed } = require("discord.js");
const mongoose = require('mongoose');

const colors = require("../../colors.json");
const { staffInfoEmbed } = require("../../functions");
const StaffSheets = require("../../models/staffsheets");

module.exports = {
    name: "staffinfo",
    aliases: ["stinfo", "staff"],
    category: "staffs",
    description: "Displays the staff info",
    usage: ["`-<command | alias> `"],
    async run(bot, message, args) {
        if (!message.member.hasPermission("MANAGE_GUILD")) {
            const embed = new MessageEmbed()
                .setDescription("**❌ You don't have access to this command!**")
                .setColor(colors.Red);
            return message.channel.send(embed).then((msg) => {
                if (message.channel.messages.resolve(msg.id)) {
                    msg.delete({ timeout: 5000 }).catch(console.error);
                }
            });
        }

        let toFind, staffMember;
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        };

        if (message.mentions.members.first()) {
            toFind = message.mentions.members.first();
            staffMember = await StaffSheets.findOne({ $or: [ { name: toFind.user.username }, { uid: toFind.id } ] }).exec();

        } else {
            const regex = /\s*(?:[,|`])\s*/g;
            toFind = args.join(" ").split(regex).filter(arg => arg !== "");
            staffMember = await StaffSheets.findOne({ $or: [ { uid: toFind[0] }, { name: toFind[0] } ] }).exec();
        }

        if (staffMember) {
            const member = message.guild.member(staffMember.uid);
            const status = member.presence.status;
            const active = member.user.presence.activities.length;
            const activity = member.presence.activities[0];
            const embed = staffInfoEmbed(staffMember, message)
                .addField("Status: ", `${status[0].toUpperCase() + status.slice(1)}`, true)
                .setTitle("Staff Member found!")
                .setColor(colors.Turquoise)
                .setFooter(`${bot.user.username} | MahoMuri`, bot.user.displayAvatarURL());

            if(active) {
                if(activity.type === "CUSTOM_STATUS"){
                    embed.addField(`${activity}:`,`${activity.emoji !== null ? activity.emoji.name:""} ${activity.state}`,true);
                }
                else{
                    const presence = activity.type;
                    embed.addField(`Currently ${presence[0] + presence.toLowerCase().slice(1)}`, stripIndents`**${presence[0] + presence.toLowerCase().slice(1)}**: ${activity}`,true);
    
                }
            }
            message.channel.send(embed);
        } else {
            const embed = new MessageEmbed()
                .setDescription("❌ **Staff Member not found!**")
                .setColor(colors.Red);
            message.channel.send(embed);
        }

    },
};
