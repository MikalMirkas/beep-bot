/**
 * @author Michael Mirkas
 * @date May 18th, 2019
 * @updated May 23rd, 2019
 * @desc Manages the login mechanism for the bot.
 */

exports.login = function(client, token) {
    /**
     * The ready event is vital, it means that only *after* this will your bot start reacting to information received from Discord.
     */
    client.on('ready', () => {
        console.info(`[LOGIN] ${client.user.tag} authenticated.`);
      });
    
    client.login(token);
}