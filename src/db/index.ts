import path from "path";
import fs from "fs";

const MIGRATIONS_DIR = path.join(process.cwd(), "src", "db", "migrations");

let client: any = null;

export async function getDb() {
  if (client) return client;

  if (process.env.TURSO_DATABASE_URL) {
    const { createClient } = await import("@libsql/client");
    client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  } else {
    const initSqlJs = (await import("sql.js")).default;
    const dbPath = path.join(process.cwd(), "billkill.db");
    const wasmPath = path.join(process.cwd(), "node_modules", "sql.js", "dist", "sql-wasm.wasm");
    const wasmBinary = fs.readFileSync(wasmPath);
    const SQL = await initSqlJs({ wasmBinary });

    const sqlDb = fs.existsSync(dbPath)
      ? new SQL.Database(fs.readFileSync(dbPath))
      : new SQL.Database();

    client = {
      execute: async (args: any) => {
        const sql = typeof args === "string" ? args : args.sql;
        const params = typeof args === "string" ? [] : (args.args || []);
        sqlDb.run(sql, params);
        const changes = sqlDb.getRowsModified();
        const lastId = sqlDb.exec("SELECT last_insert_rowid() as id");
        const id = lastId.length > 0 ? lastId[0].values[0][0] : 0;
        fs.writeFileSync(dbPath, Buffer.from(sqlDb.export()));
        return { rowsAffected: changes, lastInsertRowid: id, rows: [] };
      },
      _isSqlJs: true,
    };
  }

  await runMigrations();
  return client;
}

async function runMigrations() {
  await execute("CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, ran_at TEXT NOT NULL DEFAULT (datetime('now')))");
  const rows = await queryAll("SELECT name FROM _migrations");
  const ran = new Set(rows.map((r: any) => r.name));
  const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith(".sql")).sort();
  for (const file of files) {
    if (ran.has(file)) continue;
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf-8");
    for (const stmt of sql.split(";").map(s => s.trim()).filter(Boolean)) {
      await execute(stmt);
    }
    await execute("INSERT INTO _migrations (name) VALUES (?)", [file]);
    console.log(`[db] migration applied: ${file}`);
  }
}

export async function queryAll(sql: string, params: any[] = []): Promise<any[]> {
  const db = await getDb();
  if (db._isSqlJs) {
    const initSqlJs = (await import("sql.js")).default;
    const dbPath = path.join(process.cwd(), "billkill.db");
    const wasmPath = path.join(process.cwd(), "node_modules", "sql.js", "dist", "sql-wasm.wasm");
    const wasmBinary = fs.readFileSync(wasmPath);
    const SQL = await initSqlJs({ wasmBinary });
    const sqlDb = new SQL.Database(fs.readFileSync(dbPath));
    const stmt = sqlDb.prepare(sql);
    stmt.bind(params);
    const results: any[] = [];
    while (stmt.step()) results.push(stmt.getAsObject());
    stmt.free();
    sqlDb.close();
    return results;
  }
  const result = await db.execute({ sql, args: params });
  return result.rows as any[];
}

export async function queryOne(sql: string, params: any[] = []): Promise<any | null> {
  const rows = await queryAll(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export async function execute(sql: string, params: any[] = []): Promise<{ changes: number; lastId: number }> {
  const db = await getDb();
  const result = await db.execute({ sql, args: params });
  return { changes: result.rowsAffected, lastId: Number(result.lastInsertRowid || 0) };
}

export function persistDb() {}
