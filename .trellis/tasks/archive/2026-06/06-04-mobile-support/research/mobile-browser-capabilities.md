# Mobile Browser Capabilities

## Sources

- MDN `Window.showDirectoryPicker()` documents the directory picker used by Daycam's current storage flow and marks it as limited availability: https://developer.mozilla.org/docs/Web/API/Window/showDirectoryPicker
- Chrome Developers documents the File System Access API shape used for local file and directory handles: https://developer.chrome.com/articles/file-system-access
- MDN `MediaDevices.getUserMedia()` documents the secure-context camera API Daycam already uses: https://developer.mozilla.org/docs/Web/API/MediaDevices/getUserMedia
- WebKit documents support for the Origin Private File System subset, which is not the same as user-selected directory read/write: https://webkit.org/blog/12257/the-file-system-access-api-with-origin-private-file-system/
- Google Drive API upload documentation confirms web apps can upload file data through Drive API: https://developers.google.com/drive/api/v3/manage-uploads
- Google Drive API scope guidance recommends limited scopes such as `drive.file` with Google Picker for safer file access: https://developers.google.com/workspace/drive/api/guides/api-specific-auth

## Findings

- Camera capture remains a realistic mobile-web target because Daycam already uses `getUserMedia()` with `playsinline` video and secure-context checks.
- The current persistence model is the limiting factor. Daycam stores photos and metadata through File System Access directory handles, centered on `showDirectoryPicker()`.
- Android Chromium browsers are the most plausible first mobile target for preserving the current `daycam-data` directory workflow.
- iOS Safari and iOS Chrome should not be treated as equivalent targets for the current directory workflow. WebKit's Origin Private File System support does not provide the same user-selected, portable `daycam-data` folder model.

## Implications For Daycam

- A responsive/mobile layout alone is not enough. The app also needs a mobile storage strategy.
- If the MVP targets Android Chrome/Edge only, the smallest path is to adapt UI, camera constraints, touch ergonomics, and document the target browser.
- If the MVP must include iPhone, Daycam likely needs an alternate storage/export flow instead of relying only on directory handles.
- A native wrapper can broaden platform integration later, but it is a larger architectural step than the current static browser app.
- If Google Drive is the desired source of truth, direct upload/sync from the browser is possible but becomes a Google Drive integration with OAuth client setup, Drive scopes, folder selection/creation, upload error handling, and conflict behavior.
