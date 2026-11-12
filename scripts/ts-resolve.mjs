import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tries = [".ts", ".tsx", "/index.ts"];

// Resolves "@/x" to the repo root, then retries extensionless relative specifiers as TypeScript files.
export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    specifier = pathToFileURL(path.join(root, specifier.slice(2))).href;
  }
  const local = specifier.startsWith(".") || specifier.startsWith("file:");
  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    if (!local || path.extname(specifier)) throw error;
    for (const suffix of tries) {
      try {
        return await nextResolve(specifier + suffix, context);
      } catch {
        // try the next suffix
      }
    }
    throw error;
  }
}
