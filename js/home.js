/* BiRC Lab · home page: research highlights, group-photo slideshow, layer labels, latest news & papers */
(function () {
  // ---- Research highlights: pick a result on the right (below the photo on phones)
  // Click (or tap) selects; with a mouse, hovering over an item selects it too.
  var picks = document.querySelectorAll('.hl-pick');
  var slides = document.querySelectorAll('.hl-slide');
  var canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  function pick(b) {
    var i = b.getAttribute('data-i');
    picks.forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    slides.forEach(function (s) { s.classList.toggle('on', s.getAttribute('data-i') === i); });
  }
  picks.forEach(function (b) {
    b.addEventListener('click', function () { pick(b); });
    b.addEventListener('focus', function () { pick(b); });
    if (canHover) b.addEventListener('mouseenter', function () { pick(b); });
  });

  // Side list (desktop): largest label and title sizes that keep every item on one line.
  function fitGroup(els, max, min) {
    function set(v) { els.forEach(function (e) { e.style.fontSize = v + 'px'; }); }
    function over() { return els.some(function (e) { return e.scrollWidth > e.clientWidth; }); }
    var fs = max; set(fs);
    while (fs > min && over()) { fs -= 0.25; set(fs); }
  }
  function fitPicks() {
    var ks = [].slice.call(document.querySelectorAll('.hl-pick .k'));
    var bs = [].slice.call(document.querySelectorAll('.hl-pick b'));
    var stacked = picks.length > 1 && picks[0].offsetLeft === picks[1].offsetLeft;
    if (!stacked) { ks.concat(bs).forEach(function (e) { e.style.fontSize = ''; }); return; }
    fitGroup(ks, 14, 9);
    fitGroup(bs, 20, 12);
  }

  // ---- Group photos: crossfade every 4 s, only while visible; no autoplay with reduced motion
  var box = document.querySelector('.h-slides');
  if (box) {
    var imgs = box.querySelectorAll('img');
    var dots = document.querySelectorAll('.h-dots button');
    var cap = document.querySelector('[data-cap]');
    var cur = 0, timer = null, visible = false;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function go(n) {
      imgs[cur].classList.remove('on'); dots[cur] && dots[cur].classList.remove('on');
      cur = (n + imgs.length) % imgs.length;
      imgs[cur].classList.add('on'); dots[cur] && dots[cur].classList.add('on');
      if (cap) cap.textContent = imgs[cur].getAttribute('data-cap') || '';
    }
    function start() { stop(); if (!reduce && visible && !document.hidden) timer = setInterval(function () { go(cur + 1); }, 4000); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    box.querySelector('.prev').addEventListener('click', function () { go(cur - 1); start(); });
    box.querySelector('.next').addEventListener('click', function () { go(cur + 1); start(); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); start(); }); });
    document.addEventListener('visibilitychange', start);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; start(); }, { threshold: 0.2 }).observe(box);
    } else { visible = true; start(); }
  }

  // ---- Research layers: largest label size (max 14px) that keeps all three labels on one line
  var LABEL_MAX = 14, LABEL_MIN = 9;
  function fitLabels() {
    var g = document.querySelector('.h-layers');
    if (!g) return;
    var ks = [].slice.call(g.querySelectorAll('.k'));
    var side = g.children.length > 1 && g.children[0].offsetTop === g.children[1].offsetTop;
    if (!side) { ks.forEach(function (k) { k.style.fontSize = ''; }); return; }
    function set(v) { ks.forEach(function (k) { k.style.fontSize = v + 'px'; }); }
    function over() { return ks.some(function (k) { return k.scrollWidth > k.clientWidth; }); }
    var fs = LABEL_MAX; set(fs);
    while (fs > LABEL_MIN && over()) { fs -= 0.25; set(fs); }
  }
  // ---- Subtitle: size "Across Humans and Robots" so it ends where "Shared Physical" ends
  function fitSub() {
    var l1 = document.querySelector('.h1-l1'), sub = document.querySelector('.h-sub span');
    if (!l1 || !sub) return;
    sub.style.fontSize = '';
    var base = parseFloat(getComputedStyle(sub).fontSize);
    var w = sub.getBoundingClientRect().width, target = l1.getBoundingClientRect().width;
    if (w > 0 && target > 0) sub.style.fontSize = (base * target / w).toFixed(2) + 'px';
  }
  function fitAll() { fitLabels(); fitPicks(); fitSub(); }
  fitAll();
  window.addEventListener('resize', fitAll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);

  // ---- Latest 5 news items and 5 journal papers, read from the same data files as the News/Publications pages
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function clip(s, n) { s = s.replace(/\s+/g, ' ').trim(); if (s.length <= n) return s; var c = s.slice(0, n); return c.slice(0, c.lastIndexOf(' ')) + '…'; }
  var parser = window.DOMParser ? new DOMParser() : null; // parsed documents never load images

  var newsEl = document.getElementById('homeNews');
  if (newsEl && window.BIRC_NEWS && parser) {
    newsEl.innerHTML = window.BIRC_NEWS.slice(0, 5).map(function (it) {
      var date = it.date || '', text = it.text || '';
      if (it.html) {
        var doc = parser.parseFromString(it.html, 'text/html');
        var d = doc.querySelector('.ndate');
        if (d) { date = d.textContent.replace(/\.\s*$/, '').trim(); d.remove(); }
        text = doc.body.textContent;
      }
      return '<li><time>' + esc(date) + '</time><a href="news.html">' + esc(clip(text, 150)) + '</a></li>';
    }).join('');
  }

  var pubEl = document.getElementById('homePubs');
  if (pubEl && window.BIRC_PUBS && parser) {
    var g = window.BIRC_PUBS.filter(function (x) { return x.key === 'ij'; })[0] || window.BIRC_PUBS[0];
    var items = [];
    g.sections.forEach(function (s) { items = items.concat(s.items); });
    items.sort(function (a, b) { return (b.n || 0) - (a.n || 0); });
    pubEl.innerHTML = items.slice(0, 5).map(function (it) {
      var doc = parser.parseFromString(it.html, 'text/html');
      var txt = doc.body.textContent;
      var m = txt.match(/[“"]([^”"]+)[”"]/);
      var title = m ? m[1].replace(/[,.]\s*$/, '') : clip(txt, 120);
      var venue = doc.querySelector('i') ? doc.querySelector('i').textContent : '';
      return '<li><span class="meta">[' + it.n + '] ' + esc(venue) + (it.year ? ', ' + it.year : '') + '</span><a href="publications.html">' + esc(title) + '</a></li>';
    }).join('');
  }
})();
