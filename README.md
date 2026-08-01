# KNIGHT.EXE — Campfire Encounter

A short interactive letter built for **Collection 001: Unexpected Encounters**.

## What it includes

- Retro title screen
- Pixel-art campfire scene
- A knight and a short traveler
- Three meaningful questions
- Three choices per question
- Different responses depending on the player's answers
- Original browser-generated chiptune and fire ambience
- No external audio or image files required
- Mobile-friendly layout

## Upload to GitHub

Replace the existing files in your repository with:

- `index.html`
- `style.css`
- `script.js`

The filenames must remain lowercase.

After uploading, wait for GitHub Pages to redeploy. Refresh the live page after the deployment finishes.

## Edit the dialogue

Open `script.js` and find:

```js
const story = {
```

Each question and response is written there. You can change the text without touching the rest of the game logic.

## Notes

The music is generated directly by the browser, so it is original and does not use copyrighted songs.
