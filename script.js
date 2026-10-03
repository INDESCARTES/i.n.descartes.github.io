function initFadeIn() {
  var targets = document.querySelectorAll('.fade-in:not([data-fade-bound])');

  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) {
      el.classList.add('is-visible');
      el.setAttribute('data-fade-bound', '1');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(function (el) {
    el.setAttribute('data-fade-bound', '1');
    observer.observe(el);
  });
}
window.initFadeIn = initFadeIn;

document.addEventListener('DOMContentLoaded', function () {
  initFadeIn();

  // ---------- Shelf books: click any book to pull it forward and inspect ----------
  var shelfBooks = document.querySelectorAll('.shelf-book');
  var overlay = document.getElementById('bookFocusOverlay');
  var closeBtn = document.getElementById('bookFocusClose');
  var focusStage = document.getElementById('bookFocusStage');
  var focusTitle = document.getElementById('bookFocusTitle');
  var focusSummary = document.getElementById('bookFocusSummary');
  var lastActiveBook = null;

  if (shelfBooks.length && overlay) {
    var openOverlay = function (book) {
      lastActiveBook = book;
      if (focusTitle) focusTitle.textContent = book.getAttribute('data-title') || '';
      if (focusSummary) focusSummary.textContent = book.getAttribute('data-summary') || '';
      if (focusStage) {
        focusStage.classList.toggle('book-placeholder', book.classList.contains('book-placeholder'));
      }
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    };
    var closeOverlay = function () {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastActiveBook) lastActiveBook.focus();
    };

    shelfBooks.forEach(function (book) {
      book.addEventListener('click', function () { openOverlay(book); });
      book.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openOverlay(book);
        }
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeOverlay);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeOverlay();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeOverlay();
    });
  }

  // ---------- Button press glitter/star burst ----------
  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    var GLITTER_COLORS = ['#5c1a24', '#8e2a3b', '#a9bf95', '#f3d7dc'];
    var GLITTER_SHAPES = ['\u2726', '\u2727', '\u2605']; // sparkle, sparkle, star

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('button, .btn');
      if (!btn) return;

      var rect = btn.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var count = 10;

      for (var i = 0; i < count; i++) {
        var star = document.createElement('span');
        star.className = 'glitter-star';
        star.textContent = GLITTER_SHAPES[Math.floor(Math.random() * GLITTER_SHAPES.length)];
        star.style.color = GLITTER_COLORS[Math.floor(Math.random() * GLITTER_COLORS.length)];
        star.style.fontSize = (10 + Math.random() * 12) + 'px';

        var angle = (Math.PI * 2 * i) / count + (Math.random() * 0.6 - 0.3);
        var distance = 36 + Math.random() * 46;
        star.style.setProperty('--dx', (Math.cos(angle) * distance) + 'px');
        star.style.setProperty('--dy', (Math.sin(angle) * distance) + 'px');
        star.style.left = cx + 'px';
        star.style.top = cy + 'px';

        document.body.appendChild(star);
        (function (el) {
          el.addEventListener('animationend', function () { el.remove(); });
          // safety cleanup in case animationend doesn't fire
          setTimeout(function () { if (el.parentNode) el.remove(); }, 900);
        })(star);
      }
    });
  }
});
