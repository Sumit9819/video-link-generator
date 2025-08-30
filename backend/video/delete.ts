import { api, APIError } from "encore.dev/api";
import { videoDB } from "./db";

// Deletes a video by ID.
export const deleteVideo = api<{ id: string }, void>(
  { expose: true, method: "DELETE", path: "/videos/:id" },
  async ({ id }) => {
    const result = await videoDB.queryRow`
      SELECT id FROM videos WHERE id = ${id}
    `;

    if (!result) {
      throw APIError.notFound("video not found");
    }

    await videoDB.exec`
      DELETE FROM videos WHERE id = ${id}
    `;
  }
);
