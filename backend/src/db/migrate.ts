import path from "node:path";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, pool } from "./index.js";

async function main(): Promise<void> {
  const migrationsFolder = path.resolve(process.cwd(), "drizzle");

  try {
    await migrate(db, { migrationsFolder });
    console.log(`Migrations applied successfully from ${migrationsFolder}`);
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error("Migration failed", error);
  process.exitCode = 1;
});
