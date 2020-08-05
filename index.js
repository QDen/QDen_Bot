/**
 * @file main(): basically where everything is initialized
 */

// Imports
const ascii = require("ascii-table");
const { Client, Collection } = require('discord.js');
const { config } = require("dotenv");
const { readdirSync } = require("fs");


// Setup bot
const bot = new Client({
    disableEveryone: true,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

bot.aliases = new Collection();
bot.categories = readdirSync(`./commands/`);
bot.commands = new Collection();
bot.queue = [];

// Setup configuration
config({
    path: `${__dirname}/.env`
});

// Setup listeners
let lstTable = new ascii('listeners');
lstTable.setHeading('Listener', 'Status');
let listeners = readdirSync(`${__dirname}/event_listeners`).filter(v => v.endsWith('.js'));
listeners.forEach(v => {
    require(`${__dirname}/event_listeners/${v}`)(bot);
    lstTable.addRow(v, 'Loaded');
});
console.log(lstTable.toString());

// Setup commands
let cmdTable = new ascii("commands");
cmdTable.setHeading("Command", "Load status");
bot.categories.forEach(dir => {
    let commands = readdirSync(`./commands/${dir}`).filter(f => f.endsWith(".js"));
    commands.forEach(file => {
        let pull = require(`./commands/${dir}/${file}`);
        if (pull.name) {
            bot.commands.set(pull.name, pull);
            cmdTable.addRow(file, 'Loaded');
            if (pull.aliases && Array.isArray(pull.aliases)) {
                pull.aliases.forEach(alias => bot.aliases.set(alias, pull.name));
            }
        } else {
            cmdTable.addRow(file, 'Error -> No name defined');
        }
    });
});
console.log(cmdTable.toString());

// Now login
bot.login(process.env.TOKEN);
