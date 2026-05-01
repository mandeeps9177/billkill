import initSqlJs, { Database } from "sql.js";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "billkill.db");
const MIGRATIONS_DIR = path.join(process.cwd(), "src", "db", "migrations");

let db: Database | null = null;
let initPromise: Promise<Database> | null = null;

export async function getDb(): Promise<Database> {
  if (db) return db;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const wasmPath = path.join(process.cwd(), "node_modules", "sql.js", "dist", "sql-wasm.wasm");
    const wasmBinary = fs.readFileSync(wasmPath);
    const SQL = await initSqlJs({ wasmBinary });

    // Load existing DB file if it exists
    if (fs.existsSync(DB_PATH)) {
      const buffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(buffer);
    } else {
      db = new SQL.Database();
    }

    db.run("PRAGMA foreign_keys = ON");
    runMigrations(db);
    saveDb(db);

    return db;
  })();

  return initPromise;
}

function saveDb(db: Database) {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

// Call this after any write operation to persist changes
export function persistDb() {
  if (db) saveDb(db);
}

function runMigrations(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY,
      ran_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  const ranRows = db.exec("SELECT name FROM _migrations");
  const ran = new Set<string>();
  if (ranRows.length > 0) {
    for (const row of ranRows[0].values) {
      ran.add(row[0] as string);
    }
  }

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    if (ran.has(file)) continue;
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf-8");
    db.run(sql);
    db.run("INSERT INTO _migrations (name) VALUES (?)", [file]);
    console.log(`[db] migration applied: ${file}`);
  }
}

// Helper: run a query that returns rows as objects
export function queryAll(db: Database, sql: string, params: any[] = []): any[] {
  const stmt = db.prepare(sql);
  stmt.bind(params);

  const results: any[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

// Helper: run a query that returns a single row as object
export function queryOne(db: Database, sql: string, params: any[] = []): any | null {
  const results = queryAll(db, sql, params);
  return results.length > 0 ? results[0] : null;
}

// Helper: run an INSERT/UPDATE/DELETE and return changes info
export function execute(db: Database, sql: string, params: any[] = []): { changes: number; lastId: number } {
  db.run(sql, params);
  const changes = db.getRowsModified();
  const lastIdResult = db.exec("SELECT last_insert_rowid() as id");
  const lastId = lastIdResult.length > 0 ? (lastIdResult[0].values[0][0] as number) : 0;
  return { changes, lastId };
}
