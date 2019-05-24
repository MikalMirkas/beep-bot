/**
 * @author Michael Mirkas
 * @date May 19th, 2019
 * @updated May 24th, 2019
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
        var encodedUrl = wikiRootUrl + query;
        
        return await urllib.request(encodedUrl)
        .then(function(result) {
            var reply;
            //result: {data: buffer, res: response object}
            console.info('[WIKI] Parameters: %s, Status: %s, Size: %d', query, result.res.statusCode, result.data.length);
            if(result.res.statusCode > 400) {
                reply = "Page doesn't exist.";
            }
            else {
                var title = makeWikiTitle(result.data.toString().split('<title>')[1].split('</title>')[0], filter); //scrape page for title
                reply = title + " | " + encodedUrl;
            }
            return reply;
        })
        .catch(function (err) {
            console.log(err);
            return "Exception thrown: " + err.message;
        });
    }
}

exports.run = async (client, message, args) => {
    try {
        //Reformat the arguments:
        let context = (([url, ...others]) => ({"url": url, "query": [...others].join('_')}))(args);
        let result = await search(context.url, context.query);
        message.channel.send(result);
    }
    catch (e) {
        message.channel.send(e);
    }
};

///beep wiki http://gbf.wiki/ Ultima_Sword
exports.command = {
    "alias": "wiki",
    "description": "Searches MediaWiki websites."
}

function makeWikiTitle(title, filter, emoji = "\:book:")
{
    //Expected input: %s %s %s
    console.info(`[WIKI] Page title: ${title}`);
    const editedTitle = emoji + " " + title.substring(title.lastIndexOf(filter) + filter.length) + ": " + title.substring(0, title.lastIndexOf(filter));
    return editedTitle;
}