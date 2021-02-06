const { MessageEmbed } = require("discord.js");

const colors = require("../../utils/colors.json");

module.exports = {
    name: "roulette",
    aliases: ["yeet"],
    category: "entertainment",
    description: "Voice Chat Roulette",
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

        message.channel.send("Yeeting someone in the Voice Channel...");

        const channel = message.member.voice.channel;

        // console.log(channel);

        const excluded = [
            '613742642404261889', // ming
        ];

        const members = await channel.members.filter(member => {
            if (excluded.includes(member.id)) return false;
            return true;
        }).map((member) => member);

        const member =
            members[Math.floor(Math.random() * Math.floor(members.length))];

        // console.log(member.voice.connection);

        member.voice.kick();

        message.channel.send(`Yeeted ${member} from the VC! HAHAHAHA`);
    },
};
