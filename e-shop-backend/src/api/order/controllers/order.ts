/**
 * order controller
 */

import { factories } from '@strapi/strapi'

import errors from '../../../utils/errors'

export default factories.createCoreController(
  'api::order.order',
  ({ strapi }) => ({
    async find(ctx) {
      const { user } = ctx.state
      if (!user) {
        ctx.status = 401
        return ctx.send(errors[401], 401)
      }

      ctx.query = { ...ctx.query, local: 'en', filters: { user: user.id } }

      // Calling the default core action
      const response = await super.find(ctx)

      return response
    },
    async findOne(ctx) {
      const { id } = ctx.params
      const { user } = ctx.state
      if (!user) {
        ctx.status = 401
        return ctx.send(errors[401], 401)
      }
      ctx.query = { ...ctx.query, local: 'en', filters: { user: user.id, id } }

      const checkData = await strapi.service('api::order.order').find(ctx.query)
      if (!checkData?.['results'].length) {
        ctx.status = 404
        return ctx.send(errors[404], 404)
      }

      const entity = await strapi
        .service('api::order.order')
        .findOne(id, ctx.query)
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx)

      return this.transformResponse(sanitizedEntity)
    },
  })
)
