# Release process

```text
npm ci --ignore-scripts
npm run check
```

The build creates three deterministic archives: `<module-id>-v<version>-mod.zip`, `-src.zip`, and `-doc.zip`, plus a checksum file and a machine-readable build report. The install archive's top-level directory remains the module ID. Run the same gate after extracting the source archive into a clean directory and compare rebuilt archives byte-for-byte.

Publish from `master`. The release tag is `v<version>`.
