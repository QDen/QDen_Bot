const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const savedlistSchema = new Schema({
    author: ObjectId,
    title: String,
    body: [String],
    date: Date,
});

const ListDB = mongoose.connection.useDb("OpenMicQueues");

const MemberList = ListDB.model("list", savedlistSchema);

module.exports = MemberList;
