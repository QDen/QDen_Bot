const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const staffSheets = new Schema({
    uid: String,
    name: String,
    age: Number,
    gender: String,
    position: String,
    occupation: String,
    schedule: String,
    contact: String,
    dateModified: [Date],

});

module.exports = mongoose.model("staffsheet", staffSheets);