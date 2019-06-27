/**
 * @author Michael Mirkas
 * @date June 27th, 2019
 * @updated June 27th, 2019
 */

exports.run = async (client, message, args) => {
    const parsedArgs = require('yargs-parser')(args, {
        alias: {
            query: ['q']
        }
    });

    if (message.member.voiceChannel) {
        if(parsedArgs.query == null) {
            message.reply("please specify something to aeiou.")
        }
        else if(encodeURIComponent(parsedArgs.query) > 1024) {
            message.reply(`The query is ${encodeURIComponent(parsedArgs.query) - 1024} characters too long. Please shorten your aeiou.` )
        }
        else {
            message.member.voiceChannel.join()
            .then(connection => { // Connection is an instance of VoiceConnection
                const dispatcher = connection.playArbitraryInput("http://tts.cyzon.us/tts?text=" + encodeURIComponent(parsedArgs.query))
                dispatcher.on("end", end => {
                    setTimeout(() => {
                        message.member.voiceChannel.leave();
                    }, 3000)
                });
                //console.log(stream);
            })
            .catch(console.log);
        }
      }
      else {
        message.reply('You need to join a voice channel first!');
      }
};

exports.command = {
    "alias": "dec",
    "description": "aeiou"
}

//http://tts.cyzon.us/tts?text=<URL encoded text>