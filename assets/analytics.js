/* Elementalys website analytics (Google Analytics 4) with cookie consent.
   Nothing is loaded and no cookie is set until the visitor clicks "Accept".
   The choice is stored in localStorage; any element with [data-cookie-settings]
   reopens the banner so visitors can change their mind. */
(function () {
  var GA_ID = 'G-WXM43KQ5NZ';
  var KEY = 'elementalys-analytics-consent';
  var loaded = false;

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function setChoice(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }

  function loadGA() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  /* On decline after a previous accept: stop measuring and remove the GA cookies. */
  function disableGA() {
    window['ga-disable-' + GA_ID] = true;
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0) {
        var host = location.hostname.split('.');
        var domain = host.slice(-2).join('.');
        document.cookie = name + '=; Max-Age=0; path=/; domain=.' + domain;
        document.cookie = name + '=; Max-Age=0; path=/';
      }
    });
  }

  var banner;
  function hideBanner() { if (banner) banner.hidden = true; }
  function showBanner() {
    if (!banner) {
      banner = document.createElement('div');
      banner.className = 'consent';
      banner.setAttribute('role', 'dialog');
      banner.setAttribute('aria-live', 'polite');
      banner.setAttribute('aria-label', 'Cookie preferences');
      var root = document.querySelector('script[src*="analytics.js"]');
      var base = root ? root.getAttribute('src').replace(/assets\/analytics\.js.*$/, '') : '/';
      banner.innerHTML =
        '<p>We use Google Analytics cookies to understand how visitors use this site. ' +
        'They are set only if you accept. <a href="' + base + 'privacy/index.html#analytics">Learn more</a></p>' +
        '<div class="consent-btns">' +
        '<button type="button" class="btn btn-line" data-consent="denied">Decline</button>' +
        '<button type="button" class="btn btn-ink" data-consent="granted">Accept</button>' +
        '</div>';
      banner.addEventListener('click', function (e) {
        var v = e.target.getAttribute && e.target.getAttribute('data-consent');
        if (!v) return;
        setChoice(v);
        hideBanner();
        if (v === 'granted') { window['ga-disable-' + GA_ID] = false; loadGA(); }
        else disableGA();
      });
      document.body.appendChild(banner);
    }
    banner.hidden = false;
  }

  function init() {
    var choice = getChoice();
    if (choice === 'granted') loadGA();
    else if (choice !== 'denied') showBanner();

    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-cookie-settings]');
      if (t) { e.preventDefault(); showBanner(); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
