import { access, readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { readJson, walk } from "./lib/files.mjs";

const root = resolve(import.meta.dirname, "..");
const failures = [];
const requiredFiles = [
  "module.json",
  "README.md",
  "CHANGELOG.md",
  "LICENSE",
  "NOTICE.md",
  "SECURITY.md",
  "CONTRIBUTING.md",
  "lang/de.json",
  "reference/runyth-order-en-v1.0.5.json",
  "docs/ARCHITECTURE.md",
  "docs/TRANSLATION_GUIDE.md",
  "docs/COMPATIBILITY.md",
  "docs/MANUAL_TEST_CHECKLIST.md",
  "docs/RELEASE.md",
  "test/localization.test.mjs",
  "tools/build.mjs",
  "tools/format.mjs",
  "tools/validate.mjs",
  "tools/verify-release.mjs",
];

for (const path of requiredFiles) {
  try {
    await access(resolve(root, path));
  } catch {
    failures.push(`Missing required file: ${path}`);
  }
}

const manifest = await readJson(resolve(root, "module.json"));
const packageJson = await readJson(resolve(root, "package.json"));
if (manifest.id !== "runyth-order-language-german") failures.push("Manifest ID is invalid.");
if (manifest.title !== "Runyth Order: Language German") failures.push("Manifest title is invalid.");
if (manifest.version !== "1.0.1" || packageJson.version !== "1.0.1") failures.push("Version must be 1.0.1.");
if (manifest.compatibility?.minimum !== "13.341" || manifest.compatibility?.verified !== "13.351" || manifest.compatibility?.maximum !== "13.351") {
  failures.push("Foundry compatibility range is invalid.");
}
if (JSON.stringify(manifest.languages) !== JSON.stringify([{ lang: "de", name: "Deutsch — Runyth Order", path: "lang/de.json" }])) {
  failures.push("Manifest must declare exactly the German dictionary.");
}
for (const prohibited of ["esmodules", "scripts", "styles", "packs"]) {
  if (manifest[prohibited] !== undefined) failures.push(`Translation-only manifest must not declare ${prohibited}.`);
}
const dependency = manifest.relationships?.requires?.find((entry) => entry.id === "runyth-order");
if (!dependency || dependency.type !== "module") failures.push("Runyth Order dependency is missing.");
if (dependency?.compatibility?.minimum !== "1.0.4" || dependency?.compatibility?.verified !== "1.0.5" || dependency?.compatibility?.maximum !== "1.0.99") {
  failures.push("Runyth Order dependency must support 1.0.4 through 1.0.99 and verify 1.0.5.");
}
const runyth = manifest.flags?.runyth;
if (runyth?.canonicalTitle !== manifest.title || runyth?.moduleKind !== "Language" || runyth?.contentName !== "German") {
  failures.push("Runyth naming metadata is invalid.");
}
const localization = runyth?.localization;
if (
  localization?.schemaVersion !== 1 ||
  localization?.targetModuleId !== "runyth-order" ||
  localization?.targetModuleVersion !== "1.0.5" ||
  localization?.baseLanguage !== "en" ||
  localization?.language !== "de" ||
  localization?.namespace !== "RO"
) {
  failures.push("Localization metadata is invalid.");
}

for (const entry of manifest.languages ?? []) {
  try {
    await access(resolve(root, entry.path));
  } catch {
    failures.push(`Manifest language path does not exist: ${entry.path}`);
  }
}

for (const file of (await walk(root)).filter((entry) => extname(entry.path) === ".json" && !entry.path.startsWith("dist/"))) {
  try {
    JSON.parse(await readFile(file.absolute, "utf8"));
  } catch (error) {
    failures.push(`${file.path}: invalid JSON: ${error.message}`);
  }
}

const en = await readJson(resolve(root, "reference/runyth-order-en-v1.0.5.json"));
const de = await readJson(resolve(root, "lang/de.json"));
const enKeys = Object.keys(en).sort();
const deKeys = Object.keys(de).sort();
if (JSON.stringify(enKeys) !== JSON.stringify(deKeys)) failures.push("German and English localization keys differ.");
function placeholders(value) {
  return [...value.matchAll(/\{([A-Za-z][A-Za-z0-9]*)\}/gu)].map((match) => match[1]).sort();
}
for (const key of enKeys) {
  if (!key.startsWith("RO.")) failures.push(`Unexpected localization namespace: ${key}`);
  if (typeof de[key] !== "string" || !de[key].trim()) failures.push(`Missing German translation: ${key}`);
  if (JSON.stringify(placeholders(en[key])) !== JSON.stringify(placeholders(de[key]))) {
    failures.push(`Interpolation placeholders differ: ${key}`);
  }
}

const allPaths = (await walk(root)).map((entry) => entry.path);
if (allPaths.some((path) => path.startsWith("src/") || path.startsWith("templates/") || path.startsWith("styles/"))) {
  failures.push("Translation-only source must not contain runtime source, templates, or styles.");
}
const quality = await readFile(resolve(root, ".github/workflows/quality.yml"), "utf8");
if (!quality.includes("- master") || quality.includes("- main")) failures.push("Quality workflow must target master only.");

if (failures.length) {
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`Validation passed: ${requiredFiles.length} required files and ${deKeys.length} German localization keys.`);
}
