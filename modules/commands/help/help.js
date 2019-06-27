/**
 * @author Michael Mirkas
 * @date June 15th, 2019
 * @updated June 21st, 2019
 */

const handler = require('../../handler');

exports.args = {
    alias: {
        public: ['p']
    }
};

exports.run = async (client, message, args) => {
    const parsedArgs = require('yargs-parser')(args, exports.args);
    message.channel.startTyping();

    var msg = "```\nHelp:\n\n";
    
    handler.commands.map((ele) => {msg += ele.alias.padEnd(15) + ele.description + "\n"});
    if(parsedArgs.public)
    {
        message.channel.send(msg + "\n```");
    }
    else
    {
        message.channel.send("Help sent via DM.");
        message.author.send(msg + "\n```");
    }

    message.channel.stopTyping();
};

exports.command = {
    "alias": "help",
    "description": ":thinkign:"
}