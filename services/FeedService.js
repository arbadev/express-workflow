const request = require('request-promise')
const baseUrl = 'http://hn.algolia.com/api/v1'
const HITS_PER_PAGE = 1000

/**
* @description :: Server-side logic for managing hn request.
*/
module.exports = {
  initHits: (query = 'nodejs', hitsPerPage = HITS_PER_PAGE) => {
    // Request options
    const opts = {
      uri: `${baseUrl}/search_by_date`,
      qs: { query, hitsPerPage },
      method: 'GET',
      json: true
    }
    return request(opts)
  },
  newHits: ( afterAt, query = 'nodejs', hitsPerPage = HITS_PER_PAGE ) => {
    const numericFilters = `created_at_i>${afterAt}`
    // Request options
    const opts = {
      uri: `${baseUrl}/search_by_date`,
      qs: { query, hitsPerPage, numericFilters },
      method: 'GET',
      json: true
    }
    return request(opts)
  }

}
