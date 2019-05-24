/**
 * @author Michael Mirkas
 * @date May 20th, 2019
 * @updated May 20th, 2019
 * @desc Powers scraping Ryuu's website.
 * @notes Puppeteer **does** support SPAs.
 */

const puppeteer = require('puppeteer');
const { RichEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    /**
         * @param {*} url The URL page to scrape.
         * @returns An object containing all the users on the page.
         */
    const search = async (url = "https://genesis-gbf.xyz") => {
        //Go to URL.
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);

        let content = await page.evaluate(() => {
            //The raw table object.
            let tr = [...document.querySelectorAll('tr')];
            tr.shift(); //remove header, not needed - max expected rows is 30 now

            /* Convert to this model:
              members: [
                      {
                          "profileId": "",
                          "playerName": "", 
                          "gbfId": "",
                          "discordTag": "",
                          "availability": {
                              start: "",
                              end: "",
                          },
                      }
                  ]
              */

            let crew = {
                "title": "Genesis",
                "id": 623655
            };
            let ids = tr.map((tr, i) => tr.innerHTML.match('id=([^"]*)')[1]); //extracts all playerIds
            let members = [];

            tr.forEach(function (element, i) {
                let player = {

                }
                let temp = (ids[i] + "\n" + element.innerText.replace(/\t/g, '\n').replace(/\n\n/g, '\n')).split("\n");

                player.profileId = temp[0];
                player.playerName = temp[1];
                player.gbfId = temp[2];
                player.discordTag = temp[3];
                player.availability = {};
                player.availability.start = temp[4];
                player.availability.end = temp[5];
                members.push(player);
            });

            crew.members = members;
            return crew;
        }).then(function(crew) {
            /* 
                * Transform object into table-like.
                * Discord has a 2000 char limit per desc. We can post 9 rows at a time, excluding the header.
                * Each line is roughly 200 characters.
                */
            const range = 25;
            
            for(i = 0; i < Math.ceil(crew.members.length / range); i++) {
                let embed = new RichEmbed()
                .setTitle(crew.title)
                .setURL("http://game.granbluefantasy.jp/#guild/detail/" + crew.id)
                .setFooter((Math.ceil(crew.members.length / range) > 1 ? "Page " + (i + 1) + "/" + Math.ceil(crew.members.length / range) + " | " : "") + "Generated on " + new Date().toLocaleString("en-US", {timeZone: "Asia/Tokyo"}) + " JST via genesis-gbf.xyz", client.user.avatarURL);
                for (j = 0; j < (crew.members.length - (range * (i)) > range ? range : crew.members.length - (range * (i))); j++) {
                    let row = ["[ID: " + crew.members[j+(i*range)].gbfId + "]" + "(http://game.granbluefantasy.jp/#profile/" + crew.members[j+(i*range)].gbfId + ")", "[Availability: " +  (crew.members[j+(i*range)].availability.start + " - " + crew.members[j+(i*range)].availability.end) + "](https://genesis-gbf.xyz/Profile?id=" + crew.members[j+(i*range)].profileId + ")"]
                    embed.addField(crew.members[j+(i*range)].playerName + " - " + crew.members[j+(i*range)].discordTag, row, true);
                }
                //post
                message.channel.send(embed);
            }
        });
    }

    try {
        search("https://genesis-gbf.xyz/Crew?id=0/");
    }
    catch (e) {
        message.channel.send(e);
    }
};

exports.command = {
    "alias": "genesis",
    "description": "Scrapes Ryuu's crew website for stats."
}