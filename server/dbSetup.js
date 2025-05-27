const { Pool } = require("pg");
const dbConfig = require("./dbConfig");

// 
async function createDB(){
  const pool1 = new Pool({ ...dbConfig, database: "postgres" });
  
  const createDBquery = `CREATE DATABASE ${dbConfig.database};`

  try{
    await pool1.query(createDBquery);
    console.log("database created")
  } catch(err){
    console.log(err)
  }

  await pool1.end()
}

// 
async function addTables(){
  const pool2 = new Pool(dbConfig);

  const createTableQuery = `
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(30) UNIQUE NOT NULL,
      email VARCHAR(254) UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `;

    try {
    await pool2.query(createTableQuery);
    console.log("table created");
  } catch (err) {
    console.log(err);
  }

  await pool2.end();
}


// 
async function establishDB() {
  await createDB();
  await addTables();
}

establishDB();


