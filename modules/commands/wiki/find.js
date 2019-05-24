/**
 * @author Michael Mirkas
 * @date May 19th, 2019
 * @updated May 24th, 2019
 * @desc Powers the rich embedding functionality of MediaWiki applications.
 */

const MWBot = require('mwbot');

const shorthands = {
    "gbf": {
        "apiUrl": "https://gbf.wiki/api.php",
        "customEmbed": false,
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

exports.run = (client, message, args) => {
    //Check if shorthanded:
    let customEmbed = false;

    let context = (([url, ...others]) => ({"url": url.toLowerCase(), "query": [...others].join(' ')}))(args);
    if(Object.keys(shorthands).find((element) => element == context.url) != undefined) {
        let temp = shorthands[Object.keys(shorthands).find((element) => element == context.url)];
        context.url = temp.apiUrl;
        customEmbed = temp.customEmbed;
    }

    const wiki = new MWBot({
        apiUrl: context.url || "https://en.wikipedia.org/w/api.php"
    });

    wiki.request({
        action: "query",
        prop: "info|revisions",
        inprop: "url",
        rvprop: "content",
        titles: context.query,
        redirects: "1",
        meta: "siteinfo"
    }).then((response) => {
        //console.log(response.query);
        const pageId = Object.keys(response.query.pages)[0];

        if(pageId != -1) {
            //Page found
            if(customEmbed) {
                message.channel.send(`${response.query.general.sitename} \:book: | ${response.query.pages[pageId].title}`);
            }
            else {
                message.channel.send(`${response.query.general.sitename} \:book: | ${response.query.pages[pageId].title}: ${response.query.pages[pageId].fullurl}`);
            }
        }
        else {
            message.channel.send("\:book: Page not found.")
        }
    }).catch((e) => {
        message.channel.send(e.toString());
    });

    /* wiki.setApiUrl();

    wiki.read(context.query)
    .then((page) => {
        if(customEmbed) {
            console.log(page);
        }
        else {
            console.log(page);
        }
    }) */
}; 

exports.command = {
    "alias": "wiki",
    "description": "Searches MediaWiki websites."
}