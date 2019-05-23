/**
 * @author Michael Mirkas
 * @date May 19th, 2019
 * @updated May 20th, 2019
 * @desc Powers the search functionality of MediaWiki applications.
 * @notes urllib does not support SPAs.
 */

const urllib = require('urllib');

/**
 * @param {*} wikiRootUrl The wiki root URL.
 * @param {*} query The search query that the user inputs.
 * @param {*} filter The custom filter for title adjustment.
 * @returns A string containing the URL of the specified page if it exists, or an error if it doesn't.
 */
const search = async (wikiRootUrl, query, filter = " - ") => {
    if(query.length == 0) {
        return "This command requires additional parameters.";
    }
    else {
        var encodedUrl = wikiRootUrl + query.replace(/ /g, "_");
        
        return await urllib.request(encodedUrl)
        .then(function(result) {
            var reply;
            //result: {data: buffer, res: response object}
            //console.log('parameters: %s, status: %s, body size: %d', query, result.res.statusCode, result.data.length);
            if(result.res.statusCode > 400) {
                reply = "Page doesn't exist.";
            }
            else {
                var title = makeWikiTitle(result.data.toString().split('<title>')[1].split('</title>')[0], filter); //scrape page for title
                reply = title + " | " + encodedUrl;
            }
            return reply;
        }).catch(function (err) {
            console.log(err);
            return "Exception thrown: " + err.message;
        });
    }
}

function makeWikiTitle(title, filter, emoji = "\:book:")
{
    //Expected input: %s %s %s
    const editedTitle = emoji + " " + title.substring(title.lastIndexOf(filter) + filter.length) + ": " + title.substring(0, title.lastIndexOf(filter));
    return editedTitle;
}

exports.search = search;