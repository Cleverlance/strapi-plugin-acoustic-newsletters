'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    beforeSave: async (model, attrs, options) => {
      // Do update call if user change signature table too
      const savedItem = global.strapi.query('newsletter', 'acoustic-newsletters')
        .find({ id: model.id })

      console.log(savedItem)

      /*
      console.log(model, attrs, options)
      const trx = attrs && attrs.transacting
      const knex = trx || global.strapi.connections.default

      const itemToDelete = await knex('items').where('id', model.id).first()

      await global.strapi.query('auditLog', 'page-hierarchy')
        .create(
          {
            type: 'ITEM',
            data_log: JSON.stringify(itemToDelete)
          },
          trx ? { transacting: trx } : undefined
        )
    }
      */
    }
  }
}
