/* Diary renderer — pulls entries from /_diary on GitHub and builds the page.
   No build step needed: this runs entirely in the visitor's browser.

   IMPORTANT: update these two values if your GitHub username or repo name
   are different from what's set here. */
const DIARY_REPO_OWNER = "INDESCARTES";
const DIARY_REPO_NAME = "i.n.descartes.github.io";
const DIARY_BRANCH = "main";

(function () {
  const container = document.getElementById("diary-entries");
  if (!container) return;

  const apiUrl = `https://api.github.com/repos/${DIARY_REPO_OWNER}/${DIARY_REPO_NAME}/contents/_diary?ref=${DIARY_BRANCH}`;

  function parseFrontmatter(raw) {
    const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
    if (!match) return { data: {}, body: raw };
    const data = window.jsyaml.load(match[1]) || {};
    return { data, body: match[2] };
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    if (isNaN(d)) return dateStr;
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm} / ${dd} / ${yyyy}`;
  }

  function slugify(text) {
    return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function ringDividerHTML() {
    return `<div class="ring-divider"><img src="assets/binder-rings.png" alt="" aria-hidden="true"></div>`;
  }

  function renderMarkdown(text) {
    if (!window.marked) return `<p>${text}</p>`;
    if (typeof window.marked.parse === "function") return window.marked.parse(text || "");
    return window.marked(text || "");
  }

  function entryHTML(entry) {
    const { title, date, photo, photo_alt, photo_side } = entry.data;
    const side = photo_side === "left" ? "float-left" : "float-right";
    const bodyHtml = renderMarkdown(entry.body);

    const photoBlock = photo
      ? `<div class="framed-photo ${side}">
           <div class="photo-inner">
             <img src="${photo}" alt="${photo_alt || ""}">
           </div>
           <img class="frame-img" src="assets/frame-gold.png" alt="">
         </div>`
      : "";

    return `
    <article class="diary-entry fade-in" id="${slugify(title)}">
      <h2>${title}</h2>
      <span class="diary-date">${formatDate(date)}</span>
      ${photoBlock}
      ${bodyHtml}
      <p class="signoff">xoxo, descartes</p>
    </article>`;
  }

  fetch(apiUrl)
    .then((res) => {
      if (!res.ok) throw new Error("Could not reach GitHub (" + res.status + ")");
      return res.json();
    })
    .then((files) => {
      const mdFiles = files.filter((f) => f.name.endsWith(".md"));
      return Promise.all(
        mdFiles.map((f) =>
          fetch(f.download_url)
            .then((r) => r.text())
            .then((raw) => parseFrontmatter(raw))
        )
      );
    })
    .then((entries) => {
      entries.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
      if (entries.length === 0) {
        container.innerHTML = `<p>No entries yet — check back soon.</p>`;
        return;
      }
      const pieces = entries.map((e) => entryHTML(e));
      container.innerHTML = pieces.join(`\n${ringDividerHTML()}\n`);

      // re-run fade-in observer for newly inserted content
      if (window.initFadeIn) window.initFadeIn();
    })
    .catch((err) => {
      container.innerHTML = `<p>Couldn't load diary entries right now. (${err.message})</p>`;
      console.error(err);
    });
})();
