module.exports = {
    name: 'substats',
    aliases: [''],
    category: 'info',
    description: 'Displays the current subscription of the server',
    usage: `\`q!<command | alias>\``,
    run: async (bot, message, args) => {

        if (message.guild.premiumTier === 0) {
            message.channel.send(`No one have boosted the server!`);
        } else {
            message.channel.send(`The server is currently at server boost level ${message.guild.premiumTier}!`);
        }
    }
};