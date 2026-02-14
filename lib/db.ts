import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Fairuz07", // isi password mysql kamu kalau ada
  database: "kasirpos_db",
});
