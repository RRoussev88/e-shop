"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    return async (ctx, next) => {
        var _a, _b;
        const cookies = ctx.request.header.cookie || false;
        if (cookies) {
            const token = (_b = (_a = cookies
                .split(';')
                .find((cookie) => cookie.trim().startsWith('userSession='))) === null || _a === void 0 ? void 0 : _a.split('=')) === null || _b === void 0 ? void 0 : _b[1];
            if (token) {
                ctx.request.header.authorization = `Bearer ${token}`;
            }
        }
        await next();
        // For login path
        if (ctx.request.path === '/api/auth/local') {
            const { jwt, ...rest } = ctx.response.body;
            // Remove the issued JWT from the response body
            ctx.response.body = { ...rest };
            // Put the JWT in a httpOnly cookie
            ctx.cookies.set('userSession', jwt, {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24 * 14,
                domain: process.env.NODE_ENV === 'development'
                    ? 'localhost'
                    : process.env.PRODUCTION_URL,
            });
        }
    };
};
