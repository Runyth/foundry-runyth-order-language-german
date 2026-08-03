import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readJson(relativePath) {
  return JSON.parse(await readFile(new URL(relativePath, import.meta.url), "utf8"));
}

function placeholders(value) {
  return [...value.matchAll(/\{([A-Za-z][A-Za-z0-9]*)\}/gu)].map((match) => match[1]).sort();
}

test("manifest is a script-free German Foundry language pack", async () => {
  const manifest = await readJson("../module.json");
  assert.equal(manifest.id, "runyth-order-language-german");
  assert.equal(manifest.title, "Runyth Order: Language German");
  assert.equal(manifest.version, "1.0.0");
  assert.deepEqual(manifest.languages, [
    {
      lang: "de",
      name: "Deutsch — Runyth Order",
      path: "lang/de.json",
    },
  ]);
  assert.equal(manifest.esmodules, undefined);
  assert.equal(manifest.scripts, undefined);
  assert.equal(manifest.styles, undefined);
});

test("manifest depends exactly on Runyth Order 1.0.4", async () => {
  const manifest = await readJson("../module.json");
  const dependency = manifest.relationships.requires.find((entry) => entry.id === "runyth-order");
  assert.ok(dependency);
  assert.deepEqual(dependency.compatibility, {
    minimum: "1.0.4",
    verified: "1.0.4",
    maximum: "1.0.4",
  });
});

test("naming and localization metadata are canonical", async () => {
  const manifest = await readJson("../module.json");
  const runyth = manifest.flags.runyth;
  assert.equal(runyth.canonicalTitle, manifest.title);
  assert.equal(runyth.moduleKind, "Language");
  assert.equal(runyth.contentName, "German");
  assert.deepEqual(runyth.localization, {
    schemaVersion: 1,
    targetModuleId: "runyth-order",
    targetModuleVersion: "1.0.4",
    baseLanguage: "en",
    language: "de",
    namespace: "RO",
  });
});

test("German keys and interpolation placeholders exactly match English", async () => {
  const en = await readJson("../reference/runyth-order-en-v1.0.4.json");
  const de = await readJson("../lang/de.json");
  assert.deepEqual(Object.keys(de).sort(), Object.keys(en).sort());
  for (const key of Object.keys(en)) {
    assert.match(key, /^RO\./u);
    assert.equal(typeof de[key], "string");
    assert.notEqual(de[key].trim(), "");
    assert.deepEqual(placeholders(de[key]), placeholders(en[key]), `Placeholder mismatch for ${key}`);
  }
});
