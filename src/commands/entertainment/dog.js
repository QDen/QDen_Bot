const r2 = require("r2");
const rp = require("request-promise");
const $ = require("cheerio");
const queryString = require("query-string");
const { MessageEmbed } = require("discord.js");
const colors = require("../../utils/colors.json");
const { filterBreed } = require("../../utils/functions");

const DOG_API_URL = "https://api.thedogapi.com/";
const { DOG_API_KEY } = process.env;
const BREED_URL = "https://dogtime.com";

module.exports = {
    name: "dog",
    aliases: ["bark", "howl", "doggo"],
    category: "entertainment",
    description: "Displays a random dog",
    usage: [`\`-<command | alias>\``],
    run: async (bot, message) => {
        const nsg = await message.channel.send("Generating...");

        async function loadImage(subid) {
            // you need an API key to get access to all the iamges, or see the requests you've made in the stats for your account
            const headers = {
                "X-API-KEY": DOG_API_KEY,
            };
            const query_params = {
                has_breeds: true, // we only want images with at least one breed data object - name, temperament etc
                mime_types: "jpg,png", // we only want static images as Discord doesn't like gifs
                size: "small", // get the small images as the size is prefect for Discord's 390x256 limit
                subid, // pass the message senders username so you can see how many images each user has asked for in the stats
                limit: 1, // only need one
                facts: true,
            };
            // convert this obejc to query string
            const querystring = queryString.stringify(query_params);
            let response;

            try {
                // construct the API Get request url
                const url = `${DOG_API_URL}v1/images/search?${querystring}`;
                // console.log(_url);
                // make the request passing the url, and headers object which contains the API_KEY
                response = await r2.get(url, { headers }).json;
            } catch (e) {
                console.error(e);
            }
            return response;
        }

        let breedName;
        try {
            // pass the name of the user who sent the message for stats later, expect an array of images to be returned.
            const images = await loadImage(message.author.username);

            // list words to be filtered out for dogtime.com
            const filter = "minature";

            // get the Image, and first Breed from the returned object.
            const image = images[0];
            const breed = image.breeds[0];
            const toFilter = breed.name.toLowerCase();
            breedName = filterBreed(toFilter, filter);
            const url = `${BREED_URL}/dog-breeds/${breedName}#/slide/1`;

            // console.log(url);
            const description = [];

            await rp(url).then((html) => {
                $(".breeds-single-intro > p", html).each(function (i) {
                    description[i] = $(this).text();
                });
            });

            // console.log(`${description[0]}`);
            // console.log("message processed", "showing", breed);

            const cEmbed = new MessageEmbed()
                .setTitle("Here's a random dog!")
                .setColor(colors.Turquoise)
                .addFields(
                    {
                        name: "**Breed:**",
                        value: `*${breed.name}*`,
                        inline: true,
                    },
                    {
                        name: "**Temperament:**",
                        value: `*${breed.temperament}*`,
                        inline: true,
                    },
                    {
                        name: "**Life Span:**",
                        value: `*${breed.life_span}*`,
                        inline: true,
                    },
                    {
                        name: "**Description:**",
                        value: `${description[0]}`,
                        inline: true,
                    }
                )
                .setImage(image.url);
            message.channel.send(cEmbed);
        } catch (error) {
            const embed = new MessageEmbed()
                .setColor(colors.Red)
                .setTitle("Error")
                .setDescription(
                    "Oops, it seems that I took too long to respond. Please try again."
                );
            message.channel.send(embed);
            // console.log(breedName);
        }
        nsg.delete();
    },
};
