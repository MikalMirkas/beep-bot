/**
 * @author Michael Mirkas
 * @date May 19th, 2019
 * @updated May 30th, 2019
 * @desc Powers the rich embedding functionality of MediaWiki applications.
 */

const MWBot = require('mwbot');
//const parseInfo = require('infobox-parser');
const { RichEmbed } = require('discord.js');
const md = require('md5');
const cheerio = require("cheerio");
//const hooks = require("./data.js");


const shorthands = {
    "gbf": {
        "apiUrl": "https://gbf.wiki/api.php",
        "customEmbed": true,
    },
    "pso2": {
        "apiUrl": "https://pso2.arks-visiphone.com/api.php",
        "customEmbed": false,
    },
    "xiv": {
        "apiUrl": "https://ffxiv.gamerescape.com/w/api.php",
        "customEmbed": false,
    },
    "ffxiv": {
        "apiUrl": "https://ffxiv.gamerescape.com/w/api.php",
        "customEmbed": false,
    },
    "ff14": {
        "apiUrl": "https://ffxiv.gamerescape.com/w/api.php",
        "customEmbed": false,
    },
}

var title;

exports.run = (client, message, args) => {
    //Check if shorthanded:
    let customEmbed = false;

    let context = (([url, ...others]) => ({ "url": url.toLowerCase(), "query": [...others].join('_') }))(args);
    if (Object.keys(shorthands).find((element) => element == context.url) != undefined) {
        let temp = shorthands[Object.keys(shorthands).find((element) => element == context.url)];
        context.url = temp.apiUrl;
        customEmbed = temp.customEmbed;
    }

    const wiki = new MWBot({
        apiUrl: context.url || "https://en.wikipedia.org/w/api.php"
    });

    wiki.request({
        action: "query",
        format: 'json',
        prop: "info|revisions|imageinfo",
        inprop: "url",
        rvprop: "content|parsetree",
        //rvexpandtemplates: "1",
        rvparse: "1",
        rvlimit: "1",
        titles: context.query,
        redirects: "1",
        meta: "siteinfo",
    }).then((response) => {
        const pageId = Object.keys(response.query.pages)[0];

        if (pageId != -1) {
            //Page found.

            //Extract all wikitext from infobox and the rest of the page.
            let page = response.query.pages[pageId];
            //console.log(page["revisions"][0]["*"]);

            //console.log(page["revisions"][0]["parsetree"])
            //console.log(page.revisions[0]["*"]);
            //console.log(wtf(page.revisions[0]["*"]));
            /*             let infobox = parseInfo(response.query.pages[pageId]['revisions'][0]['*']);
                        let content = parseContent(response.query.pages[pageId]['revisions'][0]['*']); */

            /* console.log(infobox);
            console.log(response.query.pages[pageId]['revisions'][0]['*']);
            console.log(content); */
            title = `${response.query.pages[pageId].title}`;

            let reply = `${response.query.general.sitename} \:book: | ${title}: ${response.query.pages[pageId].fullurl}`;
            if (customEmbed) {
                //Add logic to determine what kind of embed it is here.
                if (page['revisions'][0]['*'].indexOf('<strong class="selflink">Game</strong>') != -1) {
                    generateCharacter(response, pageId, client).then((embed) => {
                        message.channel.send(embed);
                    });
                }
                else {
                    message.channel.send(reply);
                }
            }
            else {
                message.channel.send(reply);
            }
        }
        else {
            message.channel.send("\:book: Page not found.");
        }
    })/* .catch((e) => {
        message.channel.send(e.toString());
    }); */
};

exports.command = {
    "alias": "wiki",
    "description": "Searches MediaWiki websites."
}

const headingPattern = /(==+)(?:(?!\n)\s?)((?:(?!==|\n)[^])+)(?:(?!\n)\s?)(==+)/g;

