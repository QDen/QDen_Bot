const Pagination = require("discord-paginationembed");
const { MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");
const ms = require("ms");

const StaffSheets = require("../../models/staffsheets");
const colors = require("../../colors.json");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "stafflist",
    aliases: ["stlist"],
    category: "staffs",
    description: "Lists all of the Staff Members",
    usage: ["`-<command | alias>`"],
    async run(bot, message, args) {
        const embeds = [];
        const staffMembers = await StaffSheets.find().exec();

        staffMembers.forEach((staff) => {
            const member = message.guild.member(staff.uid);
            const active = member.user.presence.activities.length;
            const activity = member.presence.activities[0];
            const status = member.presence.status;

            const embed = new MessageEmbed()
            .setThumbnail(message.guild.member(staff.uid).user.displayAvatarURL())
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
                },
                {
                    name: "Status:",
                    value: `${status[0].toUpperCase() + status.slice(1)}`,
                    inline: true,
                }
            );
            
            if(active) {
                if(activity.type === "CUSTOM_STATUS"){
                    embed.addField("Currently has a ",`**${activity}**`,true);
                }
                else{
                    const presence = member.user.presence.activities[0].type;
                    embed.addField(`Currently ${presence[0] + presence.toLowerCase().slice(1)}`, stripIndents`**${presence[0] + presence.toLowerCase().slice(1)}**: ${activity}`,true);
    
                }
            }
            embeds.push(embed);
        });

        await message.channel.send(`✅ **Detected ${staffMembers.length} staff member${staffMembers.length === 1 ? "":"s"}!**`);
        new Pagination.Embeds()
            .setArray(embeds)
            .setAuthorizedUsers(message.author.id)
            .setChannel(message.channel)
            .setPageIndicator(true)
            .setPage(1)
            .setTimeout(ms("10m"))
            .setDeleteOnTimeout(true)
            // Methods below are for customising all embeds
            .setColor(colors.Turquoise)
            .setFooter(`${bot.user.username} | Bound to: ${message.author.username}`, bot.user.displayAvatarURL())
            .build();
    },
};
