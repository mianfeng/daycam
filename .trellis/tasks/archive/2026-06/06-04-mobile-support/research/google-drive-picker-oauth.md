# Google Drive Picker and OAuth Notes

## Sources

- Google Picker overview: https://developers.google.com/workspace/drive/picker/guides/overview
- Google Picker web app guide: https://developers.google.com/workspace/drive/picker/guides/web-picker
- Google Picker desktop/mobile guide: https://developers.google.com/workspace/drive/picker/guides/desktop-mobile-picker
- OAuth scopes list: https://developers.google.com/identity/protocols/oauth2/scopes

## Findings

- Daycam is a hosted browser app, so the relevant Picker path is the web app integration, which uses the client-side JavaScript library and a JavaScript callback.
- Google's Picker overview says web apps have flexible scopes, while desktop/mobile app Picker flows are stricter and only permit `drive.file` for that app flow.
- Google Picker can return selected file/folder metadata, including ids, but organizing, moving, or copying files requires the Drive API rather than Picker alone.
- The web app guide requires a Google Cloud project, Picker API, API key, OAuth client id, and authorized JavaScript origins for the hosted Daycam domain.
- `https://www.googleapis.com/auth/drive.file` grants access only to specific Drive files the app uses.
- `https://www.googleapis.com/auth/drive` grants broad read/write access to all Drive files.

## Implication for Daycam

Daycam needs to work with an existing `daycam-data` archive containing `photos/`, `archive/`, and `metadata.json`. A least-privilege `drive.file` design may need a careful setup flow to grant access to every existing file/folder Daycam must touch. A personal/internal MVP can be simpler with the broader `drive` scope, but that grants much wider access and should remain limited to the user's own OAuth testing app.
