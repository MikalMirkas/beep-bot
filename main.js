
/**
 * @author Michael Mirkas
 * @date May 18th, 2019
 * @updated May 21st, 2019
 */

//Declarations
const env = process.env.NODE_ENV || 'production';

//node_module and config requires
const Discord = require('discord.js');
const config = require('./config')[env];
//const DOMPurify = require('dompurify');

//mandatory logic require
const auth = require('./modules/login/login');

//optional modules below:
const meme = require('./modules/funpost/daeposting');

//requires urllib package
const wiki = require('./modules/wiki/search');

//requires puppeteer package
const genesis = require('./modules/genesis.xyz/genesis');

//requires booru package
const booru = require('./modules/booru/search');

//create new client
const client = new Discord.Client();

//Logic begins here:
auth.login(client, config);

//On any message being recieved:
client.on('message', message => {
    //The bot cannot react to itself.
    if((message.author != client.user))
    {
        //Check message source
        if (!message.guild) {
            message.reply("DM ack");
        }
        else {
        //Parse and sanitize message contents
        var parsedMessage = message.content.trim();

        //find command
        var command = parsedMessage.substring(0, parsedMessage.indexOf(" ") == -1 ? parsedMessage.length : parsedMessage.indexOf(" ")).toLowerCase();

        //find arguments and titleize them
        var args = command.length == parsedMessage.length ? "" : titleize(parsedMessage.substring(parsedMessage.indexOf(" ") + 1));

        switch(command) {
            case "pso2!class":
                message.channel.send("wip");
                break;
            case "pso2!wiki":
                wiki.search("https://pso2.arks-visiphone.com/wiki/", args).then(function(val) {
                    message.channel.send(val);
                });
                break;
            case "gbf!wiki":
                wiki.search("https://gbf.wiki/", args).then(function(val) {
                    message.channel.send(val);
                });
                break;
            case "ffxiv!wiki":
                wiki.search("https://ffxiv.gamerescape.com/wiki/", args, " &#8211; ").then(function(val) {
                    message.channel.send(val);
                });
                break;
            case "m!honk":
                message.channel.send(
                    new Discord.RichEmbed()
                    .setTitle("Something Dae Might Say")
                    .setDescription(meme.funpost())
                    .setColor(0xE159F5)
                    .setFooter("Generated on " + new Date().toUTCString() + ".", client.user.avatarURL)
                );
                break;
            case "m!pon":
                booru.search().then(function(post) {
                    console.log(post);
                    message.channel.send(
                        new Discord.RichEmbed()
                        .setImage(post.fileUrl)
                        .setURL(post.postView)
                        .setTitle("Mahiraposting")
                        .setColor(0xE159F5)
                        .setFooter("Generated on " + new Date().toUTCString() + " via booru.js.", client.user.avatarURL)
                    );
                });
                break;
            case "gbf!genesis":
                genesis.search("https://genesis-gbf.xyz/Crew?id=0/").then(function(crew) {
                    /* 
                     * Transform object into table-like.
                     * Discord has a 2000 char limit per desc. We can post 9 rows at a time, excluding the header.
                     * Each line is roughly 200 characters.
                     */
                    const range = 25;
                    
                    for(i = 0; i < Math.ceil(crew.members.length / range); i++) {
                        let embed = new Discord.RichEmbed()
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
                break;
            }
        }
    }
  });
  
const titleize = (title) => {
    const str = title.trim().split(/\s+/);
    try {
        return str.map(word => word[0].toUpperCase() + word.substr(1)).join(' ')
    }
    catch (e) {
        console.log(e);
    }
}