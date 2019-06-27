
/**
 * @author Michael Mirkas
 * @date May 22nd, 2019
 * @updated June 21st, 2019
 * @desc Returns an SFW image from a booru.
 */

const Booru = require('booru');
const { RichEmbed } = require('discord.js');

exports.args = {
    alias: {
        query: ['q', 'search', 's']
    }
};

exports.run = async (client, message, args) => {
    const arguments = require('yargs-parser')(args, exports.args);

    message.channel.startTyping();

    try {
        return await Booru.search('safebooru', arguments.query, { limit: 1, random: true })
            .then(posts => {
                for (let post of posts)
                    return post;
            })
            .then(function (post) {
                message.channel.send(
                    new RichEmbed()
                        .setImage(post.fileUrl)
                        .setURL(post.postView)
                        .setTitle(post.data.id)
                        .setColor(0xE159F5)
                        .setFooter("Generated on " + new Date().toUTCString() + " via booru.js.", client.user.avatarURL)
                );
            })
            .catch((err) => {
                if (err instanceof Booru.BooruError) {
                    message.channel.send(err.message);
                  } else {
                    //console.error(err);
                    message.channel.send("No images found.");
                  }
            })
            .then(() => {
                message.channel.stopTyping();
            });
    }
    catch (e) {
        message.channel.send(e);
    }
};

exports.command = {
    "alias": "image",
    "description": "Returns an SFW image from a booru."
}