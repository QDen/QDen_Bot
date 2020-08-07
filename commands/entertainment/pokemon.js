const axios = require("axios");
const colors = require("../../colors.json");
const { MessageEmbed } = require('discord.js');
const { getMember } = require('../../functions.js');

module.exports = {
    name: "pokedex",
    aliases: ["wtp", "pokemon"],
    category:"entertainment",
    description: "Qden's Pokédex",
    usage: [`\`q!<command | alias>\``],
    run: async (bot, message, args) => {

        if (!args) {
            return message.channel.send(`❌ ERROR: Please specify a pokemon!`);
        }
        const toSearch = args.join(" ");

        let nsg = await message.channel.send("Generating...");

        const { data } = await axios.get(`https://some-random-api.ml/pokedex?pokemon=${toSearch}`);
        //console.log(toSearch);
        if(!data[0]) {
            return message.channel.send (`❌ ERROR: \`${toSearch}\` is not a valid pokemon!`);
        }

        let mEmbed = new MessageEmbed()
            .setColor(colors.Lumber)
            .setAuthor(`Welcome to ${bot.user.username}'s Pokédex!`, bot.user.displayAvatarURL())
            .setTitle(`**${data[0].name[0].toUpperCase()}${data[0].name.slice(1)}**`)
            .addFields(
                {
                    name: "Pokémon Id:",
                    value: data[0].id,
                    inline: true
                },
                {
                    name: "Pokémon Type:",
                    value: data[0].type[0],
                    inline: true
                },
                {
                    name: "Species:",
                    value: `${data[0].species[0]} ${data[0].species[1]}`,
                    inline: true
                },
                {
                    name: "Stats:",
                    value: `Hp: ${data[0].stats.hp}
                    Attack: ${data[0].stats.attack}
                    Defense: ${data[0].stats.defense}
                    Special Attack: ${data[0].stats.sp_atk}
                    Special Defense: ${data[0].stats.sp_def}
                    Speed: ${data[0].stats.speed}`,
                    inline: true
                },
                {
                    name: "Evolution Stages:",
                    value: data[0].family.evolutionStage,
                    inline: true

                },
                {
                    name: "Generation:",
                    value: data[0].generation,
                    inline: true
                },
                {
                    name: "Description:",
                    value: data[0].description
                }
            )
            .setThumbnail(data[0].sprites.animated)
            .setTimestamp()
            .setFooter(`${bot.user.username} | By MahoMuri`, bot.user.displayAvatarURL());

        message.channel.send(mEmbed);
        nsg.delete();
    }
};
