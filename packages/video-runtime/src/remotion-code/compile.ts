import { transform } from "sucrase";

export function compileVideoCode(source: string): string {
  if (!source.trim()) {
    throw new Error("Video code payload is empty");
  }
  if (source.length > 25000) {
    throw new Error("Video code payload too large (limit 25k characters)");
  }

  const { code } = transform(source, {
    transforms: ["imports", "typescript", "jsx"],
    production: true,
  });

  return code;
}
