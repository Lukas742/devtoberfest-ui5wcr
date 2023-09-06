import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";

export function readMovieReviewForId(id) {
  return JSON.parse(
    readFileSync(
      fileURLToPath(new URL(`./reviews/${id}.json`, import.meta.url)),
    ).toString(),
  );
}
