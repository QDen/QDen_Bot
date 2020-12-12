const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TeamInfoSchema = new Schema({
    game: String,
    name: String,
    logo: String,
    captain: String,
    founded_year: String,
    description: String,
    number_of_members: Number,
    date_added: Date,
    date_modified: Date,
    members: [
        {
            ign: String,
            discord_tag: String,
            contacts: [
                {
                    type: String,
                    value: String,
                },
            ],
        },
    ],
});

/**
 * contacts: [
 *  {
 *      type: 'facebook'
 *      value: 'link to facebook'
 *  },
 *  {
 *      type: 'instagram'
 *      value: 'link to ig'
 *  }
 * ]
 */

const TeamsDB = mongoose.connection.useDb("TournamentTeams");

const TeamInfo = TeamsDB.model("team", TeamInfoSchema);

module.exports = TeamInfo;
