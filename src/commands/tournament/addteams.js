const { MessageEmbed } = require("discord.js");
const colors = require("../../utils/colors.json");
const TeamInfo = require("../../models/teaminfo");

module.exports = {
    name: "addteams",
    aliases: ["addt"],
    category: "tournament",
    description: "Adds the tournament teams to the DataBase",
    usage: ["`-<command | alias> `"],
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

        const members = [
            {
                facebook: "https://www.facebook.com/Sawtpain/",
                ign: "MahoMuri",
                discord_tag: "MahoMuri#2534",
                contact: Number("09280319909"),
            },
            {
                facebook: "https://www.facebook.com/Sawtpain/",
                ign: "Nem",
                discord_tag: "Nem#2117",
                contact: Number("09280319909"),
            },
            {
                facebook: "https://www.facebook.com/Sawtpain/",
                ign: "ruth",
                discord_tag: "ruth#0918",
                contact: Number("09280319909"),
            },
            {
                facebook: "https://www.facebook.com/Sawtpain/",
                ign: "IceWallowCome",
                discord_tag: "IceWallowCome#2534",
                contact: Number("09280319909"),
            },
            {
                facebook: "https://www.facebook.com/Sawtpain/",
                ign: "Ben Dover",
                discord_tag: "Ben Dover#2534",
                contact: Number("09280319909"),
            },
        ];

        const newTeam = new TeamInfo({
            game: "League of Legends",
            name: "Team Ba",
            logo: "https://somesite.com/path/to/image",
            captain: "This is a Caption",
            founded_year: 2010,
            description: "This is a Description",
            number_of_members: 20,
            date_added: Date.now(),
            date_modified: Date.now(),
            members,
        });

        await newTeam.save();
        console.log("Saved Team Info to DB!");
    },
};
