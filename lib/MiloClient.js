const { Client } = require("discord.js-light");
const MiloEmbeds = require("./MiloEmbeds");
const MiloDatabase = require("./MiloDatabase");
const MiloUtils = require("./MiloUtils");

class Milo extends Client {
    constructor(opt) {
        super(opt);
        this.config = require("../config");
        this.version = require("../package").version;
        this.util = new MiloUtils(this);
        this.embeds = new MiloEmbeds(this);
        this.database = new MiloDatabase(this);
        this.nHlogo = "https://cdn.discordapp.com/attachments/466964106692395008/580378765419347968/icon_nhentai.png";
        this.mangadl = "https://mangadl.herokuapp.com/download/nhentai"
    }
}

module.exports = Milo;
