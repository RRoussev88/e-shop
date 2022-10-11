export default ({ env }) => {
  const imgAndMediaDirectives = [
    "'self'",
    'data:',
    'blob:',
    'dl.airtable.com',
    `http://${env('AWS_BUCKET_NAME')}.s3.${env('AWS_REGION')}.amazonaws.com`,
  ]

  return [
    'strapi::errors',
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            'connect-src': ["'self'", 'http:', 'https:'],
            'img-src': imgAndMediaDirectives,
            'media-src': imgAndMediaDirectives,
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
  ]
}
