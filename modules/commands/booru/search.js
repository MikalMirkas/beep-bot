
/**
 * @author Michael Mirkas
 * @date May 22nd, 2019
 * @updated May 23rd, 2019
 * @desc Returns an SFW image from a booru.
 */


const Booru = require('booru');
const { RichEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    try {
        if (args.length == 0 || !Array.isArray(args)) {
            throw ("This command requires additional parameters.");
        }
        return await Booru.search('safebooru', args.join(' '), { limit: 1, random: true })
            .then(posts => {
                for (let post of posts)
                    return post;
            })
            .then(function (post) {
                console.log(post);
                message.channel.send(
                    new RichEmbed()
                        .setImage(post.fileUrl)
                        .setURL(post.postView)
                        .setTitle("Mahiraposting")
                        .setColor(0xE159F5)
                        .setFooter("Generated on " + new Date().toUTCString() + " via booru.js.", client.user.avatarURL)
                );
            })
            .catch((err) => {
                message.channel.send(err.message);
            });
    }
    catch (e) {
        message.channel.send(e);
    }
};

exports.command = {
    "alias": "imageboard",
    "description": "Returns an SFW image from a booru."
}