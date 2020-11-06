const { MessageEmbed } = require("discord.js");

const StaffSheets = require("../../models/staffsheets");
const colors = require("../../colors.json");
const { staffInfoEmbed, promptMessage, getStaffInfo } = require("../../functions");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "staffupdate",
    aliases: ["stmodify", "stupdate"],
    category: "staffs",
    description: "Updates information of a staff member.",
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

        let toModify;
        if (message.mentions.members.first()) {
            toModify = message.mentions.members.first();
            
            const staffMember = await StaffSheets.findOne({ $or: [ 
                { name: toModify.user.username },
                { uid: toModify.id },
             ] }).exec();

            if (!staffMember) {
                const embed = new MessageEmbed()
                    .setDescription("**❌ Staff Member not found!**")
                    .setColor(colors.Red);
                message.channel.send(embed);
            } else {
                const embed = new MessageEmbed()
                    .setTitle("What do you want to modify/update?\n(Choose one)")
                    .setThumbnail(message.guild.member(staffMember.uid).user.displayAvatarURL())
                    .setDescription(stripIndents`**Selected Member:** ${staffMember.name}
                    **1.** Name\n**2. **Age\n**3.** Gender\n**4.** Position\n**5.** Occupation\n**6.** Schedule\n**7.** Contact`)
                    .setColor(colors.Turquoise);
                message.channel.send(embed).then(async (msg) => {
                    const emoji = await promptMessage(msg, message.author, 120, ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣"]);

                    switch (emoji) {
                        case "1️⃣":
                            const name = await getStaffInfo(bot, message, 120, "name");
                            const oldName = staffMember.name;
                            staffMember.name = name;
                            
                            const embedName = new MessageEmbed()
                                .setTitle("Changed the following:")
                                .addFields(
                                    {
                                        name: "Name:",
                                        value: `${oldName}  ➡  **${staffMember.name}**`,
                                        inline: true,
                                    }
                                )
                                .setColor(colors.Green);
                            message.channel.send(embedName);
                            break;
                        case "2️⃣":
                            const age = await getStaffInfo(bot, message, 120, "age");
                            const oldAge = staffMember.age;
                            if(parseInt(age)) {
                                staffMember.age = age;
                                const embedAge = new MessageEmbed()
                                    .setTitle("Changed the following:")
                                    .addFields(
                                        {
                                            name: "Name:",
                                            value: `${oldAge}  ➡  **${staffMember.age}**`,
                                            inline: true,
                                        }
                                    )
                                    .setColor(colors.Green);
                                message.channel.send(embedAge);
                            } else {
                                return message.channel.send(`❌ **Sorry, \`${age}\` is not a number.**`);
                            }
                            break;
                        case "3️⃣":
                            const gender = await getStaffInfo(bot, message, 120, "gender");
                            const oldGender = staffMember.gender;
                            staffMember.gender = gender;

                            const embed1 = new MessageEmbed()
                                    .setTitle("Changed the following:")
                                    .addFields(
                                        {
                                            name: "Name:",
                                            value: `${oldGender}  ➡  **${staffMember.gender}**`,
                                            inline: true,
                                        }
                                    )
                                    .setColor(colors.Green);
                                message.channel.send(embed1);
                            break;
                        case "4️⃣":
                            const position = await getStaffInfo(bot, message, 120, "position");
                            console.log(position);
                            break;
                        case "5️⃣":
                            const occupation = await getStaffInfo(bot, message, 120, "occupation");
                            console.log(occupation);
                            break;
                        case "6️⃣":
                            const schedule = await getStaffInfo(bot, message, 120, "schedule");
                            console.log(schedule);
                            break;
                        case "7️⃣":
                            const contact = await getStaffInfo(bot, message, 120, "contact");
                            console.log(contact);
                            break;
                    
                        default:
                            break;
                    }
                });
            }
        } else {
            const regex = /\s*(?:[,|`])\s*/g;
            toModify = args.join(" ").split(regex).filter(arg => arg !== "");
            const staffMember = await StaffSheets.findOne({ $or: [
                { uid: toModify[0] },
                { name: toModify[0] },
            ] }).exec();

            console.log(staffMember);
        }
    },
};
