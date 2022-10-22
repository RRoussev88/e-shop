/**
 * order controller
 */

import { factories } from '@strapi/strapi'
import StripePromise from 'stripe'

import errors from '../../../utils/errors'
import { StripeAPIResponse } from '../../../utils/types'

const stripe = new StripePromise(process.env.STRIPE_SK, {
  apiVersion: '2022-08-01',
})

export default factories.createCoreController(
  'api::order.order',
  ({ strapi }) => ({
    async find(ctx) {
      const { user } = ctx.state
      console.log('user :', user)
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
    /**
     * Creates an order and sets up Stripe Checkout session
     * @param ctx
     */
    async create(ctx) {
      const { user } = ctx.state
      if (!user) {
        ctx.status = 401
        return ctx.send(errors[401], 401)
      }
      const { product } = ctx.request.body
      if (!product) {
        ctx.status = 400
        return ctx.send(
          { ...errors[400], details: { message: 'Please specify a product' } },
          400
        )
      }
      ctx.query = {
        ...ctx.query,
        local: 'en',
        filters: { user: user.id, id: product.id },
      }

      const realProduct = await strapi
        .service('api::product.product')
        .findOne(product.id, ctx.query)

      if (!realProduct) {
        ctx.status = 404
        return ctx.send(
          { ...errors[404], details: { message: 'No product with such id' } },
          404
        )
      }

      const BASE_URL = ctx.request.headers.origin || 'http://localhost:3000'

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: user.email,
        mode: 'payment',
        success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: BASE_URL,
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: { name: realProduct.name },
              unit_amount: parseFloat(realProduct.price) * 100,
            },
            quantity: 1,
          },
        ],
      })

      const newOrder = await strapi.service('api::order.order').create({
        data: {
          user: user.id,
          product: realProduct.id,
          total: realProduct.price,
          status: 'unpaid',
          checkout_session: session.id,
        },
      })

      return { id: newOrder.checkout_session }
    },
    /**
     * Given a checkout_session, verifies payment and update the order status
     * @param ctx
     */
    async confirm(ctx) {
      const { checkout_session } = ctx.request.body
      const session = await stripe.checkout.sessions.retrieve(checkout_session)
      if (session.payment_status === 'paid') {
        const initialOrder: StripeAPIResponse = (await strapi
          .service('api::order.order')
          .find({
            fields: ['id'],
            filters: { checkout_session: { $eq: checkout_session } },
            populate: ['id'],
          })) as StripeAPIResponse

        if (initialOrder.results.length === 1) {
          const updateOrder = await strapi
            .service('api::order.order')
            .update(initialOrder.results[0].id, { data: { status: 'paid' } })

          const sanitizedEntity = await this.sanitizeOutput(updateOrder, ctx)
          return this.transformResponse(sanitizedEntity)
        }
      } else {
        ctx.throw(400, "The payment wasn't successfull. Please, call support")

        ctx.status = 400
        return ctx.send(
          {
            ...errors[400],
            details: {
              message: "The payment wasn't successfull. Please, call support",
            },
          },
          400
        )
      }
    },
  })
)
