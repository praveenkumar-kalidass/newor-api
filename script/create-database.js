const { Pool } = require('pg');

const { getDatabaseConfig } = require('../config');

const config = getDatabaseConfig();

const pool = new Pool({
  user: process.env.DATABASE_SUPERUSER,
  password: process.env.DATABASE_SUPERPASSWORD,
  host: process.env.DATABASE_HOST,
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
    const result = await client.query(`SELECT datname FROM pg_database WHERE datname='${config.database}'`);
    if (result.rows.length) {
      console.log(`Database "${config.database}" already exists. Skipping database creation.`);
      process.exit(0);
    }
    await client.query(`CREATE DATABASE ${config.database}`);
    await client.query(`GRANT ALL PRIVILEGES ON DATABASE "${config.database}" to ${config.username}`);
    console.log(`Database "${config.database}" created and assigned user ${config.username} successfully.`);
    process.exit(0);
  } catch (error) {
    console.log('Unable to create database and assign user. Error: ', error);
    process.exit(1);
  }
});
