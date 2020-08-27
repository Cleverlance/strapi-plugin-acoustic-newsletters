'use strict'

/**
 * acoustic-newsletters.js controller
 *
 * @description: A set of functions called "actions" of the `acoustic-newsletters` plugin.
 */

module.exports = {

  find: async (ctx) => {
    // TODO: add normalizer
    return global.strapi.query('newsletter', 'acoustic-newsletters').find()
  }
}
