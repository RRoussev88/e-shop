"use strict";
/**
 * order controller
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
const stripe_1 = __importDefault(require("stripe"));
const utils_1 = require("@strapi/utils");
const errors_1 = __importDefault(require("../../../utils/errors"));
const stripe = new stripe_1.default(process.env.STRIPE_SK, {
    apiVersion: '2022-08-01',
});
exports.default = strapi_1.factories.createCoreController('api::order.order', ({ strapi }) => ({
    async find(ctx) {
        const { user } = ctx.state;
        if (!user) {
            ctx.status = 401;
            return ctx.send(errors_1.default[401], 401);
        }
        ctx.query = { ...ctx.query, local: 'en', filters: { user: user.id } };
        // Calling the default core action
        const response = await super.find(ctx);
        return response;
    },
    async findOne(ctx) {
        const { id } = ctx.params;
        const { user } = ctx.state;
        if (!user) {
            ctx.status = 401;
            return ctx.send(errors_1.default[401], 401);
        }
        ctx.query = { ...ctx.query, local: 'en', filters: { user: user.id, id } };
        const checkData = await strapi.service('api::order.order').find(ctx.query);
        if (!(checkData === null || checkData === void 0 ? void 0 : checkData['results'].length)) {
            ctx.status = 404;
            return ctx.send(errors_1.default[404], 404);
        }
        const entity = await strapi
            .service('api::order.order')
            .findOne(id, ctx.query);
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitizedEntity);
    },
    /**
     * Creates an order and sets up Stripe Checkout session
     * @param ctx
     */
    async create(ctx) {
        const { user } = ctx.state;
        if (!user) {
            ctx.status = 401;
            return ctx.send(errors_1.default[401], 401);
        }
        const { product } = ctx.request.body;
        if (!product) {
            ctx.status = 400;
            return ctx.send({ ...errors_1.default[400], details: { message: 'Please specify a product' } }, 400);
        }
        ctx.query = {
            ...ctx.query,
            local: 'en',
            filters: { user: user.id, id: product.id },
        };
        const realProduct = await strapi
            .service('api::product.product')
            .findOne(product.id, ctx.query);
        if (!realProduct) {
            ctx.status = 404;
            return ctx.send({ ...errors_1.default[404], details: { message: 'No product with such id' } }, 404);
        }
        const BASE_URL = ctx.request.headers.origin || 'http://localhost:3000';
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
        });
        const newOrder = await strapi.service('api::order.order').create({
            data: {
                user: user.id,
                product: realProduct.id,
                total: realProduct.price,
                status: 'unpaid',
                checkout_session: session.id,
            },
        });
        return { id: newOrder.checkout_session };
    },
    /**
     * Given a checkout_session, verifies payment and update the order status
     * @param ctx
     */
    async confirm(ctx) {
        const { checkout_session } = ctx.request.body;
        const session = await stripe.checkout.sessions.retrieve(checkout_session);
        if (session.payment_status === 'paid') {
            const initialOrder = (await strapi
                .service('api::order.order')
                .find({
                fields: ['id'],
                filters: { checkout_session: { $eq: checkout_session } },
                populate: ['id'],
            }));
            if (initialOrder.results.length === 1) {
                const updateOrder = await strapi
                    .service('api::order.order')
                    .update(initialOrder.results[0].id, { data: { status: 'paid' } });
                const { auth } = ctx.state;
                const response = await utils_1.sanitize.contentAPI.output(updateOrder, strapi.getModel('api::order.order'), 
                // Not needed for unauthenticated requests
                { auth });
                return response;
            }
        }
        else {
            ctx.throw(400, "The payment wasn't successfull. Please, call support");
            ctx.status = 400;
            return ctx.send({
                ...errors_1.default[400],
                details: {
                    message: "The payment wasn't successfull. Please, call support",
                },
            }, 400);
        }
    },
}));
