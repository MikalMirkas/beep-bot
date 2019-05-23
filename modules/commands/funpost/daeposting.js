/**
 * @author Michael Mirkas
 * @date May 18th, 2019
 * @updated May 20th, 2019
 */

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

exports.funpost = getPhrase;

function getRandomIndex(max) {
    return Math.floor(Math.random() * Math.floor(max));
}