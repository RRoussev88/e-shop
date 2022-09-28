export default ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.gmail.com'),
        port: env('SMTP_PORT', 465),
        auth: {
          user: env('GMAIL_USER'),
          pass: env('GMAIL_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: 'eshop.kunz@gmail.com',
        defaultReplyTo: 'eshop.kunz@gmail.com',
      },
    },
  },
});