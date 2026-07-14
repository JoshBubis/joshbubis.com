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
      var count = Math.max(28, Math.floor((w * h) / 22000));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 1.4 + Math.random() * 3.2,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
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
          if (dist < 160) {
            var alpha = (1 - dist / 160) * 0.32;
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
        ctx.fillStyle = "rgba(11, 11, 12, 0.42)";
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

  /* Magnetic CTAs */
  if (!reduceMotion) {
    document.querySelectorAll("[data-magnetic]").forEach(function (btn) {
      var strength = 18;
      btn.addEventListener("pointermove", function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform =
          "translate(" + (x / rect.width) * strength + "px, " + (y / rect.height) * strength + "px)";
      });
      btn.addEventListener("pointerleave", function () {
        btn.style.transform = "translate(0, 0)";
      });
    });
  }

  /* Work rail: progress + drag + slow auto-cycle */
  var rail = document.getElementById("work-rail");
  var progress = document.getElementById("work-progress-bar");
  if (rail) {
    var panels = function () {
      return Array.prototype.slice.call(rail.querySelectorAll(".work-panel"));
    };
    var cycleIndex = 0;
    var cycleTimer = null;
    var paused = false;
    var CYCLE_MS = 5200;

    function updateProgress() {
      if (!progress) return;
      var max = rail.scrollWidth - rail.clientWidth;
      var pct = max > 0 ? (rail.scrollLeft / max) * 100 : 0;
      progress.style.width = pct + "%";
    }

    function nearestIndex() {
      var list = panels();
      if (!list.length) return 0;
      var left = rail.scrollLeft;
      var best = 0;
      var bestDist = Infinity;
      for (var i = 0; i < list.length; i++) {
        var dist = Math.abs(list[i].offsetLeft - left);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      return best;
    }

    function goTo(i, behavior) {
      var list = panels();
      if (!list.length) return;
      cycleIndex = ((i % list.length) + list.length) % list.length;
      list[cycleIndex].scrollIntoView({
        behavior: behavior || (reduceMotion ? "auto" : "smooth"),
        inline: "start",
        block: "nearest"
      });
    }

    function stopCycle() {
      if (cycleTimer) {
        clearInterval(cycleTimer);
        cycleTimer = null;
      }
    }

    function startCycle() {
      stopCycle();
      if (reduceMotion) return;
      if (panels().length < 2) return;
      cycleTimer = setInterval(function () {
        if (paused || document.hidden) return;
        goTo(cycleIndex + 1);
      }, CYCLE_MS);
    }

    function pauseCycle() {
      paused = true;
    }

    function resumeCycle() {
      paused = false;
      cycleIndex = nearestIndex();
    }

    rail.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    var dragging = false;
    var startX = 0;
    var startScroll = 0;

    rail.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch") return;
      if (e.target.closest && e.target.closest("a")) return;
      dragging = true;
      pauseCycle();
      startX = e.clientX;
      startScroll = rail.scrollLeft;
      rail.classList.add("is-dragging");
      rail.setPointerCapture(e.pointerId);
    });
    rail.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      rail.scrollLeft = startScroll - (e.clientX - startX);
    });
    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      rail.classList.remove("is-dragging");
      cycleIndex = nearestIndex();
      try {
        rail.releasePointerCapture(e.pointerId);
      } catch (_) {}
      resumeCycle();
    }
    rail.addEventListener("pointerup", endDrag);
    rail.addEventListener("pointercancel", endDrag);

    rail.addEventListener("mouseenter", pauseCycle);
    rail.addEventListener("mouseleave", function () {
      if (!dragging) resumeCycle();
    });
    rail.addEventListener("focusin", pauseCycle);
    rail.addEventListener("focusout", function () {
      if (!rail.contains(document.activeElement)) resumeCycle();
    });
    rail.addEventListener("touchstart", pauseCycle, { passive: true });
    rail.addEventListener("touchend", function () {
      cycleIndex = nearestIndex();
      resumeCycle();
    }, { passive: true });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) pauseCycle();
      else resumeCycle();
    });

    startCycle();
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
