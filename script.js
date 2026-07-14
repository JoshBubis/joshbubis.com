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

  /* Work rail: slow continuous drift + dots */
  var rail = document.getElementById("work-rail");
  var dotsHost = document.getElementById("work-dots");
  if (rail) {
    var panels = function () {
      return Array.prototype.slice.call(rail.querySelectorAll(".work-panel"));
    };
    var paused = false;
    var dragging = false;
    var rafId = 0;
    var lastTs = 0;
    /* ~28px/s — a full panel drifts past in ~15–18s */
    var SPEED = 28;
    var activeIndex = 0;
    var dots = [];

    function maxScroll() {
      return Math.max(0, rail.scrollWidth - rail.clientWidth);
    }

    function nearestIndex() {
      var list = panels();
      if (!list.length) return 0;
      var left = rail.scrollLeft + rail.clientWidth * 0.28;
      var best = 0;
      var bestDist = Infinity;
      for (var i = 0; i < list.length; i++) {
        var center = list[i].offsetLeft + list[i].offsetWidth / 2;
        var dist = Math.abs(center - left);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      return best;
    }

    function syncDots() {
      var next = nearestIndex();
      if (next === activeIndex) return;
      activeIndex = next;
      for (var i = 0; i < dots.length; i++) {
        dots[i].classList.toggle("is-active", i === activeIndex);
        dots[i].setAttribute("aria-selected", i === activeIndex ? "true" : "false");
      }
    }

    function buildDots() {
      if (!dotsHost) return;
      dotsHost.innerHTML = "";
      dots = panels().map(function (panel, i) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "work-dot" + (i === 0 ? " is-active" : "");
        btn.setAttribute("role", "tab");
        btn.setAttribute("aria-label", (panel.querySelector(".work-name") || {}).textContent || ("Project " + (i + 1)));
        btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
        btn.addEventListener("click", function () {
          paused = true;
          var delta = panel.getBoundingClientRect().left - rail.getBoundingClientRect().left;
          rail.scrollTo({
            left: rail.scrollLeft + delta,
            behavior: reduceMotion ? "auto" : "smooth"
          });
          setTimeout(function () {
            paused = false;
            lastTs = 0;
          }, 2400);
        });
        dotsHost.appendChild(btn);
        return btn;
      });
    }

    function tick(ts) {
      if (!lastTs) lastTs = ts;
      var dt = Math.min(48, ts - lastTs);
      lastTs = ts;

      if (!paused && !dragging && !document.hidden && !reduceMotion) {
        var max = maxScroll();
        if (max > 4) {
          var next = rail.scrollLeft + SPEED * (dt / 1000);
          if (next >= max - 0.5) {
            rail.scrollLeft = 0;
          } else {
            rail.scrollLeft = next;
          }
        }
      }

      syncDots();
      rafId = requestAnimationFrame(tick);
    }

    buildDots();
    rail.addEventListener("scroll", syncDots, { passive: true });

    var startX = 0;
    var startScroll = 0;

    rail.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch") return;
      if (e.target.closest && e.target.closest("a,button")) return;
      dragging = true;
      paused = true;
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
      try {
        rail.releasePointerCapture(e.pointerId);
      } catch (_) {}
      paused = false;
      lastTs = 0;
    }
    rail.addEventListener("pointerup", endDrag);
    rail.addEventListener("pointercancel", endDrag);

    rail.addEventListener("mouseenter", function () {
      paused = true;
    });
    rail.addEventListener("mouseleave", function () {
      if (!dragging) {
        paused = false;
        lastTs = 0;
      }
    });
    rail.addEventListener("focusin", function () {
      paused = true;
    });
    rail.addEventListener("focusout", function () {
      if (!rail.contains(document.activeElement) && !dragging) {
        paused = false;
        lastTs = 0;
      }
    });
    rail.addEventListener("touchstart", function () {
      paused = true;
    }, { passive: true });
    rail.addEventListener("touchend", function () {
      paused = false;
      lastTs = 0;
    }, { passive: true });

    if (!reduceMotion) {
      rafId = requestAnimationFrame(tick);
    } else {
      syncDots();
    }
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
