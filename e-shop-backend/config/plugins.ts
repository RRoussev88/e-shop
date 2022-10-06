export default ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.gmail.com'),
        port: env('SMTP_PORT', 465),
        auth: { user: env('GMAIL_USER'), pass: env('GMAIL_PASSWORD') },
      },
      settings: {
        defaultFrom: 'eshop.kunz@gmail.com',
        defaultReplyTo: 'eshop.kunz@gmail.com',
      },
    },
  },
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env('AWS_ACCESS_SECRET'),
        region: env('AWS_REGION'),
        params: { Bucket: env('AWS_BUCKET_NAME') },
      },
      actionOptions: { upload: { ACL: null }, uploadStream: { ACL: null } },
    },
  },
})
