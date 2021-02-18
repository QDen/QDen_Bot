const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "vcsetup",
    aliases: ["vcs"],
    category: "custom_voice",
    description: "Sets up Custom VC by creating a new Category and VC",
    usage: ["`q.vcsetup or q.vcs`"],
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

        const guildID = message.guild.id;
        const filter = (msg) => msg.author.id === message.author.id;

        // Setup category here
        message.channel.send(
            "**Enter the name of the category to create channels in: (2 mins to answer)**"
        );

        const category = await message.channel
            .awaitMessages(filter, {
                max: 1,
                timeout: ms("2m"),
                errors: "time",
            })
            .catch(() => message.channel.send("**❌ You ran out of time!**"));
        const categoryName = category.first().content;

        // Setup Main Voice Channel
        message.channel.send(
            "**Enter the name for the Main VC: (2 mins to answer)**"
        );

        const channel = await message.channel
            .awaitMessages(filter, {
                max: 1,
                timeout: ms("2m"),
                errors: "time",
            })
            .catch(() => message.channel.send("**❌ You ran out of time!**"));
        const channelName = channel.first().content;

        // Actually create the channels
        const newCategory = await message.guild.channels.create(categoryName, {
            type: "category",
            permissionOverwrites: [
                {
                    id: "690499818489118722", // everyone role
                    deny: ["VIEW_CHANNEL"],
                },
                {
                    id: "805793101858865252", // verified role
                    allow: ["VIEW_CHANNEL"],
                },
                {
                    id: "805793101004013599", // q-tizens role
                    deny: ["VIEW_CHANNEL"],
                },
                {
                    id: "805793100886704148", // muted role
                    deny: [
                        "SEND_MESSAGES",
                        "MENTION_EVERYONE",
                        "CONNECT",
                        "SPEAK",
                    ],
                },
            ],
        });

        const mainVC = await message.guild.channels.create(channelName, {
            type: "voice",
            parent: newCategory.id,
            permissionOverwrites: [
                {
                    id: "690499818489118722", // everyone role
                    deny: ["VIEW_CHANNEL"],
                },
                {
                    id: "805793101858865252", // verified role
                    allow: ["VIEW_CHANNEL"],
                },
                {
                    id: "805793101004013599", // q-tizens role
                    deny: ["VIEW_CHANNEL"],
                },
                {
                    id: "805793100886704148", // muted role
                    deny: [
                        "SEND_MESSAGES",
                        "MENTION_EVERYONE",
                        "CONNECT",
                        "SPEAK",
                    ],
                },
            ],
        });

        // Create JSON object for config
        const config = {
            categoryID: newCategory.id,
            channels: [mainVC.id],
            premium: false,
        };

        // Store into DB
        bot.dbClient.setGuildSettings(guildID, config);

        // Send confirmation message
        message.channel.send("✅ **Successfully Created Category and VCs!**");
    },
};
