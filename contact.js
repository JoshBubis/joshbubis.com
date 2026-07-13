(function () {
  var HUB_CONFIG = "https://hub.joshbubis.com/webhooks/contact/site_config";
  var form = document.getElementById("contact-form");
  var alertEl = document.getElementById("contact-alert");
  var statusEl = document.getElementById("turnstile-status");
  var submitBtn = document.getElementById("submit-btn");
  var started = document.getElementById("form_started_at");
  var tokenInput = document.getElementById("cf-turnstile-response");
  var yearEl = document.getElementById("year");
  var widgetId = null;

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  if (started) started.value = String(Math.floor(Date.now() / 1000));

  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function showAlert(kind, text) {
    if (!alertEl) return;
    alertEl.hidden = false;
    alertEl.className = "contact-alert contact-alert--" + kind;
    alertEl.textContent = text;
  }

  function paramsFromQuery() {
    var q = new URLSearchParams(window.location.search);
    if (q.get("sent") === "1") {
      showAlert("ok", "Thanks — your message is on its way. I’ll reply soon.");
      if (form) form.hidden = true;
    }
    var err = q.get("error");
    if (err) showAlert("err", err);
  }

  function enableSubmit() {
    if (submitBtn) submitBtn.disabled = false;
  }

  function renderTurnstile(sitekey) {
    function tryRender() {
      if (typeof turnstile === "undefined") {
        window.setTimeout(tryRender, 80);
        return;
      }
      widgetId = turnstile.render("#turnstile-container", {
        sitekey: sitekey,
        theme: "light",
        "refresh-expired": "auto",
        callback: function (token) {
          tokenInput.value = token;
          enableSubmit();
          if (statusEl) statusEl.textContent = "";
        },
        "error-callback": function () {
          if (statusEl) statusEl.textContent = "Bot check failed to load. Refresh and try again.";
          if (submitBtn) submitBtn.disabled = true;
        },
        "expired-callback": function () {
          tokenInput.value = "";
          if (submitBtn) submitBtn.disabled = true;
          if (statusEl) statusEl.textContent = "Bot check expired — complete it again.";
        }
      });
    }
    tryRender();
  }

  fetch(HUB_CONFIG, { credentials: "omit" })
    .then(function (r) { return r.json(); })
    .then(function (cfg) {
      if (!cfg || !cfg.configured || !cfg.sitekey) {
        if (statusEl) {
          statusEl.textContent = "Contact form isn’t ready yet — email joshbubis@gmail.com for now.";
        }
        return;
      }
      if (statusEl) statusEl.textContent = "Complete the check below, then send.";
      renderTurnstile(cfg.sitekey);
    })
    .catch(function () {
      if (statusEl) {
        statusEl.textContent = "Couldn’t reach bot protection — email joshbubis@gmail.com.";
      }
    });

  if (form) {
    form.addEventListener("submit", function (e) {
      if (!tokenInput.value) {
        e.preventDefault();
        showAlert("err", "Please complete the bot check first.");
      }
    });
  }

  paramsFromQuery();
})();
