const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MuteTimers = new Schema({
    guildID: String,
    userID: String,
    channelID: String,
    isMuted: Boolean,
    timeMuted: Date,
    timeUnmuted: Date,
    time: Date,
    timer: Number,
});

const MuteDB = mongoose.connection.useDb("ModerationList");

const MutedList = MuteDB.model("muted_list", MuteTimers);

module.exports = MutedList;
