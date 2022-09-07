"use strict";
/**
 * order controller
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
const errors_1 = __importDefault(require("../../../utils/errors"));
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
}));
