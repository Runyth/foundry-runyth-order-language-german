// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Runyth. See the LICENSE file for rights and obligations.
import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { createZip } from "./lib/zip.mjs";
import { isExcludedSourcePath, readJson, walk } from "./lib/files.mjs";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const manifest = await readJson(resolve(root, "module.json"));
const version = manifest.version;
const moduleId = manifest.id;
const installName = `${moduleId}-v${version}-mod.zip`;
const sourceName = `${moduleId}-v${version}-src.zip`;
const docName = `${moduleId}-v${version}-doc.zip`;
const checksumName = `${moduleId}-v${version}-SHA256SUMS.txt`;
const reportName = `${moduleId}-v${version}-build-report.json`;
const installRoot = moduleId;
const sourceRoot = `${moduleId}-v${version}-src`;
const docRoot = `${moduleId}-v${version}-doc`;

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const installFiles = (await walk(root)).filter((file) => {
  if (isExcludedSourcePath(file.path)) return false;
  return ["module.json", "README.md", "CHANGELOG.md", "LICENSE", "NOTICE.md", "lang/de.json"].includes(file.path);
});
const sourceFiles = (await walk(root)).filter((file) => {
  if (isExcludedSourcePath(file.path)) return false;
  if (file.path === ".git/config" || file.path === ".git/config.worktree" || file.path === ".git/FETCH_HEAD" || file.path === ".git/opencode") return false;
  if (file.path.startsWith(".git/logs/") || file.path.startsWith(".git/hooks/")) return false;
  return true;
});
const docFiles = sourceFiles.filter((file) => (
  ["README.md", "CHANGELOG.md", "LICENSE", "NOTICE.md", "SECURITY.md", "CONTRIBUTING.md"].includes(file.path)
  || file.path.startsWith("docs/")
));

await createZip(
  resolve(dist, installName),
  installFiles.map((file) => ({ path: file.absolute, name: `${installRoot}/${file.path}` })),
);
await createZip(
  resolve(dist, sourceName),
  sourceFiles.map((file) => ({ path: file.absolute, name: `${sourceRoot}/${file.path}` })),
);
await createZip(
  resolve(dist, docName),
  docFiles.map((file) => ({ path: file.absolute, name: `${docRoot}/${file.path}` })),
);

async function sha256(path) {
  return createHash("sha256").update(await readFile(path)).digest("hex");
}

const moduleChecksum = await sha256(resolve(root, "module.json"));
const installChecksum = await sha256(resolve(dist, installName));
const sourceChecksum = await sha256(resolve(dist, sourceName));
const docChecksum = await sha256(resolve(dist, docName));
await writeFile(
  resolve(dist, checksumName),
  `${installChecksum}  ${installName}\n${sourceChecksum}  ${sourceName}\n${docChecksum}  ${docName}\n${moduleChecksum}  module.json\n`,
);

const de = await readJson(resolve(root, "lang/de.json"));
const report = {
  schemaVersion: 1,
  moduleId,
  displayTitle: manifest.title,
  version,
  foundry: manifest.compatibility,
  target: {
    moduleId: "runyth-order",
    moduleVersion: "1.0.5",
    baseLanguage: "en",
    language: "de",
    namespace: "RO",
  },
  translationKeys: Object.keys(de).length,
  runtimeScripts: 0,
  moduleSettings: 0,
  dashboardSelectors: 0,
  migrations: 0,
  installArchive: installName,
  sourceArchive: sourceName,
  documentationArchive: docName,
  checksumFile: checksumName,
  installRoot,
  sourceRoot,
  installFiles: installFiles.length,
  sourceFiles: sourceFiles.length,
  installBytes: (await readFile(resolve(dist, installName))).length,
  sourceBytes: (await readFile(resolve(dist, sourceName))).length,
  reproducibleTimestamp: "1980-01-01T00:00:00Z",
  generatedArtifacts: [installName, sourceName, docName, checksumName, reportName],
};
await writeFile(resolve(dist, reportName), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Built ${basename(resolve(dist, installName))} (${installFiles.length} files).`);
console.log(`Built ${basename(resolve(dist, sourceName))} (${sourceFiles.length} files).`);
console.log(`Built ${basename(resolve(dist, docName))} (${docFiles.length} files).`);
