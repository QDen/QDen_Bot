/**
 * @file ready listener
 */
module.exports = async bot =>{
    bot.on('ready', async () => {
        const logChannel = await bot.channels.cache.get('694217906296455188');
        const logMsg = `✅ ${bot.user.username} is online on ${bot.guilds.cache.size} server${bot.guilds.cache.size > 1 ? 's' : ''}!`;
    
        logChannel.send(logMsg);
        console.log(logMsg);
        bot.user.setActivity(" q!help | with you", {
            type: "PLAYING"
        });
    
    }); 
    
};