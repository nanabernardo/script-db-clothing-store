import sqlite3 from "sqlite3";
import { open } from "sqlite";

//conexão com SQLite
const db = await open({
  filename: "./store.db",
  driver: sqlite3.Database,
});

//cria tabela se não existir
await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL
    )`);

export default db;
