# GESTALT Privacy Policy

**Effective date:** November 15, 2026
**Project:** https://github.com/numbpill3d/gestalt
**Contact:** Open an issue at https://github.com/numbpill3d/gestalt/issues

## Short version

GESTALT is local-first. We do not have an account system, we do not sell
your data, we do not show ads, and we do not track you across websites.
Your bookmarks, windows, themes, and settings stay in your browser
unless you choose to export them.

## What we do not collect

We do not collect or receive:

- Your name, email, or account info, because there is no account
- Your browsing history
- Your bookmarks, except as stored locally in your own browser
- Your audio files, playlists, or skins
- Analytics, advertising IDs, or cross-site tracking data

## What stays on your device

GESTALT stores the following locally in your browser, using local
storage / extension storage:

- Bookmark entries you create, edit, or import
- Window position, size, focus, and minimized state
- Visual theme and UI preferences
- Cellular automata and widget settings
- Audio player playlist references and skin choices

This data never leaves your device unless you do one of the actions
below.

## Web app

When you run GESTALT locally with `npm run dev` or use a hosted
version, your data stays in that browser. If you open a hosted
version, the hosting provider may keep standard server logs, such as
IP address, date, and requested page, as most web hosts do. GESTALT
itself does not add analytics or tracking on top of that.

## Browser extension

The Chrome and 【entity-Firefox¦canonical_name=Firefox】 extensions are self-contained Manifest V3
extensions with their own local bookmark desk.

The extension:

- Saves the active tab only when you choose "Save page to GESTALT"
  from the context menu or the extension UI
- Uses storage to save your bookmarks and settings locally
- Uses the context menu permission only to add that save action
- Does not read your tabs in the background
- Does not read your browsing history
- Does not run remote code

## Actions you choose

These actions happen only when you trigger them:

- **JSON import / export:** You choose a file to import, or you
  download an export file. The file is processed locally in your browser.
- **Save page:** The title and URL of the current tab are saved to
  your local bookmark desk.
- **Open hosted workspace:** If you enter an optional web-app URL,
  your browser opens that URL. That site is governed by its own policy.
- **Audio skins:** `.wsz` files or images you load are read locally
  in your browser. They are not uploaded.

## Third-party services

- **ASCII art widget:** The rotating ASCII art widget is fetched
  through a server-side proxy to ASCIIArt.eu. The proxy is used to
  avoid exposing your browser directly to that service. ASCIIArt.eu
  may see the proxy server request, not your personal data.
- **Fonts, CDNs, or other embeds:** If you or a future theme adds
  an external font or embed, that provider may see a standard web
  request from your browser. The current prototype does not add
  tracking embeds.

## Data retention and deletion

Because there is no GESTALT account or server copy, there is nothing
for us to delete on a server.

To delete your data:

- Web app: Clear site data / local storage for the GESTALT site in
  your browser settings
- Extension: Remove the extension, or clear extension storage in
  your browser settings

## Children

GESTALT is not directed at children under 13, and we do not knowingly
collect personal information from children. If you believe a child
has provided personal information through a hosted version, contact
us through the repo issues link above and we will help you remove it.

## Changes

If this policy changes, we will update the effective date above and
commit the change to this repository. For store listings, the current
version in this repo is the authoritative version.

## Store listing note

For Chrome Web Store and 【entity-Firefox Add-ons¦canonical_name=Firefox】, use this URL as the
privacy-policy URL:

https://github.com/numbpill3d/gestalt/blob/main/PRIVACY.md
