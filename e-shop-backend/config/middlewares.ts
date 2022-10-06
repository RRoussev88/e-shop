export default ({ env }) => [
  'strapi::errors',
  'strapi::security',
  // {
  //   name: 'strapi::security',
  //   config: {
  //     contentSecurityPolicy: {
  //       useDefaults: true,
  //       directives: {
  //         'connect-src': ["'self'", 'https:'],
  //         'img-src': [
  //           "'self'",
  //           'data:',
  //           'blob:',
  //           `${env('AWS_BUCKET_NAME')}.s3.${env(
  //             'AWS_REGION'
  //           )}.amazonaws.com`,
  //         ],
  //         'media-src': [
  //           "'self'",
  //           'data:',
  //           'blob:',
  //           `http://${env('AWS_BUCKET_NAME')}.s3.${env(
  //             'AWS_REGION'
  //           )}.amazonaws.com`,
  //         ],
  //         upgradeInsecureRequests: null,
  //       },
  //     },
  //   },
  // },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  'global::TokenPlacer',
]
