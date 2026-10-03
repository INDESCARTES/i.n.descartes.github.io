# Setting up your diary admin panel

This gives you a real login screen with a form — write a title, pick a date, upload
a photo, write the entry, hit publish — and it updates the live site automatically.
No file editing, no HTML.

You only need to do this setup once. After that, you just visit yoursite.com/admin
whenever you want to write.

---

## Before you start: confirm two things about your repo

Open `diary.js` and check these two lines near the top:

```js
const DIARY_REPO_OWNER = "indescartes";
const DIARY_REPO_NAME = "indescartes.github.io";
```

- `DIARY_REPO_OWNER` should be your GitHub username exactly as it appears in your
  profile URL (github.com/**yourusername**).
- `DIARY_REPO_NAME` should be the exact name of the repository your site lives in.
  If your site loads at `yourusername.github.io` with nothing after it, your repo
  is almost certainly named `yourusername.github.io` — which is what's set here.
  If your site instead loads at `yourusername.github.io/something/`, change this
  value to `something`.

If you're not sure, go to your repository on github.com and check the name shown
at the top of the page.

---

## Step 1 — Create a free Netlify account

Netlify won't host your actual site — GitHub Pages keeps doing that. Netlify only
powers the login screen for your admin panel.

1. Go to [netlify.com](https://www.netlify.com) and sign up (the free plan is enough).
2. Sign up using **"Sign up with GitHub"** — this makes the next steps automatic.

## Step 2 — Connect your repo to Netlify

1. From your Netlify dashboard, click **"Add new site" → "Import an existing project"**.
2. Choose **GitHub**, then select your `indescartes.github.io` repository.
3. Netlify will ask about build settings — you can leave everything as default and
   click **Deploy**. (It's fine if this creates a second, unused copy of your site
   on a netlify.app address — you can ignore that URL completely. Your real site
   stays on GitHub Pages.)

## Step 3 — Turn on Identity and Git Gateway

1. In your new Netlify site's dashboard, go to **Site configuration → Identity**.
2. Click **Enable Identity**.
3. Scroll to **Registration preferences** and set it to **Invite only** (so random
   people can't sign up to edit your site).
4. Go to **Site configuration → Identity → Services → Git Gateway**, and click
   **Enable Git Gateway**. This is what lets the admin panel actually save changes
   to your GitHub repo on your behalf.

## Step 4 — Invite yourself

1. Still under **Identity**, click **Invite users**.
2. Enter your own email address and send the invite.
3. Check your email for a message from Netlify — click the confirmation link.
   It'll ask you to set a password. Set one and finish the process.

## Step 5 — Log in and write

1. Go to `https://yourusername.github.io/admin/` (your actual site, with `/admin/`
   added to the end).
2. Click **Login**, enter the email and password you just set.
3. You should see **Diary** as a collection with your three existing entries
   already listed. Click **New Diary** to write one, or click an existing entry
   to edit it.
4. Fill in the title, date, optionally upload a photo, choose whether the photo
   sits left or right, and write the entry. Click **Publish** when you're ready.

That's it — the new entry becomes a file in your GitHub repo automatically, and
your diary page picks it up and displays it within a minute or so.

---

## Notes on how this actually works

- Every diary entry lives in your repo as a small text file inside a `_diary`
  folder — this is what the admin form is editing behind the scenes.
- The diary page itself (`diary.html`) doesn't have any diary text hardcoded into
  it anymore. Instead, a small script (`diary.js`) reads the `_diary` folder
  straight from GitHub every time someone visits the page, and builds the entries
  on the fly — including the framed photo and the layout you already have.
- Because this uses GitHub's public API to list files, it works without any
  server or build process — but GitHub allows about 60 of these lookups per hour
  from any one visitor's location. For a personal author site this is very
  unlikely to ever be a problem, but it's worth knowing about if traffic ever
  grows a lot.
- If you ever want to stop using the admin panel and go back to hand-editing,
  the `_diary/*.md` files are plain text — title, date, and the entry itself —
  and you can edit them directly on github.com like any other file.
