import { defineConfig } from "vitest/config";

// Run the suite once per available Temporal implementation. The polyfill always
// runs; the native project is added only when the runtime exposes `Temporal`
// (Node >= 26), so it never silently falls back and reports a false "native"
// pass on older runtimes. `TIEMPO_TEMPORAL` is read by src/shared/temporal.ts.
const hasNative = "Temporal" in globalThis;

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "polyfill",
          env: { TIEMPO_TEMPORAL: "polyfill" },
        },
      },
      ...(hasNative
        ? [
            {
              test: {
                name: "native",
                env: { TIEMPO_TEMPORAL: "native" },
              },
            },
          ]
        : []),
    ],
  },
});
