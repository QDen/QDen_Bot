/**
 * @file ready listener
 */
module.exports = async bot =>{
    bot.on('ready', async () => {
        const logChannel = await bot.channels.cache.get('710795359844171797');
        const logMsg = `✅ ${bot.user.username} is online on ${bot.guilds.cache.size} server${bot.guilds.cache.size > 1 ? 's' : ''}!`;
    
        console.log(logMsg);
        bot.user.setActivity(" q_help | with you", {
            type: "PLAYING"
        });
    
    
    }); 
    
};