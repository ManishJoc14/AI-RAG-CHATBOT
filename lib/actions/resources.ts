"use server";

import {
  NewResourceParams,
  insertResourceSchema,
  resources,
} from "@/lib/db/schema/resources";
import { db } from "../db";

/**
 * Creates a new resource in the database.
 *
 * @param {NewResourceParams} input - The parameters for the new resource.
 * @returns {Promise<string>} A promise that resolves to a success message or an error message.
 * @throws {Error} If there is an issue with the database operation or input validation.
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

    return "Resource successfully created.";
  } catch (e) {
    if (e instanceof Error)
      return e.message.length > 0 ? e.message : "Error, please try again.";
  }
  return "Error, please try again.";
};
