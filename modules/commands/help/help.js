/**
 * @author Michael Mirkas
 * @date June 15th, 2019
 * @updated June 21st, 2019
 */

const handler = require('../../handler');

exports.run = async (client, message, args) => {
    message.channel.startTyping();

    var msg = "```\nHelp:\n\n";
    
    handler.commands.map((ele) => {msg += ele.alias.padEnd(15) + ele.description + "\n"});
    if(args[0] != "-p")
    {
        message.channel.send("Help sent via DM.");
        message.author.send(msg + "\n```");
    }
    else
    {
        message.channel.send(msg + "\n```");
    }

    message.channel.stopTyping();
};

exports.command = {
    "alias": "help",
    "description": ":thinkign:"
}