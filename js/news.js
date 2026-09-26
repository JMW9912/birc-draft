/* BiRC Lab · News page: one tab per year. The newest SHOW years are visible;
   a "…" tab after them reveals the earlier years in the same row. */
(function () {
  var SHOW = 8;
  var data = (window.BIRC_NEWS || []).slice();
  var by = {};
  data.forEach(function (it) { (by[it.year] = by[it.year] || []).push(it); });
  var years = Object.keys(by).map(Number).sort(function (a, b) { return b - a; });
  var tabs = document.getElementById('newsTabs'), panes = document.getElementById('newsPanes');
  if (!tabs || !panes) return;

  function media(it) {
    var b = '';
    if (it.date) b += '<div class="date">' + it.date + '</div>';
    if (it.text) b += '<div>' + it.text + '</div>';
    (it.images || []).forEach(function (im) { b += '<img src="images/' + im + '" loading="lazy">'; });
    if (it.video) b += '<div class="video ytlite" data-vid="' + it.video + '"><img alt="Play video" class="ytthumb" loading="lazy" src="https://i.ytimg.com/vi/' + it.video + '/hqdefault.jpg"><span class="ytplay"></span></div>';
    if (it.link) b += '<div style="margin-top:8px"><a href="' + it.link + '" target="_blank" rel="noopener">[link]</a></div>';
    return b;
  }

  years.forEach(function (y, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'tab' + (i === 0 ? ' active' : '') + (i >= SHOW ? ' old' : '');
    b.textContent = y;
    b.dataset.tab = 'y' + y;
    tabs.appendChild(b);
    var pane = document.createElement('div');
    pane.className = 'tabpane' + (i === 0 ? ' show' : '');
    pane.id = 'y' + y;
    by[y].forEach(function (it) {
      var card = document.createElement('div');
      card.className = 'news-item';
      card.innerHTML = '<div class="body">' + (it.html || media(it)) + '</div>';
      pane.appendChild(card);
    });
    panes.appendChild(pane);
  });

  if (years.length > SHOW) {
    var more = document.createElement('button');
    more.type = 'button';
    more.className = 'tab tab-more';
    more.textContent = '…';
    more.title = 'Earlier years';
    more.setAttribute('aria-label', 'Show earlier years (' + years[years.length - 1] + '–' + years[SHOW] + ')');
    tabs.insertBefore(more, tabs.querySelector('.tab.old'));
    more.addEventListener('click', function () { tabs.classList.add('show-old'); more.hidden = true; });
  }

  tabs.addEventListener('click', function (e) {
    var t = e.target.closest('.tab');
    if (!t || !t.dataset.tab) return;
    tabs.querySelectorAll('.tab').forEach(function (x) { x.classList.remove('active'); });
    panes.querySelectorAll('.tabpane').forEach(function (x) { x.classList.remove('show'); });
    t.classList.add('active');
    document.getElementById(t.dataset.tab).classList.add('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
