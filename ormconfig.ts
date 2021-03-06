module.exports = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: ["dist/**/*.entity{.ts,.js}"],
  synchronize: true
}
