"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ env }) => [
    'strapi::errors',
    {
        name: 'strapi::security',
        config: {
            contentSecurityPolicy: {
                useDefaults: true,
                directives: {
                    'connect-src': ["'self'", 'https:'],
                    'img-src': [
                        "'self'",
                        'data:',
                        'blob:',
                        `http://${env('AWS_BUCKET_NAME')}.s3.${env('AWS_REGION')}.amazonaws.com`,
                    ],
                    'media-src': [
                        "'self'",
                        'data:',
                        'blob:',
                        `http://${env('AWS_BUCKET_NAME')}.s3.${env('AWS_REGION')}.amazonaws.com`,
                    ],
                    upgradeInsecureRequests: null,
                },
            },
        },
    },
    'strapi::cors',
    'strapi::poweredBy',
    'strapi::logger',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
    'global::TokenPlacer',
];
