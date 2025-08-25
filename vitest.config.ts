import { defineConfig } from "vitest/config";

const config = defineConfig({
  test: {
    coverage: {
      provider: "v8",
      include: ["src"],
      exclude: ["src/**/index.ts"],
    },
  },
});

export default config;
