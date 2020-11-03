/**
 * @file ready listener
 */
const ms = require("ms");
const { statusMessages } = require("../statuses.json");
const mongoose = require("mongoose");
module.exports = async bot => {
    bot.on('ready', async () => {
        const logChannel = await bot.channels.cache.get('694217906296455188');
        const logMsg = `✅ **${bot.user.username} Bot is online!**`;
    
        logChannel.send(logMsg);
        console.log(logMsg);
        bot.user.setActivity(" q!help | with you", {
            type: "LISTENING"
        }).then(() => {
            setInterval(function() {
                let status = statusMessages[Math.floor(Math.random() * statusMessages.length)];

                bot.user.setActivity(status, {
                    type: "LISTENING"
                });                
            }, ms("10 minutes"));
        });

        // Initialize connection to DataBase
        await mongoose.connect(process.env.STAFF_SHEET_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }).catch(err => console.log("Error on addstaff.js\n",err));
    
    }); 
    
};