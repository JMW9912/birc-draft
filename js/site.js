/* BiRC Lab · shared page behaviour (loaded with defer on every page) */
(function () {
  // Mobile menu
  var burger = document.querySelector('.burger');
  var mob = document.getElementById('mob');
  if (burger && mob) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', open ? 'false' : 'true');
      mob.hidden = open;
    });
  }

  // Back-to-top button
  var top = document.getElementById('toTop');
  if (!top) {
    top = document.createElement('button');
    top.id = 'toTop';
    top.setAttribute('aria-label', 'Back to top');
    top.innerHTML = '&uarr; TOP';
    document.body.appendChild(top);
  }
  window.addEventListener('scroll', function () { top.classList.toggle('show', window.scrollY > 360); }, { passive: true });
  top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // YouTube refuses to play embeds on pages opened straight from disk (file://, "error 153"),
  // because no site address is sent. There, open the video on YouTube in a new tab instead.
  // On a real web server (GitHub Pages, birc.korea.ac.kr) the players below work normally.
  if (location.protocol === 'file:') {
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-vid]');
      if (!el) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      window.open('https://www.youtube.com/watch?v=' + el.getAttribute('data-vid'), '_blank', 'noopener');
    }, true);
  }

  // Lazy YouTube: replace the thumbnail with the player on click
  document.addEventListener('click', function (e) {
    var f = e.target.closest('.ytlite[data-vid]');
    if (!f || f.getAttribute('data-loaded')) return;
    f.setAttribute('data-loaded', '1');
    var v = f.getAttribute('data-vid'), p = f.getAttribute('data-params');
    var u = 'https://www.youtube.com/embed/' + v + '?autoplay=1&rel=0&playsinline=1' + (p ? '&' + p : '');
    f.innerHTML = '<iframe src="' + u + '" allow="autoplay; encrypted-media; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen frameborder="0"></iframe>';
  });

  // Links to other sites open in a new tab
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a) return;
    var h = a.getAttribute('href') || '';
    if (h.charAt(0) === '#' || /^(javascript|mailto|tel):/i.test(h)) return;
    if (a.host && a.host !== location.host) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
  }, true);
})();
