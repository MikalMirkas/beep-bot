
/**
 * @desc Configuration file.
 */

var config = {
    general: {
        "prefix": "/beep",
        "version": "0.1.0",
        "command_path": "./modules/commands/",
        "space_before_command": true,
        "acknowledgeDMs": false,
        "acknowledgeSelf": false,
        "acknowledgeBots": false
    },
    development: {	
        discord: {
            "token": "NTc5NDU0NzA1NzI2NjUyNDM5.XODaQA.-rUfKtWfa5QIYVsZ0eqqlG0ZJYk",	
        }	
    },	
    production: {	
        discord: {	
            "token": "NTc5NDU0NzA1NzI2NjUyNDM5.XODaQA.-rUfKtWfa5QIYVsZ0eqqlG0ZJYk",	
        }	
    }	
}	
module.exports = config; 