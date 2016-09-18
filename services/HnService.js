const rp = require('request-promise')

/**
* hnService.js
*
* @description :: Server-side logic for managing hn request.
*/
module.exports = {
  initHits: function (query, hitsCuantity) {
    return rp(`http://hn.algolia.com/api/v1/search_by_date?query=${query}
      &hitsPerPage=${hitsCuantity}`)
  },
  newHits: function (query, hitsCuantity, afterAt) {
    return rp(`http://hn.algolia.com/api/v1/search_by_date?query=${query}
      &hitsPerPage=${hitsCuantity}&numericFilters=created_at_i>${afterAt}`)
  }

}
