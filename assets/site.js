/* Elementalys site behaviour: scroll reveals and the StoryScale comparison demo. */
(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIntro = document.body.classList.contains('has-intro');

  /* ---- Scroll reveal ---- */
  var items = [].slice.call(document.querySelectorAll('.rv, .steps'));
  function startReveal() {
    if (!doc.classList.contains('js')) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });

    var demo = document.getElementById('demo');
    if (demo) {
      var dio = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { dio.disconnect(); runDemo(demo); }
      }, { threshold: 0.4 });
      dio.observe(demo);
    }
  }
  /* On the home page the intro covers the screen for ~1.9s: start revealing as it dissolves. */
  setTimeout(startReveal, hasIntro && !reduce ? 1800 : 0);

  /* ---- A vs B demo: cards enter, the cursor clicks one, the card is selected ---- */
  function runDemo(demo) {
    var cards = demo.querySelector('.cards');
    var A = demo.querySelector('.card.a'), B = demo.querySelector('.card.b');
    var cur = demo.querySelector('.cursor'), cnt = demo.querySelector('.count');
    if (reduce) { cards.classList.remove('enter'); A.classList.add('picked'); return; }
    var pairs = [
      { a: ['AO-201', 'Account access cleanup', 'Story · Backend'], b: ['AO-144', 'Update empty state copy', 'Story · Frontend'], pick: 'a' },
      { a: ['AO-188', 'Rename the export button', 'Story · Frontend'], b: ['AO-212', 'Bulk permission rules', 'Story · Backend'], pick: 'b' },
      { a: ['AO-175', 'Password reset email', 'Story · Backend'], b: ['AO-196', 'Invite link expiry', 'Story · Backend'], pick: 'a' }
    ];
    var i = 0, n = 4;
    function fill(card, d) {
      card.querySelector('.key').textContent = d[0];
      card.querySelector('.ttl').textContent = d[1];
      card.querySelector('.meta').textContent = d[2];
    }
    function wait(ms) { return new Promise(function (res) { setTimeout(res, ms); }); }
    function moveTo(el) {
      var r = el.getBoundingClientRect(), p = demo.getBoundingClientRect();
      cur.style.transform = 'translate(' + (r.left - p.left + r.width * 0.55) + 'px,' + (r.top - p.top + r.height * 0.55) + 'px)';
    }
    cur.style.transform = 'translate(' + demo.clientWidth * 0.5 + 'px,' + (demo.clientHeight + 20) + 'px)';
    (function loop() {
      var p = pairs[i % pairs.length], t = p.pick === 'a' ? A : B;
      A.classList.remove('picked', 'press'); B.classList.remove('picked', 'press');
      fill(A, p.a); fill(B, p.b); cnt.textContent = 'Comparison ' + n + ' of 12';
      cards.classList.remove('leave'); cards.classList.add('enter');
      wait(60)
        .then(function () { cards.classList.remove('enter'); return wait(900); })
        .then(function () { cur.style.opacity = 1; moveTo(t); return wait(1000); })
        .then(function () { t.classList.add('press'); return wait(180); })
        .then(function () { t.classList.remove('press'); t.classList.add('picked'); return wait(2200); })
        .then(function () { cur.style.opacity = 0; cards.classList.add('leave'); return wait(650); })
        .then(function () { i++; n = n >= 12 ? 4 : n + 1; loop(); });
    })();
  }
})();
