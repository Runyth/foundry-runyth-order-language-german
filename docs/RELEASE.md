# Release process

```text
npm ci --ignore-scripts
npm run check
```

The build creates deterministic install and source ZIPs, a checksum file, and a machine-readable build report. Run the same gate after extracting the source ZIP into a clean directory and compare rebuilt archives byte-for-byte.

Publish from `master`. The release tag is `v<version>`.
