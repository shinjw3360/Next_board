import mysql from 'mysql2/promise';
// 자동으로 .env.local 파일을 호출해옴
// process.env.MYSQL_HOST // 호출

const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  port: Number(process.env.MYSQL_PORT),
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10
})

export default db;