const { Pool } = require("pg");
const dbConfig = require("./dbConfig");

const pool = new Pool(dbConfig);

async function dbSetup() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(30) UNIQUE NOT NULL,
        email VARCHAR(254) UNIQUE NOT NULL,
        password text NOT NULL
      );
    `);

    console.log('Database setup complete.');
  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    await pool.end();
  }
}

dbSetup();
