module.exports = {
    name: 'subcount',
    aliases: [''],
    category: 'info',
    description: 'Displays the number of subscribers in the server',
    usage: `\`q!<command | alias>\``,
    run: async (bot, message, args) => {

        if (message.guild.premiumSubscriptionCount === 0) {
            message.channel.send(`No one hase boosted the server!`);
        } else {
            message.channel.send(`There are currently ${message.guild.premiumSubscriptionCount} member${message.guild.premiumSubscriptionCount > 1 ? 's' : ''} who boosted the server!`);
        }
    }
};