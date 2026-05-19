# Type Safety Guidelines

Daycam is plain JavaScript, not TypeScript. Maintain type discipline through
clear data shapes, defaults, and runtime checks.

## Data Shape Rules

- Keep settings objects compatible with `DEFAULT_SETTINGS`.
- Normalize or default missing metadata fields before use.
- Check for `null` directory handles, missing files, unavailable camera devices,
  and failed pose detections.
- Keep numeric capture dimensions and watermark sizes explicit; do not infer
  output sizes from rendered CSS dimensions.

## When Adding Complex Shapes

- Put shape-defining constants near the top of `src/app.js`.
- Use descriptive property names that match existing settings groups.
- Add small helper functions for normalization when a shape is read from
  persisted metadata.
