"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cookies_1 = require("../utils/cookies");
exports.default = () => {
    return async (ctx, next) => {
        var _a, _b;
        const cookies = ctx.request.header.cookie || false;
        if (cookies) {
            const token = (_b = (_a = cookies
                .split(';')
                .find((cookie) => cookie.trim().startsWith(`${cookies_1.cookieNames.userSession}=`))) === null || _a === void 0 ? void 0 : _a.split('=')) === null || _b === void 0 ? void 0 : _b[1];
            if (token) {
                ctx.request.header.authorization = `Bearer ${token}`;
            }
        }
        await next();
        const cookieOptions = {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24 * 30,
            domain: process.env.NODE_ENV === 'development'
                ? 'localhost'
                : process.env.PRODUCTION_URL,
        };
        // For login and register paths
        if (['/api/auth/local', '/api/auth/local/register'].includes(ctx.request.path)) {
            const { jwt, ...rest } = ctx.response.body;
            // Remove the issued JWT from the response body
            ctx.response.body = { ...rest };
            // Put the JWT in a httpOnly cookie
            ctx.cookies.set(cookies_1.cookieNames.userSession, jwt, cookieOptions);
        }
        // For logout path
        if (ctx.request.path === '/api/auth/logout') {
            // Delete the session httpOnly cookie
            ctx.cookies.set(cookies_1.cookieNames.userSession, null, cookieOptions);
            return ctx.send({ message: 'Logout success' }, 200);
        }
    };
};
