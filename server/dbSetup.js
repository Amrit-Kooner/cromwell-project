const { Pool } = require("pg");
const dbConfig = require("./dbConfig");

const pool1 = new Pool({ ...dbConfig, database: "postgres" });
const pool2 = new Pool(dbConfig);

async function createDatabse() {
  const createDBquery = `CREATE DATABASE ${dbConfig.database};`

  const createTableQuery = `
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(30) UNIQUE NOT NULL,
      email VARCHAR(254) UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `;

  try{
    await pool1.query(createDBquery);
    console.log("database created")
  } catch(err){
    console.log(err)
  }


  try {
    await pool2.query(createTableQuery);
    console.log("table created");
  } catch (err) {
    console.log(err);
  }
}

createDatabse();


