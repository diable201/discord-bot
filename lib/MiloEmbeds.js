const { MessageEmbed } = require("discord.js");
const nHentaiAPI = require("nana-api");
const TYPE = {
    j: "jpg",
    p: "png",
    g: "gif"
};

let api = new nHentaiAPI();

class MiloEmbeds {
    constructor(client) {
        this.client = client;
    }

    getRandom() {
        return api.random().then(res => res);
    }

    getById(id) {
        return api.g(id.toString()).then(res => res);
    }

    getInfo(res) {
        let json = {};

        json.title = res.title.pretty;
        json.link = `https://nhentai.net/g/${res.id}`;
        json.id = res.id;
        json.tag = res.tags
            .filter(x => x.type == "tag")
            .map(x => this.client.util.toPlural(x.name));
        json.category = res.tags
            .filter(x => x.type == "category")
            .map(x => this.client.util.toPlural(x.name));
        json.artist = res.tags
            .filter(x => x.type == "artist")
            .map(x => this.client.util.toPlural(x.name));
        json.parody = res.tags
            .filter(x => x.type == "parody")
            .map(x => this.client.util.toPlural(x.name));
        json.character = res.tags
            .filter(x => x.type == "character")
            .map(x => this.client.util.toPlural(x.name));
        json.cover = `https://i.nhentai.net/galleries/${res.media_id}/1.${
            TYPE[res.images.cover.t]
        }`;

        let lang = res.tags.filter(x => x.type == "language").map(x => x.name);
        if (lang[0] == "translated") {
            json.lang = this.client.util.toPlural(lang[1]);
        } else {
            json.lang = this.client.util.toPlural(lang[0]);
        }

        return json;
    }

    async getInfoEmbed(id, msg) {
        const embed = new MessageEmbed();
        let res = await this.getById(id);

        // filter the banned tag before serve to user
        let banned = false;
        for (let ban of this.client.config.BANNED) {
            let filters = res.tags.filter(x => x.type == "tag" && x.name == ban);
            if (filters.length !== 0)
                banned = true;
        }

        if (banned)
            return msg.channel
            .send(
              `:warning: Sorry, I cannot display the doujin because contain **BANNED** tag\nCode: ${id}`
            )
            .then(m => m.delete({ timeout: 10000 }));
        let info = this.getInfo(res);

        // console.log(info);
        embed.setAuthor("nHentai random generator", this.client.nHlogo);
        embed.setColor(this.client.config.COLOR);
        // embed.setThumbnail(thumb);
        embed.setTitle(`${res.title.pretty}`);
        embed.setDescription(
          `Made by: **${info.artist[0] ? info.artist.join(", ") : info.artist}**`
        );
        embed.setURL(`https://nhentai.net/g/${res.id}`);
        embed.setImage(info.cover);
        // embed.setFooter(`React with 📖 to continue reading / ${res.id}`);
        embed.addField("Language", info.lang, true);
        if (info.parody[0])
            embed.addField(
                "Parody",
                info.parody[0] ? info.parody.join(", ") : info.parody,
                true
            );
        if (info.character[0])
            embed.addField(
                "Characters",
                info.character[0] ? info.character.join(", ") : info.character,
                true
            );
        if (info.category[0]) embed.addField("Categories", info.category, true);
            embed.addField("Pages", res.num_pages, true);
        if (info.tag[0])
            embed.addField("Tags", info.tag[0] ? info.tag.join(", ") : info.tag);
        let m = await msg.channel.send(embed);
        // this.getEmoji(id, m, msg);
    }
}

module.exports = MiloEmbeds;
