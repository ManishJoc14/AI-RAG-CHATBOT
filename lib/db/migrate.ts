import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./index";

/**
 * Runs database migrations using drizzle-orm and postgres-js
 * located in the `lib/db/migrations` folder.
 * using the command :- pnpm db:migrate
 */

const runMigrate = async () => {
  console.log("⏳ Running migrations...");
  const start = Date.now();

  await migrate(db, { migrationsFolder: "lib/db/migrations" });
  const end = Date.now();

  console.log("✅ Migrations completed in", end - start, "ms");
  process.exit(0);
};

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});
