import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/tailwind-preset.ts",
    "src/nativewind-preset.ts",
  ],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  splitting: false,
});
