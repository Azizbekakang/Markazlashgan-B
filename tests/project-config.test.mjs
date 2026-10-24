import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("package defines production verification scripts", async () => {
  const pkg = JSON.parse(await read("../package.json"));
  assert.match(pkg.engines.node, />=20/);
  assert.ok(pkg.scripts.typecheck);
  assert.ok(pkg.scripts.build);
  assert.equal(pkg.scripts.test, "node --test tests/*.test.mjs");
});

test("Netlify publishes Vite output and declares security headers", async () => {
  const config = await read("../netlify.toml");
  assert.match(config, /publish = "dist"/);
  assert.match(config, /functions = "netlify\/functions"/);
  assert.match(config, /Content-Security-Policy/);
  assert.match(config, /X-Content-Type-Options = "nosniff"/);
  assert.match(config, /from = "\/api\/\*"/);
});

test("read-only API exposes documented health and subject routes", async () => {
  const api = await read("../netlify/functions/api.ts");
  assert.match(api, /event\.httpMethod !== "GET"/);
  assert.match(api, /path === "\/health"/);
  assert.match(api, /path === "\/subjects"/);
  assert.match(api, /statusCode: 404/);
});

test("database migration enables row-level security and owner-scoped policies", async () => {
  const migration = await read("../supabase/migrations/20261024000000_initial_schema.sql");
  assert.match(migration, /enable row level security/i);
  assert.match(migration, /auth\.uid\(\)/);
  assert.match(migration, /quiz_attempts_insert_own/);
  assert.match(migration, /lesson_progress_insert_own/);
  assert.doesNotMatch(migration, /using\s*\(\s*true\s*\)/i);
});
