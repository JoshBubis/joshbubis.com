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

  /* Hero canvas — pause when offscreen so page scroll stays smooth */
  var canvas = document.getElementById("hero-canvas");
  if (canvas && canvas.getContext && !reduceMotion) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var nodes = [];
    var raf = 0;
    var t0 = performance.now();
    var canvasVisible = true;

    function resize() {
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed(w, h);
    }

    function seed(w, h) {
      var count = Math.max(12, Math.floor((w * h) / 48000));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 1.1 + Math.random() * 2.2,
          vx: (Math.random() - 0.5) * 0.16,
          vy: (Math.random() - 0.5) * 0.16,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    function frame(now) {
      raf = 0;
      if (!canvasVisible) return;

      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      var t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);

      var g = ctx.createRadialGradient(w * 0.78, h * 0.28, 0, w * 0.78, h * 0.28, w * 0.55);
      g.addColorStop(0, "rgba(200, 30, 30, 0.18)");
      g.addColorStop(0.55, "rgba(200, 30, 30, 0.05)");
      g.addColorStop(1, "rgba(200, 30, 30, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      var g2 = ctx.createRadialGradient(w * 0.15, h * 0.75, 0, w * 0.15, h * 0.75, w * 0.45);
      g2.addColorStop(0, "rgba(11, 11, 12, 0.06)");
      g2.addColorStop(1, "rgba(11, 11, 12, 0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx + Math.sin(t * 0.45 + n.phase) * 0.08;
        n.y += n.vy + Math.cos(t * 0.4 + n.phase) * 0.08;
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        if (n.y > h + 20) n.y = -20;
      }

      ctx.lineWidth = 1.1;
      var linkDist = 120;
      for (var a = 0; a < nodes.length; a++) {
        for (var b = a + 1; b < nodes.length; b++) {
          var dx = nodes[a].x - nodes[b].x;
          var dy = nodes[a].y - nodes[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDist) {
            var alpha = (1 - dist / linkDist) * 0.16;
            ctx.strokeStyle = "rgba(11, 11, 12, " + alpha + ")";
            ctx.beginPath();
            ctx.moveTo(nodes[a].x, nodes[a].y);
            ctx.lineTo(nodes[b].x, nodes[b].y);
            ctx.stroke();
          }
        }
      }

      for (var j = 0; j < nodes.length; j++) {
        var p = nodes[j];
        ctx.beginPath();
        ctx.fillStyle = "rgba(11, 11, 12, 0.28)";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    }

    function startCanvas() {
      if (!raf) raf = requestAnimationFrame(frame);
    }

    function stopCanvas() {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    resize();
    window.addEventListener("resize", resize);
    if ("IntersectionObserver" in window) {
      var canvasIo = new IntersectionObserver(
        function (entries) {
          canvasVisible = entries.some(function (e) {
            return e.isIntersecting;
          });
          if (canvasVisible) startCanvas();
          else stopCanvas();
        },
        { rootMargin: "10% 0px", threshold: 0 }
      );
      canvasIo.observe(canvas);
    } else {
      startCanvas();
    }
  } else if (canvas && reduceMotion) {
    canvas.style.display = "none";
  }

  /* Work rail: GPU track drift + working dots */
  var rail = document.getElementById("work-rail");
  var track = document.getElementById("work-track");
  var dotsHost = document.getElementById("work-dots");
  if (rail && track) {
    var originals = Array.prototype.slice.call(track.querySelectorAll(".work-panel"));
    var count = originals.length;
    var x = 0;
    var setWidth = 0;
    var offsets = [];
    var paused = false;
    var dragging = false;
    var settling = false;
    var settleTarget = 0;
    var lastTs = 0;
    var activeIndex = 0;
    var dots = [];
    var railVisible = true;
    var railRaf = 0;
    /* Steady crawl — transform avoids scrollLeft jank */
    var SPEED = 28;
    var SETTLE = 0.12;

    function measure() {
      var origin = originals[0].offsetLeft;
      offsets = originals.map(function (panel) {
        return panel.offsetLeft - origin;
      });
      var last = originals[count - 1];
      var gap = 20;
      if (count > 1) {
        gap = originals[1].offsetLeft - originals[0].offsetLeft - originals[0].offsetWidth;
      }
      /* One full set including the gap before the cloned first panel */
      setWidth = last.offsetLeft - origin + last.offsetWidth + gap;
    }

    function wrapX(v) {
      if (setWidth <= 0) return 0;
      v = v % setWidth;
      if (v < 0) v += setWidth;
      return v;
    }

    function apply() {
      track.style.transform = "translate3d(" + (-x).toFixed(2) + "px,0,0)";
    }

    function syncDots() {
      if (!count || setWidth <= 0) return;
      var probe = wrapX(x + rail.clientWidth * 0.22);
      var best = 0;
      var bestDist = Infinity;
      for (var i = 0; i < count; i++) {
        var dist = Math.abs(offsets[i] - probe);
        var distWrap = Math.abs(offsets[i] + setWidth - probe);
        var d = Math.min(dist, distWrap);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      if (best === activeIndex) return;
      activeIndex = best;
      for (var d = 0; d < dots.length; d++) {
        dots[d].classList.toggle("is-active", d === activeIndex);
        dots[d].setAttribute("aria-selected", d === activeIndex ? "true" : "false");
      }
    }

    function goTo(i) {
      if (!count) return;
      i = ((i % count) + count) % count;
      settleTarget = offsets[i];
      /* Pick shortest wrap direction toward target */
      var a = wrapX(x);
      var forward = settleTarget - a;
      if (forward < 0) forward += setWidth;
      var backward = a - settleTarget;
      if (backward < 0) backward += setWidth;
      if (backward < forward) {
        settleTarget = a - backward;
      } else {
        settleTarget = a + forward;
      }
      settling = true;
      paused = true;
      startRail();
    }

    function buildDots() {
      if (!dotsHost) return;
      dotsHost.innerHTML = "";
      dots = originals.map(function (panel, i) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "work-dot" + (i === 0 ? " is-active" : "");
        btn.setAttribute("role", "tab");
        var nameEl = panel.querySelector(".work-name");
        btn.setAttribute("aria-label", (nameEl && nameEl.textContent) || ("Project " + (i + 1)));
        btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
        btn.addEventListener("click", function () {
          goTo(i);
        });
        dotsHost.appendChild(btn);
        return btn;
      });
    }

    function cloneForLoop() {
      originals.forEach(function (panel) {
        var clone = panel.cloneNode(true);
        clone.classList.remove("reveal", "is-in");
        clone.classList.add("work-panel--clone");
        clone.setAttribute("aria-hidden", "true");
        clone.setAttribute("inert", "");
        clone.removeAttribute("data-reveal");
        /* Decorative loop copies must not show up as extra headings/links */
        clone.querySelectorAll("h3").forEach(function (h) {
          var p = document.createElement("p");
          p.className = h.className;
          p.textContent = h.textContent;
          h.replaceWith(p);
        });
        clone.querySelectorAll("a").forEach(function (a) {
          var span = document.createElement("span");
          span.className = "work-link-ghost";
          span.textContent = a.textContent.replace(/\s+/g, " ").trim().split(" ")[0];
          a.replaceWith(span);
        });
        track.appendChild(clone);
      });
    }

    function tick(ts) {
      railRaf = 0;
      if (!railVisible && !dragging && !settling) {
        lastTs = 0;
        return;
      }

      if (!lastTs) lastTs = ts;
      var dt = Math.min(40, ts - lastTs);
      lastTs = ts;

      if (settling) {
        var dx = settleTarget - x;
        x += dx * (reduceMotion ? 1 : SETTLE);
        if (Math.abs(dx) < 0.6) {
          x = wrapX(settleTarget);
          settling = false;
          paused = false;
          lastTs = ts;
        }
      } else if (!paused && !dragging && !document.hidden && !reduceMotion && setWidth > 0) {
        x += SPEED * (dt / 1000);
        if (x >= setWidth) x -= setWidth;
      }

      x = settling ? x : wrapX(x);
      apply();
      syncDots();
      railRaf = requestAnimationFrame(tick);
    }

    function startRail() {
      if (!railRaf) {
        lastTs = 0;
        railRaf = requestAnimationFrame(tick);
      }
    }

    function stopRail() {
      if (railRaf) {
        cancelAnimationFrame(railRaf);
        railRaf = 0;
      }
      lastTs = 0;
    }

    cloneForLoop();
    measure();
    buildDots();
    apply();

    window.addEventListener("resize", function () {
      var idx = activeIndex;
      measure();
      x = offsets[idx] || 0;
      apply();
    });

    if ("IntersectionObserver" in window) {
      var railIo = new IntersectionObserver(
        function (entries) {
          railVisible = entries.some(function (e) {
            return e.isIntersecting;
          });
          if (railVisible || dragging || settling) startRail();
          else stopRail();
        },
        { rootMargin: "12% 0px", threshold: 0 }
      );
      railIo.observe(rail);
    } else {
      startRail();
    }

    var startX = 0;
    var startOffset = 0;
    var pointerId = null;
    var dragCandidate = false;
    var DRAG_THRESHOLD = 8;

    function clearSelection() {
      var sel = window.getSelection && window.getSelection();
      if (sel && sel.removeAllRanges) sel.removeAllRanges();
    }

    function beginDrag(e) {
      if (dragging) return;
      dragging = true;
      dragCandidate = false;
      settling = false;
      paused = true;
      clearSelection();
      rail.classList.add("is-dragging");
      try {
        rail.setPointerCapture(pointerId);
      } catch (_) {}
      startRail();
    }

    rail.addEventListener("pointerdown", function (e) {
      if (e.button != null && e.button !== 0) return;
      if (e.target.closest && e.target.closest("a,button")) return;
      /* Only drag from the screenshot chrome — body text stays selectable */
      if (!(e.target.closest && e.target.closest(".work-shot"))) return;
      /* Pending drag — allow click until the pointer moves enough */
      dragCandidate = true;
      dragging = false;
      pointerId = e.pointerId;
      startX = e.clientX;
      startOffset = x;
      settling = false;
      paused = true;
      lastTs = 0;
    });
    rail.addEventListener("pointermove", function (e) {
      if (!dragCandidate && !dragging) return;
      if (pointerId != null && e.pointerId !== pointerId) return;
      var dx = e.clientX - startX;
      if (dragCandidate && !dragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return;
        beginDrag(e);
      }
      if (!dragging) return;
      e.preventDefault();
      x = startOffset - dx;
      x = wrapX(x);
      apply();
      syncDots();
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
      paused = false;
      lastTs = 0;
      if (railVisible) startRail();
    }
    rail.addEventListener("pointerup", endDrag);
    rail.addEventListener("pointercancel", endDrag);
    rail.addEventListener("lostpointercapture", function () {
      dragCandidate = false;
      if (dragging) {
        dragging = false;
        rail.classList.remove("is-dragging");
        paused = false;
        lastTs = 0;
        if (railVisible) startRail();
      }
    });
    rail.addEventListener("selectstart", function (e) {
      if (dragging) e.preventDefault();
    });

    function step(dir) {
      goTo(activeIndex + dir);
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

    /* Hover should not freeze the rail — only drag/focus/settle pause motion */
    rail.addEventListener("focusin", function () {
      paused = true;
    });
    rail.addEventListener("focusout", function () {
      if (!rail.contains(document.activeElement) && !dragging && !settling && !dragCandidate) {
        paused = false;
        lastTs = 0;
      }
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopRail();
      else if (railVisible) startRail();
    });
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
