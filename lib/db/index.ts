import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env.mjs";

/**
 * @constant {Object} client - The PostgreSQL client initialized with the database URL.
 * @constant {Object} db - The drizzle ORM instance for database operations.
 */

const client = postgres(env.NEXT_PUBLIC_DATABASE_URL);
export const db = drizzle(client);
