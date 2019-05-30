
/**
 * @author Michael Mirkas
 * @date May 18th, 2019
 * @updated May 23rd, 2019
 * @desc Handles the default behavioural routine for the bot.
 */

//Libraries
const Discord = require('discord.js');

//const DOMPurify = require('dompurify'); Does Discord auto-sanitize?

//create new client
const client = new Discord.Client();

//Configuration file
const env = process.env.NODE_ENV || 'development';
const config = require('./data/config')["general"];

//Load all commands.
const handler = require('./modules/handler');

//On client ready:
client.on('ready', () => {
    console.info(`[INFO] Application launch successful in ${env} mode.`);

    /**
     * @desc setActivity Carousel
     */
    const setNewActivity = () => {
        if(typeof setNewActivity.counter == 'undefined' || setNewActivity.counter + 1 > activities.length) {
            setNewActivity.counter = 0;
        }
		activities[setNewActivity.counter]();
        setNewActivity.counter++;
    }

    const activities = [
        () => { client.user.setActivity("Owner: MikalMirkas#7031", {type: "PLAYING"}) },
        () => { client.user.setActivity("Version: " + config.version, {type: "PLAYING"}) },
        () => { client.user.setActivity("bigg meme", {type: "PLAYING"}) },
    ]
    setNewActivity();

    setInterval(setNewActivity, 300000);
})

//On any message being recieved:
client.on('message', msg => {
    let reply = null;

    //Author handling:
    //Check if the author is a bot.
    if(msg.author.bot) {
        //Check if the author is the client.
        if(msg.author == client.user) {
            if(config.acknowledgeSelf)
            {
                reply = msg.reply("hi me");
            }
        }
        else if(config.acknowledgeBots) {
            reply = msg.reply("beep boop");
        }

        return reply;
    }

    //Check if the message was in a DM.
    if(!msg.guild) {
        if(config.acknowledgeDMs) {
            reply = msg.reply("This must be a direct message.");
        }

        return reply;
    }
    //End author handling.
    //Start message handling:

    if(!msg.content.startsWith(config.prefix)) {
        return;
    }

    //Load command handler.
    handler.handler(client, msg);
  });

//Log in:
require('./modules/auth/login').login(client, require('./data/config')[env].discord.token);