const { MessageEmbed } = require("discord.js");
const { readFileSync, writeFileSync } = require("fs");

const colors = require("../../utils/colors.json");

const cache = JSON.parse(
    readFileSync(`${__dirname}/../../utils/roulettecache.json`)
);

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

        // message.channel.send("Yeeting someone in the Voice Channel...");

        const channel = message.member.voice.channel;

        const excluded = [
            "613742642404261889", // ming
            "318623486069309452", // lans
            "259313335076519936", // well... me. duh.
        ];

        const members = await channel.members
            .map((member) => member)
            .filter((member) => !excluded.includes(member.id))
            .map((member) => {
                if (!cache[member.id]) {
                    cache[member.id] = {
                        name: member.user.username,
                        yeeted: false,
                    };
                    writeFileSync(
                        "./src/utils/roulettecache.json",
                        JSON.stringify(cache, null, 2),
                        (err) => {
                            if (err) {
                                console.error(err);
                            }
                        }
                    );
                }

                return member;
            })
            .filter((member) => !cache[member.id].yeeted);

        if (members.length) {
            const member =
                members[Math.floor(Math.random() * Math.floor(members.length))];

            console.log(member.user.username);
            // member.voice.kick();
            // message.channel.send(`Yeeted ${member} from the VC! HAHAHAHA`);
            cache[member.id].yeeted = true;
            cache[member.id].yeetedAt = new Date().getTime();
            writeFileSync(
                "./src/utils/roulettecache.json",
                JSON.stringify(cache, null, 2),
                (err) => {
                    if (err) {
                        console.error(err);
                    }
                }
            );
            setTimeout(async () => {
                cache[member.id].yeeted = false;
                cache[member.id].unYeetedAt = new Date().getTime();
                writeFileSync(
                    "./src/utils/roulettecache.json",
                    JSON.stringify(cache, null, 2),
                    (err) => {
                        if (err) {
                            console.error(err);
                        }
                    }
                );
            }, ms("30s"));

            console.log(cache);
        } else {
            message.channel.send(
                "❌ **Everyone has been yeeted at least once, please try again in 30 seconds**"
            );
        }
    },
};
