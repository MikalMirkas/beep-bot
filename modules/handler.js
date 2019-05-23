/**
 * @author Michael Mirkas
 * @date May 23th, 2019
 * @updated May 23rd, 2019
 * @desc Manages the command handling for the bot.
 * @notes Forked from https://github.com/itspedruu/discordjs-bot-example/blob/master/main.js.
 */

const glob = require("glob");
const config = require('../data/config')["general"];

const commandPath = config.command_path;

let files = glob.sync(`${commandPath}**/*.js`);
let commandMap = files.map((alias => {
    //Return every single export named command.
    var commandData = require(`../${alias}`).command;

    try {
        commandData.path = alias;
    }
    catch (e) {
        commandData = undefined;
    }
    
    return commandData;
}));

console.info(`[INFO] Command folder search successful. Files found: ${commandMap.length}, Commands found: ${commandMap.filter((element) => { return element != null; }).length}`);

/**
 * 
 * @param {Discord.Client} client The Discord client.
 * @param {Discord.Message} message A reference to the original message.
 */
const handler = (client, message) => {
    let findSpaceSplit = (config.space_before_command == true ? 1 : 0);

    let args = message.content.split(/ +/g);
    let commandAlias = args[findSpaceSplit].toLowerCase();
    let command = commandMap.find(command => command.alias.toLowerCase() == commandAlias);
    if (command) {
        require(`../${command.path}`).run(client, message, args.slice(findSpaceSplit + 1));
    }
};


/**
 * @param {String} title A string.
 * @desc Titleizes the string.
 * @returns A titleized string.
 */
/* const titleize = (title) => {
    const str = title.trim().split(/\s+/);
    try {
        return str.map(word => word[0].toUpperCase() + word.substr(1)).join(' ')
    }
    catch (e) {
        console.log(e);
    }
} */

exports.handler = handler;