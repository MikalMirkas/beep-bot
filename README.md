<img src="https://raw.githubusercontent.com/MikalMirkas/beep-bot/master/assets/images/beep-bot-icon.png" width="200">

# beep-bot
> Project bot for funposting.

## Installing / Getting started

```shell
npm i
npm start
```
Installs packages and runs the program. It'll crash without a .ENV file with a proper secret key.

### Initial Configuration

```npm i
echo DISCORD_TOKEN=YOUR_SECRET_KEY_HERE >> .env
```

This project requires a .ENV file in the root directory of the application for Discord authentication.
The file has one field: DISCORD_TOKEN, which is just the bot secret key from the developer API page. 

## Developing

```shell
git clone https://github.com/MikalMirkas/beep-bot.git
cd beep-bot/
npm i
```

Boot up your text editor of choice and go ham.

### Running

```
npm start
```

## How it werk?

* Uses Discord.js.
* Uses an .env file for credentials, which contains a token for authentication.
* Has a configuration file that allows for light permissions and command manipulation.
* Parses chat messages on any server it's on, provided it can read them.
* Chat messages trigger functions which run code modules.

## User Features

* Parses messages and does stuff.
** All commands start with /beep.
* Current emphasis is on MediaWiki parsing.

Command list as of 0.4.0a:
```
imageboard     Returns an SFW image from a booru.
honk           Posts something that a certain someone might say.
genesis        Scrapes Ryuu's crew website for Granblue Fantasy stats.
help           :thinkign:
wiki           Searches MediaWiki websites.
```

## Developer Features

* Plug and play code blocks.
* No code coupling to the core command handler.

## Goals

* Act as a template for other text bot solutions.

## Contributing

If you'd like to contribute, please fork the repository and use a feature
branch.

A `CONTRIBUTING.md` has not been established yet.

Feature requests are welcomed.

## Links

- Repository: https://github.com/MikalMirkas/beep-bot
- Issue tracker: https://github.com/MikalMirkas/beep-bot/issues


## Licensing

The code in this project is licensed under the [GNU General Public License v3.0](https://github.com/MikalMirkas/beep-bot/blob/master/LICENSE).
