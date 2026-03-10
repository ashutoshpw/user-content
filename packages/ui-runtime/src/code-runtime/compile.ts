import { transform } from "sucrase";

export function compileUiCode(source: string): string {
  if (!source.trim()) {
    throw new Error("Code payload is empty");
  }

  if (source.length > 20000) {
    throw new Error("Code payload too large (limit 20k characters)");
  }

  const { code } = transform(source, {
    transforms: ["typescript", "jsx"],
    production: true,
  });

  return code;
}
