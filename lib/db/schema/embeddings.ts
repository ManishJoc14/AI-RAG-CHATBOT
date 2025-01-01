import { generateId } from "ai";
import { index, pgTable, text, varchar, vector } from "drizzle-orm/pg-core";
import { resources } from "./resources";

// Remember, each resource (source material) will have to be chunked, embedded,
// and then stored. So, Let’s create a table called embeddings to store these chunks.

export const embeddings = pgTable(
  "embeddings",
  {
    // unique identifier
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => generateId()),

    // a foreign key relation to the resource
    resourceId: varchar("resource_id", { length: 191 }).references(
      () => resources.id,
      { onDelete: "cascade" }
    ),

    // the plain text chunk
    content: text("content").notNull(),

    // the vector representation of the plain text chunk
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
  },
  (table) => ({
    // To perform similarity search, we also need to include an index (HNSW or IVFFlat)
    // on this column for better performance.
    embeddingIndex: index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  })
);
