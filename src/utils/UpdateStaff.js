const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");
const colors = require("./colors.json");
const Utilities = require("./functions");

class UpdateStaff {
    static async updateStaffInfo(bot, message, staffMember, doc) {
        // Initialize the row first and isolate the member to be updated
        const sheet = doc.sheetsByIndex[0];
        const rows = await sheet.getRows();
        const row = rows.find((r) => r.UID === staffMember.uid);

        // Start the update process
        const embed = new MessageEmbed()
            .setTitle("What do you want to modify/update?\n(Choose one)")
            .setThumbnail(
                message.guild.member(staffMember.uid).user.displayAvatarURL()
            )
            .setDescription(
                stripIndents`**Selected Member:** ${staffMember.name}
                **1.** Name
                **2.** Age
                **3.** Gender
                **4.** Position
                **5.** Occupation
                **6.** Schedule
                **7.** Contact

                **Click ❌ to Cancel**`
            )
            .setColor(colors.Turquoise);
        message.channel.send(embed).then(async (msg) => {
            const emoji = await Utilities.promptMessage(
                msg,
                message.author,
                120,
                ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "❌"]
            );

            let oldValue;
            switch (emoji) {
                case "1️⃣": {
                    oldValue = staffMember.name;
                    const name = await Utilities.getStaffInfo(
                        bot,
                        message,
                        120,
                        "name",
                        oldValue,
                        staffMember
                    );
                    staffMember.name = name;
                    row.Name = name;
                    break;
                }
                case "2️⃣": {
                    oldValue = staffMember.age;
                    const age = await Utilities.getStaffInfo(
                        bot,
                        message,
                        120,
                        "age",
                        oldValue,
                        staffMember
                    );
                    if (parseInt(age)) {
                        staffMember.age = age;
                        row.Age = age;
                    } else {
                        return message.channel.send(
                            `❌ **Sorry, \`${age}\` is not a number.**`
                        );
                    }
                    break;
                }
                case "3️⃣": {
                    oldValue = staffMember.gender;
                    const gender = await Utilities.getStaffInfo(
                        bot,
                        message,
                        120,
                        "gender",
                        oldValue,
                        staffMember
                    );
                    staffMember.gender = gender;
                    row.Gender = gender;
                    break;
                }

                case "4️⃣": {
                    oldValue = staffMember.position;
                    const position = await Utilities.getStaffInfo(
                        bot,
                        message,
                        120,
                        "position",
                        oldValue,
                        staffMember
                    );
                    staffMember.position = position;
                    row.Position = position;
                    break;
                }
                case "5️⃣": {
                    oldValue = staffMember.occupation;
                    const occupation = await Utilities.getStaffInfo(
                        bot,
                        message,
                        120,
                        "occupation",
                        oldValue,
                        staffMember
                    );
                    staffMember.occupation = occupation;
                    row.Occupation = occupation;
                    break;
                }
                case "6️⃣": {
                    oldValue = staffMember.schedule;
                    const schedule = await Utilities.getStaffInfo(
                        bot,
                        message,
                        120,
                        "schedule",
                        oldValue,
                        staffMember
                    );
                    staffMember.schedule = schedule;
                    row.Schedule = schedule;
                    break;
                }
                case "7️⃣": {
                    oldValue = staffMember.contact;
                    const contact = await Utilities.getStaffInfo(
                        bot,
                        message,
                        120,
                        "contact",
                        oldValue,
                        staffMember
                    );
                    staffMember.contact = contact;
                    row.Contact = contact;
                    break;
                }
                case "❌": {
                    message.channel.send("**❌ Cancelled!**");
                    return;
                }
                default:
                    break;
            }

            // Gets the changes here.
            const changes = staffMember.getChanges();

            // This checks if there is a change or not.
            if (Object.keys(changes).length !== 0) {
                const key = Object.keys(changes.$set);
                const value = Object.values(changes.$set);
                console.log(`Made changes on ${key}: ${oldValue} => ${value}`);
                // Send the confirmation that something was changed.
                const embed = new MessageEmbed()
                    .setTitle("Changed the following:")
                    .addFields({
                        name: `${Utilities.toSentenceCase(key.join(""))}:`,
                        value: `${oldValue}  ➡  **${value}**`,
                        inline: true,
                    })
                    .setColor(colors.Green);
                message.channel.send(embed);
                await staffMember.dateModified.push(message.createdAt);
                await row.save();
                await staffMember.save();
                message.channel.send(
                    `**✅ Successfully saved new changes to ${staffMember.name}**`
                );
            } else {
                const embed = new MessageEmbed()
                    .setTitle("No Changes Detected!")
                    .setColor(colors.Red)
                    .setDescription(
                        `I did not detect any changes made to ${staffMember.name}. Please try again.`
                    );
                message.channel.send(embed);
            }
        });
    }
}

module.exports = UpdateStaff;
