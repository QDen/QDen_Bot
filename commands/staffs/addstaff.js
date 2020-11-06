const { MessageEmbed } = require("discord.js");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { validURL, promptMessage, staffInfoEmbed } = require("../../functions");
const mongoose = require('mongoose');
const Pagination = require("discord-paginationembed");

const StaffSheets = require("../../models/staffsheets");
const colors = require("../../colors.json");
const { stripIndents } = require("common-tags");
const ms = require("ms");

module.exports = {
    name: "addstaff",
    aliases: ["add"],
    category: "staffs",
    description: "Adds the staff info",
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

        const valid = validURL(args.join(""));

        if (valid) {
            const url = new URL(args.join(""));
            const regex = /([^spreadsheets?:\/\s])([^\/\s]+)([^\/edit\s])/g;
            const spreadsheetId = url.pathname.match(regex).join("");
            const sheets = new GoogleSpreadsheet(spreadsheetId);
            await sheets.useServiceAccountAuth({
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY,
            });

            message.channel.send(`**Verifying** \`${args.join("")}\``).then(async (msg) => {
                const staffInfos = []; 
                try {
                    await sheets.loadInfo();
                    const firstSheet = sheets.sheetsByIndex[0];
                    const rows = await firstSheet.getRows();
                    rows.forEach((row) => {
                        staffInfos.push({
                            uid: row.UID,
                            name: row.Name,
                            age: row.Age,
                            gender: row.Gender,
                            position: row.Position,
                            occupation: row.Occupation,
                            schedule: row.Schedule,
                            contact: row.Contact,
                        });
                    });

                    const docs = [];
                    await Promise.all(staffInfos.map(async (staff) => {
                        await StaffSheets.exists({ name: staff.name }).then(async (doc) => {
                            if(!doc){
                                docs.push(new StaffSheets(
                                    {
                                        uid: staff.uid,
                                        name: staff.name,
                                        age: staff.age,
                                        gender: staff.gender,
                                        position: staff.position,
                                        occupation: staff.occupation,
                                        schedule: staff.schedule,
                                        contact: staff.contact,
                                        dateModified: message.createdAt,
                                    }
                                ));
                            }
                        });
                    }));
                    
                    const embeds = [];
                    if(docs.length > 0) {
                        docs.forEach((staff) => {
                            embeds.push(staffInfoEmbed(staff, message));
                        });
                    } 

                    // console.log(embeds.length);
                    if (embeds.length > 0) {
                        await msg.channel.send(`✅ **Detected ${embeds.length} new staff member${embeds.length === 1 ? "":"s"}:**`);
                        // Sends the contents of the db to confirm
                        new Pagination.Embeds()
                            .setArray(embeds)
                            .setAuthorizedUsers(message.author.id)
                            .setChannel(message.channel)
                            .setPageIndicator(true)
                            .setPage(1)
                            .setTimeout(ms("5m"))
                            .setDeleteOnTimeout(true)
                            // Methods below are for customising all embeds
                            .setColor(colors.Turquoise)
                            .setFooter(`${bot.user.username} | MahoMuri`)
                            .build();
                        setTimeout(function() {
                            msg.channel.send(`**Should I add ${embeds.length === 1 ? "this":"these"} staff member${embeds.length === 1 ? "":"s"}? (2 mins)**`)
                                .then(async (msg2) => {
                                    const emoji = await promptMessage(msg2, message.author, 120, ["✅", "❌"]);

                                    if (emoji === "✅") {
                                        await StaffSheets.insertMany(docs, function(err, documents) {
                                            if(err) {
                                                console.log(err);
                                            } else {
                                                msg2.edit(`**Successfully added ${documents.length} staff members to the database!**`);
                                            }
                                        });
                                    } else if (emoji === "❌") {
                                        msg2.edit(`✅ **Cancelled saving ${docs.length}!**`);
                                    }
                                });
                        }, ms("15s"));
                    } else {
                        const embed = new MessageEmbed()
                            .setColor(colors.Red)
                            .setDescription("❌ **No new staff members detected!**");
                        msg.edit(embed);
                    }

                } catch (error) {
                    if (error.message.includes("The caller does not have permission")) {
                        const embed = new MessageEmbed()
                            .setTitle("No permission")
                            .setColor(colors.Red)
                            .setDescription( stripIndents `Sorry, I dont have permission to access the document
                            Please share the document to:
    
                            __**${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}**__
                            
                            and please try again.`);
                        msg.edit(embed);
                    } else {
                        console.error(error);
                    }
                }    
            });

        } else {
            const regex = /\s*(?:[,|`])\s*/g;
            const info = args.join(" ").split(regex).filter(arg => arg !== "");

            /**
             * info[0] = UID
             * info[1] = Name
             * info[2] = Age
             * info[3] = Gender
             * info[4] = Potision
             * info[5] = Occupation
             * info[6] = Schedule
             * info[7] = Contact
             * 
             * q!add `259313335076519936 | MahoMuri | 20 | Male | Team Coders | Student | Thu Fri | MahoMuri#2534`
             */

            if (info.length !== 8) {
                const embed = new MessageEmbed()
                    .setDescription(stripIndents `❌ **Incomplete data: expecting 8 items, instead recieved ${info.length}!**

                    **The format is:**
                    \`UID | Name | Age | Gender | Position | Occupation | Schedule | Contact\`

                    **or Google spread sheets link:**
                    \`https://docs.google.com/spreadsheets/d/5pR3$d$h33t7oK3n/edit#gid=0\`
                    
                    **Please Try Again.**`)
                    .setColor(colors.Red);
                return message.channel.send(embed);
            }
            
            if (!message.guild.members.resolve(info[0])) {
                const embed = new MessageEmbed()
                    .setDescription("❌ **Invalid UID, Please try again!**")
                    .setColor(colors.Red);
                return message.channel.send(embed);
            }

            const staff = {
                uid: info[0],
                name: info[1],
                age: info[2],
                gender: info[3],
                position: info[4],
                occupation: info[5],
                schedule: info[6],
                contact: info[7],
            };

            const embed = staffInfoEmbed(staff, message)
                .setTitle("Is this correct?")
                .setColor(colors.Turquoise)
                .setFooter("This message becomes invalid after 2mins.");
            message.channel.send(embed).then(async (msg) => {
                const emoji = await promptMessage(msg, message.author, 120, ["✅", "❌"]);

                if (emoji === "✅") {
                    const exists = await StaffSheets.exists({ name: info[1] });
                    if (!exists) {
                        const staffSheet = new StaffSheets(
                            {
                                uid: info[0],
                                name: info[1],
                                age: info[2],
                                gender: info[3],
                                position: info[4],
                                occupation: info[5],
                                schedule: info[6],
                                contact: info[7],
                                dateModified: message.createdAt,
                            }
                        );

                        await staffSheet.save();
                        await msg.delete();

                        const embed = new MessageEmbed()
                            .setDescription(`✅ **Successfully added Staff Memeber \`${staffSheet.name}\` to the DataBase!**`)
                            .setColor(colors.Green);
                        message.channel.send(embed);
                    } else {
                        await msg.delete();
                        const embed = new MessageEmbed()
                            .setDescription("❌ **Staff Member already exists!**")
                            .setColor(colors.Red);
                        message.channel.send(embed);
                    }
                } else if (emoji === "❌") {
                    await msg.delete();
                    const embed = new MessageEmbed()
                        .setDescription("✅ **Cancelled! Type `q!addstaff` or `q!add` to add again.**")
                        .setColor(colors.Green);
                    message.channel.send(embed);
                }
            });
        }  
    },
};