function parseCharacter(string)
{
    const _ougi = {
        name: "",
        effect: "",
        condition: "",
    };
    
    const _active = {
        name: "",
        cooldown: "",
        duration: "",
        obtained: "",
        effect: "",
    };
    
    const _passive = {
        name: "",
        obtained: "",
        effect: "",
        condition: "",
    };
    
    //Convert to linebreaks to not get ripped apart after
    string = string.replace(/<br ?\/?>/g, "\n");

    const $ = cheerio.load(string);

    $(".tooltiptext").remove();
    $(".reference").remove();


    let character = $(".character__details").eq(0);
    let ougi = $(".character__details").eq(1);
    let active = $(".character__details").eq(2);
    let passive = $(".character__details").eq(3);
    let emp = $(".character__details").eq(4);
    let uncap = $(".character__details").eq(5);

    function getCharacter() {
        let stats = {};
        let statsTab = character.children().eq(1).children().eq(1).find(".tabbertab").eq(0).find("table").eq(0);
        let recruitTab = character.children().eq(1).children().eq(1).find(".tabbertab").eq(0).find("table").eq(1);
        let extraData = character.children().eq(1).children().eq(1).find(".tabbertab").eq(1).find("table").eq(0)
        
        statsTab.find("th").eq(0).remove();
        recruitTab.find("th").eq(0).remove();
        extraData.find("th").eq(0).remove();
        
        statsTab.find("th").each(function(i, elem) {
            stats[$(this).text().toLowerCase()] = parseStats($(this).next().html());
        })
        
        recruitTab.find("th").each(function(i, elem) {
            stats[$(this).text().toLowerCase()] = parseStats($(this).next().html());
        })
    
        extraData.find("th").each(function(i, elem) {
            stats[$(this).text().toLowerCase()] = parseStats($(this).next().html());
        })
        
        stats.name = character.find(".char-name").text();
        stats.title = character.find(".char-title").text().slice(1, -1);
        stats.profile = character.children().eq(2).text().trim();
        stats.rarity = character.find(".char-rarity").children()[0].attribs.alt.slice(7, -4);
    
    
        return stats;
    }

    function getOugis() {
        let ougis = [];
            for (i = 0; i < ougi.find(".skill-name").length; i++) {
            let ougiInstance = Object.create(_ougi);
            //Name
            let activeTarget = ougi.find(".skill-name").eq(i);
            ougiInstance.name = activeTarget.text().trim();
            //Effect
            activeTarget = activeTarget.next();
            ougiInstance.effect = activeTarget.text().trim();
            
            ougis.push(ougiInstance);
        }
        return ougis;
    }

    function getActives() {
        let actives = [];
        for (i = 0; i < active.find(".skill-name").length; i++) {
            let activeInstance = Object.create(_active)
            
            let activeTarget = active.find(".skill-name").eq(i);
            //Name
            activeInstance.name = activeTarget.text().trim();
            //Cooldown
            activeTarget = activeTarget.next();
            //Duration
            activeTarget = activeTarget.next();
            //Obtained
            activeTarget = activeTarget.next();
            //Effect
            activeTarget = activeTarget.next();

            activeInstance.effect = activeTarget.text().trim();
            actives.push(activeInstance);
        }
        return actives;
    }

    function getPassives() {
        let passives = [];
        for (i = 0; i < passive.find(".skill-name").length; i++) {
            let passiveInstance = Object.create(_passive);

            let activeTarget = passive.find(".skill-name").eq(i);
            //Name
            passiveInstance.name = activeTarget.text().trim()
            //Obtained
            activeTarget = activeTarget.next();
            //Effect
            activeTarget = activeTarget.next();
            passiveInstance.effect = activeTarget.text().trim();
            passives.push(passiveInstance);
        }
        return passives;
    }

    let data = {
        stats: getCharacter(),
        ougis: getOugis(),
        skills: {
            active: getActives(),
            passive: getPassives()
        }
    };

    console.log(data);
    return data;
}

async function generateCharacter(response, pageId, client) {

    const elementColors = {
        fire: "#CC6633",
        water: "#3366CC",
        earth: "#996633",
        dark: "#330099",
        light: "#FFFF66",
        wind: "#66CC33",
        any: "#dfdfdf"
    }

    let data = parseCharacter(response.query.pages[pageId]['revisions'][0]['*']);
     
    //figure out the thumbnail url
    let img = `Npc_s_${data.stats.id}_01.jpg`;
    let imghash = md(img);
    let page = response.query.pages[pageId];
    let imgurl = [response.query.general.base.substring(0, response.query.general.base.lastIndexOf("/")), 'images', imghash.substring(0, 1), imghash.substring(0, 2), img].join('/'); //wikimedia hash algorithm, note that this is fundamentally wrong https://stackoverflow.com/questions/8363531/accessing-main-picture-of-wikipedia-page-by-api#comment17796475_8363589
    let embed = new RichEmbed()
        .setAuthor(`${response.query.general.sitename}`, response.query.general.base.substring(0, response.query.general.base.indexOf("//") + 2) + response.query.general.favicon.substring(2), page.fullurl)
        .setThumbnail(imgurl)
        .setTitle(`${data.stats.name}${data.stats.title == null ? "" : ", " + data.stats.title}`)
        .setDescription(`${data.stats.profile}`)
        .setURL(page.fullurl)
        .setFooter(`Generated on ${new Date().toUTCString()} via ${response.query.general.sitename}.`, client.user.avatarURL)
        .setColor(elementColors[data.stats.element.toLowerCase()] || "#dfdfdf");

        data.ougis.forEach((element, i) => {
            embed.addField(`Charge Attack${i == 0 ? "" : " #" + (i + 1)}: ${element.name}`, element.effect);
        });

        data.skills.active.forEach((element, i) => {
            embed.addField(`Skill #${i + 1}: ${element.name}`, element.effect);
        });

    return embed;
}

function parseStats(string = "unknown") {

    const strip = require('string-strip-html');

    let stripOptions = {
        ignoreTags: [],
        onlyStripTags: [],
        stripTogetherWithTheirContents: ["script", "style", "xml", "ref"],
        skipHtmlDecoding: false,
        returnRangesOnly: false,
        trimOnlySpaces: false,
        dumpLinkHrefsNearby: {
            enabled: false,
            putOnNewLine: false,
            wrapHeads: "",
            wrapTails: ""
        }
    }

    let result = null;
    if(string != null) {
        if(string.lastIndexOf("<img alt=") != -1) {
            temp = string.slice(string.lastIndexOf("<img alt=") + 9);
            temp = temp.match(/"(.*?)"/)[1];

            //Look for the following words: Type, Weapon, Race, or Icon and take the word after it.
            result = temp.match(/(Element|Weapon|Type|Icon|Race) (.*)\./)[2];

        }
        else {
            result = strip(string, stripOptions);
        }
    }
    return result;
}