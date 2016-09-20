const request = require('request-promise')
const baseUrl = 'http://hn.algolia.com/api/v1'
const HITS_PER_PAGE = 1000

/**
* @description :: Server-side logic for managing hn request.
*/
module.exports = {

  /**
 * @method initHits
 * @description make a request to Hacker News API that returns the latest 1000
 * hits with 'nodejs' as query param
 * @author Andres Barradas
 */
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

  /**
 * @method newHits
 * @description make a request to Hacker News API that returns the latest hits
 * starting from a 'created_at_i' parameter  
 * @author Andres Barradas
 */
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
