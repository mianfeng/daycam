# Runtime and Browser

Daycam must run from localhost.

## Local Server

Use:

```bat
conda run -n video python tools\serve_utf8.py 5173
```

Then open `http://localhost:5173`.

Do not validate behavior by double-clicking `index.html`; `file://` can block
camera access, directory access, or script/module loading.

## Browser Support

- Target Chrome and Edge.
- Firefox and Safari are not primary targets because Daycam depends on complete
  File System Access API directory read/write behavior.

## Assets

- Keep MediaPipe local. Do not replace local assets with CDN URLs.
- If assets need to be refreshed, use `tools/download_pose_assets.py` and review
  resulting files before committing.
