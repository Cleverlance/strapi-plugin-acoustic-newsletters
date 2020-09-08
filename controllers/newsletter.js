'use strict'

/**
 * acoustic-newsletters.js controller
 *
 * @description: A set of functions called "actions" of the `acoustic-newsletters` plugin.
 */

module.exports = {

  setIsSended: async (ctx) => {
    const body = ctx.request.body

    try {
      const res = await global.strapi.query('newsletter', 'acoustic-newsletters').update({ id: body.id }, {
        isSended: true
      })
      return res
    } catch (err) {
      console.log(err)
      throw new Error({ err: err.toString() })
    }
  },

  getAcousticNewsletterConfig: (ctx) => {
    const data = global.strapi.config.acousticNewsletters
    ctx.body = data
  },

  find: async (ctx) => {
    // TODO: add normalizer
    return global.strapi.query('newsletter', 'acoustic-newsletters').find()
  }

}
