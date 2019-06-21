/**
 * @author Michael Mirkas
 * @date May 18th, 2019
 * @updated May 20th, 2019
 */

const { RichEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    message.channel.startTyping();
    try {
        //Array of shitposts
        const indieGames = [
            "grimrock",
            "im gay",
            "shovel knight",
            "ticket",
            "legend of hand",
            "rocket league",
            "monhun",
            "dcss"
        ]

        const getPhrase = () => {
            var phrases = [
            "honk",
            "im gay",
            "tia",
            "thanks",
            "same",
            "sif",
            "meme cuisine",
            "play " + indieGames[getRandomIndex(indieGames.length)],
            "remember when " + indieGames[getRandomIndex(indieGames.length)] + " was good"];

            return phrases[getRandomIndex(phrases.length)];
        }

        message.channel.send(
            new RichEmbed()
            .setTitle("Something Dae Might Say")
            .setDescription(getPhrase())
            .setColor(0xE159F5)
            .setFooter("Generated on " + new Date().toUTCString() + ".", client.user.avatarURL)
        );
    }
    catch (e) {
        message.channel.send(e);
    }
    message.channel.stopTyping();
};

exports.command = {
    "alias": "honk",
    "description": "Posts something that Dae might say."
}

function getRandomIndex(max) {
    return Math.floor(Math.random() * Math.floor(max));
}