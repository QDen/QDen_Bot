const { stripIndents } = require("common-tags");
const Pagination = require("discord-paginationembed");
const { MessageEmbed } = require("discord.js");
const mongoose = require('mongoose');

const colors = require("../../colors.json");
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

        let toFind;
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
            const status = toFind.presence.status;

            const staffMember = await StaffSheets.findOne({ $or: [ { name: toFind.user.username }, { uid: toFind.id } ] }).exec();
            if (staffMember) {
                const embed = new MessageEmbed()
                    .setTitle("Staff Member found!")
                    .setColor(colors.Turquoise)
                    .setThumbnail(toFind.user.displayAvatarURL())
                    .addFields(
                        {
                            name: "Name:",
                            value: staffMember.name,
                            inline: true,
                        },
                        {
                            name: "Age:",
                            value: staffMember.age,
                            inline: true,
                        },
                        {
                            name: "Gender:",
                            value: staffMember.gender,
                            inline: true,
                        },
                        {
                            name: "Position:",
                            value: staffMember.position,
                            inline: true,
                        },
                        {
                            name: "Occupation:",
                            value: staffMember.occupation,
                            inline: true,
                        },
                        {
                            name: "Schedule:",
                            value: staffMember.schedule,
                            inline: true,
                        },
                        {
                            name: "Contact:",
                            value: staffMember.contact,
                            inline: true,
                        },
                        {
                            name: "Status:",
                            value: `${status[0].toUpperCase() + status.slice(1)}`,
                            inline: true,
                        },
                        {
                            name: "Date Modified:",
                            value: staffMember.dateModified.map(date => date.toLocaleDateString('en-PH', options)),
                            inline: true,
                        }
                    )
                    .setFooter(`${bot.user.username} | MahoMuri`, bot.user.displayAvatarURL());
                message.channel.send(embed);
            } else {
                const embed = new MessageEmbed()
                    .setDescription("❌ **Staff Member not found!**")
                    .setColor(colors.Red);
                message.channel.send(embed);
            }
        } else {
            const regex = /\s*(?:[,|`])\s*/g;
            toFind = args.join(" ").split(regex).filter(arg => arg !== "");
            const staffMember = await StaffSheets.findOne({ $or: [
                { uid: toFind[0] },
                { name: toFind[0] },
            ] }).exec();
            if (staffMember) {
                const member = message.guild.member(staffMember.uid);
                const status = member.presence.status;
                const embed = new MessageEmbed()
                    .setTitle("Staff Member found!")
                    .setColor(colors.Turquoise)
                    .setThumbnail(message.guild.member(staffMember.uid).user.displayAvatarURL())
                    .addFields(
                        {
                            name: "Name:",
                            value: staffMember.name,
                            inline: true,
                        },
                        {
                            name: "Age:",
                            value: staffMember.age,
                            inline: true,
                        },
                        {
                            name: "Gender:",
                            value: staffMember.gender,
                            inline: true,
                        },
                        {
                            name: "Position:",
                            value: staffMember.position,
                            inline: true,
                        },
                        {
                            name: "Occupation:",
                            value: staffMember.occupation,
                            inline: true,
                        },
                        {
                            name: "Schedule:",
                            value: staffMember.schedule,
                            inline: true,
                        },
                        {
                            name: "Contact:",
                            value: staffMember.contact,
                            inline: true,
                        },
                        {
                            name: "Status:",
                            value: `${status[0].toUpperCase() + status.slice(1)}`,
                            inline: true,
                        },
                        {
                            name: "Date Modified:",
                            value: staffMember.dateModified.map(date => date.toLocaleDateString('en-PH', options)),
                            inline: true,
                        }
                    )
                    .setFooter(`${bot.user.username} | MahoMuri`, bot.user.displayAvatarURL());
                message.channel.send(embed);
            } else {
                const embed = new MessageEmbed()
                    .setDescription("❌ **Staff Member not found!**")
                    .setColor(colors.Red);
                message.channel.send(embed);
            }
        }


    },
};
