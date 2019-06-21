/**
 * @author Michael Mirkas
 * @date May 23th, 2019
 * @updated June 21st, 2019
 * @desc Manages the command handling for the bot.
 * @notes Forked from https://github.com/itspedruu/discordjs-bot-example/blob/master/main.js.
 */

const glob = require("glob");
const config = require(process.mainModule.paths[0].split('node_modules')[0].slice(0, -1) + '/data/config');

const commandPath = config.command_path;

let files = glob.sync(`${commandPath}**/*.js`);

let commandMap = files.reduce(function(result, alias) {
    //Return every single export named command.
    var commandData = require(`../${alias}`).command;

    try {
        commandData.path = alias;
        result.push(commandData);
    }
    catch (e) {
        commandData = undefined;
    }
    
    return result;
}, []);

console.info(`[INFO] Command folder search successful. Commands found: ${commandMap.length}.`);

/**
 * 
 * @param {Discord.Client} client The Discord client.
 * @param {Discord.Message} message A reference to the original message.
 */
const handler = (client, message) => {
    let findSpaceSplit = (config.space_before_command == true ? 1 : 0);

    let args = message.content.split(/ +/g);
    if(args.length > findSpaceSplit) //if there are args
    {
        let commandAlias = args[findSpaceSplit].toLowerCase();

        if(findSpaceSplit == 0)
        {
            //Need to remove the prefix from the command. We should only get here if it starts with the prefix.
            commandAlias = commandAlias.substring(config.prefix.length);
        }
        
        let command = commandMap.find(command => command.alias.toLowerCase() == commandAlias);
        if (command) {
            require(`../${command.path}`).run(client, message, args.slice(findSpaceSplit + 1).join(' '));
        }
    }
    /* else {
        message.channel.send("Hello World");
    } */
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
exports.commands = commandMap;