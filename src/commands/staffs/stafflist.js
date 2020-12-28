const Pagination = require("discord-paginationembed");
const { MessageEmbed } = require("discord.js");
const ms = require("ms");

const { stripIndents } = require("common-tags");
const StaffSheets = require("../../models/staffsheets");
const colors = require("../../utils/colors.json");
const { staffInfoEmbed } = require("../../utils/functions");

module.exports = {
    name: "stafflist",
    aliases: ["stlist"],
    category: "staffs",
    description: "Lists all of the Staff Members",
    usage: ["`-<command | alias>`"],
    async run(bot, message) {
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

        const embeds = [];
        const staffMembers = await StaffSheets.find().exec();

        if (staffMembers.length === 0) {
            const embed = new MessageEmbed()
                .setDescription("❌ **The Staff Member DataBase is empty!**")
                .setColor(colors.Red);
            return message.channel.send(embed);
        }
        staffMembers.forEach((staff) => {
            const member = message.guild.member(staff.uid);
            const active = member.user.presence.activities.length;
            const activity = member.presence.activities[0];
            const status = member.presence.status;

            const embed = staffInfoEmbed(staff, message)
                .setTitle("Q-Den Staff Members")
                .addField(
                    "Status: ",
                    `${status[0].toUpperCase() + status.slice(1)}`,
                    true
                );

            if (active) {
                if (activity.type === "CUSTOM_STATUS") {
                    embed.addField(
                        `${activity}:`,
                        `${
                            activity.emoji !== null ? activity.emoji.name : ""
                        } ${activity.state}`,
                        true
                    );
                } else {
                    const presence = activity.type;
                    embed.addField(
                        `Currently ${
                            presence[0] + presence.toLowerCase().slice(1)
                        }`,
                        stripIndents`**${
                            presence[0] + presence.toLowerCase().slice(1)
                        }**: ${activity}`,
                        true
                    );
                }
            }
            embeds.push(embed);
        });

        await message.channel.send(
            `✅ **Showing ${staffMembers.length} staff member${
                staffMembers.length === 1 ? "" : "s"
            }!**`
        );
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
            .setFooter(
                `${bot.user.username} | Bound to: ${message.author.username}`,
                bot.user.displayAvatarURL()
            )
            .build();
    },
};
