(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.classList.add("js-ready");

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Header border on scroll */
  var header = document.querySelector(".site-header");
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* Scroll reveals */
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
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
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

  /* Hero canvas — soft mesh field */
  var canvas = document.getElementById("hero-canvas");
  if (canvas && canvas.getContext && !reduceMotion) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var nodes = [];
    var raf = 0;
    var t0 = performance.now();

    function resize() {
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed(w, h);
    }

    function seed(w, h) {
      var count = Math.max(16, Math.floor((w * h) / 38000));
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
      for (var a = 0; a < nodes.length; a++) {
        for (var b = a + 1; b < nodes.length; b++) {
          var dx = nodes[a].x - nodes[b].x;
          var dy = nodes[a].y - nodes[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            var alpha = (1 - dist / 130) * 0.16;
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

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(frame);
  } else if (canvas && reduceMotion) {
    canvas.style.display = "none";
  }

  /* Magnetic CTAs removed — motion craft lives in reveals + work rail */

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
    /* Steady crawl — transform avoids scrollLeft jank */
    var SPEED = 32;
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
        clone.setAttribute("aria-hidden", "true");
        clone.setAttribute("inert", "");
        clone.querySelectorAll("a").forEach(function (a) {
          a.setAttribute("tabindex", "-1");
        });
        track.appendChild(clone);
      });
    }

    function tick(ts) {
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
      requestAnimationFrame(tick);
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

    var startX = 0;
    var startOffset = 0;

    rail.addEventListener("pointerdown", function (e) {
      if (e.target.closest && e.target.closest("a,button")) return;
      dragging = true;
      settling = false;
      paused = true;
      startX = e.clientX;
      startOffset = x;
      rail.classList.add("is-dragging");
      rail.setPointerCapture(e.pointerId);
    });
    rail.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      x = startOffset - (e.clientX - startX);
      x = wrapX(x);
      apply();
      syncDots();
    });
    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      rail.classList.remove("is-dragging");
      try {
        rail.releasePointerCapture(e.pointerId);
      } catch (_) {}
      paused = false;
      lastTs = 0;
    }
    rail.addEventListener("pointerup", endDrag);
    rail.addEventListener("pointercancel", endDrag);

    rail.addEventListener("mouseenter", function () {
      if (!dragging && !settling) paused = true;
    });
    rail.addEventListener("mouseleave", function () {
      if (!dragging && !settling) {
        paused = false;
        lastTs = 0;
      }
    });
    rail.addEventListener("focusin", function () {
      paused = true;
    });
    rail.addEventListener("focusout", function () {
      if (!rail.contains(document.activeElement) && !dragging && !settling) {
        paused = false;
        lastTs = 0;
      }
    });

    requestAnimationFrame(tick);
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
