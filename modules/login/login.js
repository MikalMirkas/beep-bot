/**
 * @author Michael Mirkas
 * @date May 18th, 2019
 * @updated May 18th, 2019
 * @desc Manages the login mechanism for the bot.
 */

exports.login = function(client, config) {
    /**
     * The ready event is vital, it means that only *after* this will your bot start reacting to information received from Discord.
     */
    client.on('ready', () => {
        console.log(`${client.user.tag} authenticated.`);
      });
    
    client.login(config.discord.token);
}