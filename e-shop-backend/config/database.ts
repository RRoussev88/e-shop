export default ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'e-shop-db'),
      user: env('DATABASE_USERNAME', 'e-shop-user'),
      password: env('DATABASE_PASSWORD', 'e-shop-pass'),
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
});
