const base = {
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  dialect: 'postgres',
  define: { underscored: true },
};

module.exports = {
  development: { ...base, database: process.env.DB_NAME || 'equipment_tickets' },
  test: { ...base, database: process.env.DB_NAME_TEST || `${process.env.DB_NAME || 'equipment_tickets'}_test` },
  production: { ...base, database: process.env.DB_NAME },
};
