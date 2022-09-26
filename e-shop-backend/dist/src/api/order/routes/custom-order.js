"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'POST',
            path: '/orders/confirm',
            handler: 'order.confirm',
        },
    ],
};
