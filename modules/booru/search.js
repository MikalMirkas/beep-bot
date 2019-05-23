
/**
 * @author Michael Mirkas
 * @date May 22nd, 2019
 * @updated May 22nd, 2019
 * @desc Returns an SFW image from a booru.
 */

 const Booru = require('booru');

 //Safebooru
 /**
  * @param {*} query Text to search for.
  * @returns A Post object.
  */
 const booruSearch = async (query = "Mahira_(granblue_fantasy)") => {
    return await Booru.search('safebooru', query.trim().split(/\s+/), {limit: 1, random: true})
    .then(posts => {
        for (let post of posts)
            return post;
        })
 };

 
exports.search = booruSearch;