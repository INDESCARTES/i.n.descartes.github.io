# The Descartes Library

Static site for author I.N. Descartes: Home, About, Novels, Diary, Contact.

## Files
- `index.html`, `about.html`, `novels.html`, `diary.html`, `contact.html` — the five pages
- `style.css` — shared styling (colors, type, layout)
- `assets/portrait.jpg` — your photo, used on the About page
- `assets/cover-tuft-hunter.png` — the Tuft Hunter cover, used on Home and Novels

## Publishing to GitHub Pages
1. Create a new repository on GitHub (public, or private if you have GitHub Pro).
2. Add these files to the repo (drag-and-drop on github.com works, or `git push`).
3. Go to **Settings → Pages**.
4. Under "Build and deployment," set Source to **Deploy from a branch**, branch `main`, folder `/ (root)`.
5. Save. GitHub gives you a URL like `https://yourusername.github.io/reponame/` within a minute or two.

## Things that need more than static HTML
GitHub Pages only serves static files — it can't run server code or write to your Google Drive on its own. Two spots in this site are affected:

- **Contact form** (`contact.html`) — currently wired to open the visitor's email app with a pre-filled message to `author.indescartes@gmail.com` when they hit Submit. This works with no setup, but depends on the visitor having a mail app configured, and nothing gets logged anywhere automatically.
- **Email signup** form in the footer (every page) — currently does nothing on submit.

**If you want responses to land in your Google Drive automatically**, the simplest real fix is to replace the custom form with a [Google Form](https://www.google.com/forms/about/): every submission saves straight into a Sheet in your Drive, no backend needed. You'd build the form in Google Forms, then either link to it or embed it in place of the HTML form here — happy to help style an embedded version to match the site if you want to go that route.

Alternatively, a service like [Formspree](https://formspree.io) or [Getform](https://getform.io) can deliver form submissions straight to your inbox (not Drive) — swap the form's `action="#"` for the endpoint they give you.

## Swapping in different images
- Portrait: replace `assets/portrait.jpg` with any image of the same name, or update the `src` on the `<img class="portrait">` in `about.html`.
- Cover: replace `assets/cover-tuft-hunter.png`, or update the `src` on the `<img>` inside `.cover` in `index.html` and `novels.html`.

## Customizing further
All colors and fonts are defined once at the top of `style.css` under `:root` — change the hex values there to adjust the palette site-wide.
