import mysql, { ConnectionOptions, Pool } from 'mysql2';

const access: ConnectionOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
};

// Opens a connection to the MySQL server
const pool: Pool = mysql.createPool(access);
export default pool.promise();
