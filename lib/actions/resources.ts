"use server";

import {
  NewResourceParams,
  insertResourceSchema,
  resources,
} from "@/lib/db/schema/resources";
import { db } from "../db";
import { generateEmbeddings } from "../ai/embedding";
import { embeddings as embeddingsTable } from "../db/schema/embeddings";

/**
 * Creates a new resource and generates embeddings for it.
 *
 * @param {NewResourceParams} input - The parameters for the new resource.
 * @returns {Promise<string>} A promise that resolves to a success message or an error message.
 */

export const createResource = async (
  input: NewResourceParams
): Promise<string> => {
  try {
    const { content } = insertResourceSchema.parse(input);

    const [resource] = await db
      .insert(resources)
      .values({ content })
      .returning();

    const embeddings = await generateEmbeddings(content);
    await db.insert(embeddingsTable).values(
      embeddings.map((embedding) => ({
        resourceId: resource.id,
        ...embedding,
      }))
    );

    return "Resource successfully created and embedded.";
  } catch (e) {
    if (e instanceof Error)
      return e.message.length > 0 ? e.message : "Error, please try again.";
  }
  return "Error, please try again.";
};
