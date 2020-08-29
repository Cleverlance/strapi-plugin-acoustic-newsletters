'use strict'

/**
 * acoustic-newsletters.js controller
 *
 * @description: A set of functions called "actions" of the `acoustic-newsletters` plugin.
 */

module.exports = {

  getAcousticNewsletterConfig: (ctx) => {
    const data = global.strapi.config.acousticNewsletters
    ctx.body = data
  },
  find: async (ctx) => {
    // TODO: add normalizer
    return global.strapi.query('newsletter', 'acoustic-newsletters').find()
  }
}
