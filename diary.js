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

  /* The CMS sometimes saves dates without quotes, which the reader turns
     into a real date object. Either way, show it as YYYY-MM-DD. */
  function isoDate(value) {
    if (value instanceof Date && !isNaN(value)) return value.toISOString().slice(0, 10);
    return String(value || "").slice(0, 10);
  }

  function slugify(text) {
    return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function renderMarkdown(text) {
    if (!window.marked) return `<p>${text}</p>`;
    if (typeof window.marked.parse === "function") return window.marked.parse(text || "");
    return window.marked(text || "");
  }

  function escapeAttr(text) {
    return String(text || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }

  /* Each entry is a CRT screen in the archive style */
  function entryHTML(entry, number) {
    const { title, date, photo, photo_alt, photo_side } = entry.data;
    const side = photo_side === "left" ? "left" : "right";
    const bodyHtml = renderMarkdown(entry.body);

    const photoBlock = photo
      ? `<figure class="photo ${side}"><img src="${escapeAttr(photo)}" alt="${escapeAttr(photo_alt)}"></figure>`
      : "";

    return `
    <article class="crt entry fade-in" id="${slugify(String(title || ""))}">
      <div class="bar term"><span><span class="p">&gt;</span> log ${isoDate(date)}</span><span>entry ${String(number).padStart(3, "0")}</span></div>
      <h2>${title}</h2>
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
      entries.sort((a, b) => isoDate(b.data.date).localeCompare(isoDate(a.data.date)));
      if (entries.length === 0) {
        container.innerHTML = `<p class="loading">&gt; no entries yet. check back soon.</p>`;
        return;
      }
      const pieces = entries.map((e, i) => entryHTML(e, entries.length - i));
      container.innerHTML = pieces.join("\n");

      // re-run fade-in observer for newly inserted content
      if (window.initFadeIn) window.initFadeIn();
    })
    .catch((err) => {
      container.innerHTML = `<p class="loading">&gt; couldn't open the log right now. (${err.message})</p>`;
      console.error(err);
    });
})();
