(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.classList.add("js-ready");

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Header border on scroll — rAF-throttle to avoid scroll-handler churn */
  var header = document.querySelector(".site-header");
  var headerQueued = false;
  function onScrollHeader() {
    if (!header || headerQueued) return;
    headerQueued = true;
    requestAnimationFrame(function () {
      headerQueued = false;
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    });
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* Process spine inks in as the steps pass — plain scroll math, rAF-throttled */
  var processFlow = document.querySelector(".process-flow");
  var processFill = document.getElementById("process-rail-fill");
  if (processFlow && processFill) {
    if (reduceMotion) {
      processFill.style.transform = "none";
    } else {
      var processQueued = false;
      var applyProcessFill = function () {
        processQueued = false;
        var rect = processFlow.getBoundingClientRect();
        var viewLine = window.innerHeight * 0.72;
        var progress = (viewLine - rect.top) / rect.height;
        progress = Math.max(0, Math.min(1, progress));
        processFill.style.transform = "scaleY(" + progress.toFixed(4) + ")";
      };
      var onScrollProcess = function () {
        if (processQueued) return;
        processQueued = true;
        requestAnimationFrame(applyProcessFill);
      };
      onScrollProcess();
      window.addEventListener("scroll", onScrollProcess, { passive: true });
      window.addEventListener("resize", onScrollProcess, { passive: true });
    }
  }

  /* In-page nav: smooth only on click (wheel/trackpad stay native) */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      var target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
      if (history.replaceState) {
        history.replaceState(null, "", hash);
      }
    });
  });

  /* Scroll reveals — fire once, never reverse (avoids jolt on scroll-up) */
  if (!reduceMotion) {
    var reveals = document.querySelectorAll("[data-reveal]");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -4% 0px", threshold: 0.08 }
      );
      reveals.forEach(function (el) {
        io.observe(el);
      });
    } else {
      reveals.forEach(function (el) {
        el.classList.add("is-in");
      });
    }
  } else {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  /* Work rail: native scroll-snap — movement is user-initiated only */
  var rail = document.getElementById("work-rail");
  var track = document.getElementById("work-track");
  var dotsHost = document.getElementById("work-dots");
  if (rail && track) {
    var panels = Array.prototype.slice.call(track.querySelectorAll(".work-panel"));
    var count = panels.length;
    var activeIndex = 0;
    var dots = [];

    function setActive(i) {
      if (i === activeIndex || i < 0 || i >= count) return;
      activeIndex = i;
      for (var d = 0; d < dots.length; d++) {
        dots[d].classList.toggle("is-active", d === activeIndex);
        dots[d].setAttribute("aria-selected", d === activeIndex ? "true" : "false");
      }
    }

    function scrollToPanel(i) {
      i = Math.max(0, Math.min(count - 1, i));
      var left = panels[i].offsetLeft - panels[0].offsetLeft;
      rail.scrollTo({ left: left, behavior: reduceMotion ? "auto" : "smooth" });
    }

    function buildDots() {
      if (!dotsHost) return;
      dotsHost.innerHTML = "";
      dots = panels.map(function (panel, i) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "work-dot" + (i === 0 ? " is-active" : "");
        btn.setAttribute("role", "tab");
        var nameEl = panel.querySelector(".work-name");
        btn.setAttribute("aria-label", (nameEl && nameEl.textContent) || ("Project " + (i + 1)));
        btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
        btn.addEventListener("click", function () {
          scrollToPanel(i);
        });
        dotsHost.appendChild(btn);
        return btn;
      });
    }

    buildDots();

    /* Dots follow the real scroll position — nearest panel to the snap edge */
    function nearestIndex() {
      var pos = rail.scrollLeft;
      var origin = panels[0].offsetLeft;
      var best = 0;
      var bestDist = Infinity;
      for (var i = 0; i < count; i++) {
        var d = Math.abs(panels[i].offsetLeft - origin - pos);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      return best;
    }

    var syncQueued = false;
    rail.addEventListener("scroll", function () {
      if (syncQueued) return;
      syncQueued = true;
      requestAnimationFrame(function () {
        syncQueued = false;
        setActive(nearestIndex());
      });
    }, { passive: true });

    function step(dir) {
      scrollToPanel(nearestIndex() + dir);
    }

    var prevBtn = document.getElementById("work-prev");
    var nextBtn = document.getElementById("work-next");
    if (prevBtn) prevBtn.addEventListener("click", function () { step(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { step(1); });

    rail.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      }
    });

    /* Mouse drag-to-scroll (touch pans natively); plain clicks still open links */
    var dragging = false;
    var dragCandidate = false;
    var suppressShotClick = false;
    var startX = 0;
    var startScroll = 0;
    var pointerId = null;
    var DRAG_THRESHOLD = 8;

    rail.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      /* Allow drag from screenshot Visit wrapper; ignore other links/buttons */
      if (e.target.closest && e.target.closest("a:not(.work-shot-link),button")) return;
      if (!(e.target.closest && e.target.closest(".work-shot, .work-shot-link"))) return;
      dragCandidate = true;
      dragging = false;
      suppressShotClick = false;
      pointerId = e.pointerId;
      startX = e.clientX;
      startScroll = rail.scrollLeft;
    });
    rail.addEventListener("pointermove", function (e) {
      if (!dragCandidate && !dragging) return;
      if (pointerId != null && e.pointerId !== pointerId) return;
      var dx = e.clientX - startX;
      if (dragCandidate && !dragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return;
        dragging = true;
        dragCandidate = false;
        suppressShotClick = true;
        rail.classList.add("is-dragging");
        try {
          rail.setPointerCapture(pointerId);
        } catch (_) {}
      }
      e.preventDefault();
      rail.scrollLeft = startScroll - dx;
    });
    function endDrag(e) {
      if (!dragCandidate && !dragging) return;
      if (pointerId != null && e.pointerId !== pointerId) return;
      var wasDragging = dragging;
      dragCandidate = false;
      dragging = false;
      pointerId = null;
      rail.classList.remove("is-dragging");
      try {
        if (wasDragging) rail.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
    rail.addEventListener("pointerup", endDrag);
    rail.addEventListener("pointercancel", endDrag);
    rail.addEventListener("click", function (e) {
      if (!suppressShotClick) return;
      if (e.target.closest && e.target.closest(".work-shot-link")) {
        e.preventDefault();
        e.stopPropagation();
      }
      suppressShotClick = false;
    }, true);
  }

  /* Approach accordion (keyboard / touch; hover handled in CSS) */
  document.querySelectorAll(".approach-trigger").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".approach-item");
      if (!item) return;
      var open = item.classList.contains("is-open");
      document.querySelectorAll(".approach-item.is-open").forEach(function (el) {
        el.classList.remove("is-open");
        var t = el.querySelector(".approach-trigger");
        if (t) t.setAttribute("aria-expanded", "false");
      });
      if (!open) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
})();
