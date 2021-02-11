const SQLite = require("better-sqlite3");

class DBUtils {
    constructor(bot, db = "") {
        this.bot = bot;
        this.sqlClient = SQLite(db);
    }

    /**
     * Initializer, ideally put in the constructor but may contain async method.
     */
    preflight() {
        // Initialize database with 3 tables: guildChannels, guildSettings and userSettings if not already.
        this.sqlClient
            .prepare(
                // Store active channels as a stringified JSON array
                "CREATE TABLE IF NOT EXISTS guildChannels(guildID TEXT NOT NULL UNIQUE, activeChannels TEXT)"
            )
            .run();

        this.sqlClient
            .prepare(
                // Stringified JSON object stored as a TEXT object
                "CREATE TABLE IF NOT EXISTS userSettings(userID TEXT NOT NULL UNIQUE, configuration TEXT);"
            )
            .run();

        this.sqlClient
            .prepare(
                // Stringified JSON object stored as a TEXT object
                "CREATE TABLE IF NOT EXISTS guildSettings(guildID TEXT NOT NULL UNIQUE, configuration TEXT);"
            )
            .run();

        // @MahoMuri: Remove these two pragma lines when implementing IPC-based sharding
        this.sqlClient.pragma("journal_mode = WAL");
        this.sqlClient.pragma("locking_mode = EXCLUSIVE");
    }

    getActiveChannels(guildID) {
        if (typeof guildID !== "string")
            throw new TypeError("Provided guildID is not a string");

        const channels = this.sqlClient
            .prepare(
                "SELECT activeChannels FROM guildChannels WHERE guildID = ?"
            )
            .get(guildID);

        return JSON.parse(channels ? channels.configuration : "undefined");
    }

    setActiveChannels(guildID, channels) {
        if (typeof guildID !== "string")
            throw new TypeError("Provided userID is not a string");

        if (!this.getUserSettings(guildID)) {
            this.sqlClient
                .prepare("INSERT INTO guildChannels VALUES (?, ?)")
                .run(guildID, "{}");
        }

        this.sqlClient
            .prepare(
                "UPDATE guildChannels SET configuration = ? WHERE guildID = ?"
            )
            .run(guildID, JSON.stringify(channels));
    }

    getGuildSettings(guildID) {
        if (typeof guildID !== "string")
            throw new TypeError("Provided guildID is not a string");

        const guildSettings = this.sqlClient
            .prepare(
                "SELECT configuration FROM guildSettings WHERE guildID = ?"
            )
            .get(guildID);

        return JSON.parse(
            guildSettings ? guildSettings.configuration : "undefined"
        );
    }

    setGuildSettings(guildID, settings) {
        if (typeof userID !== "string")
            throw new TypeError("Provided userID is not a string");

        if (!this.getUserSettings(guildID)) {
            this.sqlClient
                .prepare("INSERT INTO guildSettings VALUES (?, ?)")
                .run(guildID, "{}");
        }

        this.sqlClient
            .prepare(
                "UPDATE guildSettings SET configuration = ? WHERE guildID = ?"
            )
            .run(guildID, JSON.stringify(settings));
    }

    getUserSettings(userID) {
        if (typeof userID !== "string")
            throw new TypeError("Provided userID is not a string");

        const userSettings = this.sqlClient
            .prepare("SELECT configuration FROM userSettings WHERE userID = ?")
            .get(userID);

        return JSON.parse(
            userSettings ? userSettings.configuration : "undefined"
        );
    }

    setUserSettings(userID, settings) {
        if (typeof userID !== "string")
            throw new TypeError("Provided userID is not a string");

        if (!this.getUserSettings(userID)) {
            this.sqlClient
                .prepare("INSERT INTO userSettings VALUES (?, ?)")
                .run(userID, "{}");
        }

        this.sqlClient
            .prepare(
                "UPDATE userSettings SET configuration = ? WHERE userID = ?"
            )
            .run(userID, JSON.stringify(settings));
    }
}

module.exports = DBUtils;
