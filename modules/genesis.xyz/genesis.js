/**
 * @author Michael Mirkas
 * @date May 20th, 2019
 * @updated May 20th, 2019
 * @desc Powers scraping Ryuu's website.
 * @notes Puppeteer **does** support SPAs.
 */

const puppeteer = require('puppeteer');

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
        tr.shift( ); //remove header, not needed - max expected rows is 30 now
      
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

        tr.forEach(function(element, i) {
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
    })
    return content;
}


exports.search = search;