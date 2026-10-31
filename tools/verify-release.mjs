import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { listZip } from "./lib/zip.mjs";
import { readJson } from "./lib/files.mjs";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const manifest = await readJson(resolve(root, "module.json"));
const report = await readJson(resolve(dist, `${manifest.id}-v${manifest.version}-build-report.json`));
const installPath = resolve(dist, report.installArchive);
const sourcePath = resolve(dist, report.sourceArchive);
const docPath = resolve(dist, report.documentationArchive);
const installEntries = await listZip(installPath);
const sourceEntries = await listZip(sourcePath);
const failures = [];

if (report.target?.moduleId !== "runyth-order" || report.target?.moduleVersion !== "1.0.5") failures.push("Build report target is invalid.");
if (report.target?.language !== "de" || report.target?.baseLanguage !== "en" || report.target?.namespace !== "RO") failures.push("Build report language contract is invalid.");
if (report.runtimeScripts !== 0 || report.moduleSettings !== 0 || report.dashboardSelectors !== 0 || report.migrations !== 0) failures.push("Build report does not describe a data-only pack.");
if (!installEntries.length || !sourceEntries.length) failures.push("A release archive is empty.");
if (installEntries.some((entry) => !entry.startsWith(`${report.installRoot}/`))) failures.push("Install archive root is invalid.");
if (sourceEntries.some((entry) => !entry.startsWith(`${report.sourceRoot}/`))) failures.push("Source archive root is invalid.");
for (const required of ["module.json", "lang/de.json", "README.md", "CHANGELOG.md", "LICENSE", "NOTICE.md"]) {
  if (!installEntries.includes(`${report.installRoot}/${required}`)) failures.push(`Install archive is missing ${required}.`);
}
for (const forbidden of ["/reference/", "/test/", "/tools/", "/docs/", "/package.json", "/package-lock.json", "/.github/"]) {
  if (installEntries.some((entry) => entry.includes(forbidden))) failures.push(`Install archive contains source-only path ${forbidden}.`);
}
if (!sourceEntries.includes(`${report.sourceRoot}/reference/runyth-order-en-v1.0.5.json`)) failures.push("Source archive lacks the English validation reference.");
if (!sourceEntries.includes(`${report.sourceRoot}/tools/build.mjs`)) failures.push("Source archive is not reproducible.");
for (const forbidden of ["node_modules/", "dist/"]) {
  if (sourceEntries.some((entry) => entry.includes(`/${forbidden}`))) failures.push(`Source archive includes ${forbidden}.`);
}
if (!sourceEntries.includes(`${report.sourceRoot}/.git/HEAD`)) failures.push("Source archive must include complete Git history.");

const checksums = new Map(
  (await readFile(resolve(dist, report.checksumFile), "utf8"))
    .trim()
    .split("\n")
    .map((line) => {
      const [hash, name] = line.trim().split(/\s{2,}/u);
      return [name, hash];
    }),
);
async function digest(path) {
  return createHash("sha256").update(await readFile(path)).digest("hex");
}
if ((await digest(installPath)) !== checksums.get(report.installArchive)) failures.push("Install checksum mismatch.");
if ((await digest(sourcePath)) !== checksums.get(report.sourceArchive)) failures.push("Source checksum mismatch.");
if ((await digest(docPath)) !== checksums.get(report.documentationArchive)) failures.push("Documentation checksum mismatch.");

const firstInstall = await readFile(installPath);
const firstSource = await readFile(sourcePath);
const firstDoc = await readFile(docPath);
const result = spawnSync(process.execPath, [resolve(root, "tools/build.mjs")], { cwd: root, encoding: "utf8" });
if (result.status !== 0) failures.push(`Repeated build failed: ${result.stderr}`);
else {
  if (!firstInstall.equals(await readFile(installPath))) failures.push("Install archive is not byte-reproducible.");
  if (!firstSource.equals(await readFile(sourcePath))) failures.push("Source archive is not byte-reproducible.");
  if (!firstDoc.equals(await readFile(docPath))) failures.push("Documentation archive is not byte-reproducible.");
}

if (failures.length) {
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`Release verification passed: ${installEntries.length} install files, ${sourceEntries.length} source files, byte-identical rebuild.`);
}
