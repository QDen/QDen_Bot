const { MessageEmbed } = require("discord.js");
const { promptMessage } = require("../../utils/functions");
const colors = require("../../utils/colors.json");

const chooseArr = ["🗻", "📰", "✂"];

module.exports = {
    name: "rps",
    category: "entertainment",
    description:
        "Rock Paper Scissors game. React to one of the emojis to play the game.",
    usage: `\`q!<command | alias>\``,
    run: async (bot, message) => {
        const embed = new MessageEmbed()
            .setColor(colors.Green_Sheen)
            .setFooter(message.guild.me.displayName, bot.user.displayAvatarURL)
            .setDescription(
                "Add a reaction to one of these emojis to play the game!"
            )
            .setTimestamp();

        function getResult(me, botChosen) {
            if (
                (me === "🗻" && botChosen === "✂") ||
                (me === "📰" && botChosen === "🗻") ||
                (me === "✂" && botChosen === "📰")
            ) {
                return "You won!";
            }
            if (me === botChosen) {
                return "It's a tie!";
            }
            return "You lost!";
        }

        const m = await message.channel.send(embed);
        // Wait for a reaction to be added
        const reacted = await promptMessage(m, message.author, 30, chooseArr);

        // Get a random emoji from the array
        const botChoice =
            chooseArr[Math.floor(Math.random() * chooseArr.length)];

        // Check if it's a win/tie/loss
        const result = await getResult(reacted, botChoice);
        // Clear the reactions
        await m.reactions.removeAll();

        embed.setDescription("").addField(result, `${reacted} vs ${botChoice}`);

        m.edit(embed);
    },
};
