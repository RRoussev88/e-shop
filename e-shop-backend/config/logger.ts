import { winston, formats } from '@strapi/logger'

export default {
  transports: [
    new winston.transports.Console({
      level: 'silly',
      format: winston.format.combine(
        formats.levelFilter('silly'),
        formats.prettyPrint({ timestamps: 'YYYY-MM-DD hh:mm:ss.SSS' })
      ),
    }),
  ],
}
