const rp = require('request-promise');

const FLICKR_API_ENDPOINT = 'https://api.flickr.com/services/rest/?method=flickr.photos.search';
const FLICKR_API_KEY = process.env.FLICKR_API_KEY;
const FLICKR_SECRET = process.env.FLICKR_SECRET;

module.exports = (query, offset, callback) => {
  rp ({
    uri: FLICKR_API_ENDPOINT,
    qs : {
      api_key: FLICKR_API_KEY,
      tags: query.replace(" ", ","),
      per_page: 10,
      page: offset,
      format: 'json',
      content_type: 1,
      nojsoncallback: 1,
      safe_search: 1,
      sort: 'relevance'
    },
    json: true
  })
    .then((results) => {
        if (!results.photos.photo) {
          return callback({error: `Error searching for "${query}": No Results`});
        }
        const items = results.photos.photo.map(item => {
          return {
           "id": item.id,
           "url": `https://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}_m.jpg`,
           "snippet": item.title,
           "thumbnail" : `https://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}_t.jpg`,
           "context" : `https://www.flickr.com/photos/${item.owner}/${item.id}`
          }});
        return callback({query, offset, items});
    })
    .catch((err) => {
      console.log(err);
      return callback({error: `Error searching for "${query}": ${err}`});
    });
};
