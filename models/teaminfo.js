const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamInfoSchema = new Schema({
    game: String,
    name: String,
    logo: String,
    captain: String,
    founded_year: Number,
    description: String,
    number_of_members: Number,
    date_added: Date,
    date_modified: Date,
    members: [{
        facebook: String,
        ign: String,
        discord_tag: String,
        contact: Number,
    }]
});

const TeamsDB = mongoose.connection.useDb("TournamentTeams");

const TeamInfo = TeamsDB.model("team", TeamInfoSchema);

module.exports = TeamInfo;