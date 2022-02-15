const { Pool } = require('pg');
const { getDatabaseConfig } = require('../config');
const config = getDatabaseConfig();

const pool = new Pool({
  user: process.env.DATABASE_SUPERUSER,
  password: process.env.DATABASE_SUPERPASSWORD,
});

pool.on('error', (poolErr) => {
  console.error('Unable to login as superuser. Error: ', poolErr);
  process.exit(1);
});

pool.connect(async (connectionErr, client) => {
  if (connectionErr) {
    console.log('Unable to establish connection as superuser. Error: ', connectionErr);
    process.exit(1);
  }

  try {
    await client.query(`CREATE USER ${config.username} WITH PASSWORD '${config.password}'`);
    console.log(`User "${config.username}" created successfully.`);
    process.exit(0);
  } catch (error) {
    console.log('Unable to create user. Error: ', error);
    process.exit(1);
  }
});
