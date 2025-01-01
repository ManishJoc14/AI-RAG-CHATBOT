/* ------------------------- To create an embedding, ------------------------ */
// 1. We will start with a piece of source material (unknown length)
// 2. Break it down into smaller chunks
// 3. Embed each chunk
// 4. Save the chunk to the database.

import { openai } from "@ai-sdk/openai";
import { embed, embedMany } from "ai";
const embeddingModel = openai.embedding("text-embedding-ada-002");
import { db } from "../db";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { embeddings } from "../db/schema/embeddings";

/**
 * Generates embeddings for the given input string.
 *
 * @param {string} value - The input string to generate embeddings for.
 * @returns {Promise<{embedding:number[], content:string}[]>}
 *   A promise that resolves to an array of objects, each containing:
 *   - `embedding`: An array of numbers representing the embedding like e = [0.1, 0.4, 0.2].
 *   - `content`: The corresponding chunk of the input string.
 */

export const generateEmbeddings = async (
  value: string
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = value
    .trim()
    .split(".")
    .filter((sentence) => sentence !== "");

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });

  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

// generate a single embedding from an input string
export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\\n", " ");
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

// embeds the user’s query, searches the database for similar items, 
// then returns relevant items
export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded
  )})`;
  const similarGuides = await db
    .select({ name: embeddings.content, similarity })
    .from(embeddings)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(4);
  return similarGuides;
};
