(function () {
    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
    document.documentElement.classList.add("is-ready");

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var glow = document.querySelector(".cursor-glow");
    var bar = document.querySelector(".scroll-progress");
    var world = document.querySelector("[data-city]");
    var far = document.querySelector(".city__far");
    var mid = document.querySelector(".city__mid");
    var districts = document.querySelectorAll(".district");

    if (!reduce && glow) {
        var x = window.innerWidth / 2;
        var y = window.innerHeight * 0.28;
        var tx = x;
        var ty = y;
        var ticking = false;

        function paint() {
            x += (tx - x) * 0.12;
            y += (ty - y) * 0.12;
            glow.style.transform = "translate3d(" + x + "px, " + y + "px, 0)";
            ticking = false;
        }

        window.addEventListener("pointermove", function (e) {
            tx = e.clientX;
            ty = e.clientY;
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(paint);
            }
        }, { passive: true });

        paint();
    }

    if (bar) {
        function onScroll() {
            var max = document.documentElement.scrollHeight - window.innerHeight;
            var p = max > 0 ? window.scrollY / max : 0;
            bar.style.transform = "scaleX(" + Math.min(1, Math.max(0, p)) + ")";
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    }

    if (!reduce && world && far && window.matchMedia("(min-width: 861px)").matches) {
        var px = 0;
        var py = 0;
        var ptx = 0;
        var pty = 0;
        var pTick = false;

        function parallax() {
            px += (ptx - px) * 0.08;
            py += (pty - py) * 0.08;
            far.style.transform = "translate3d(" + (px * -18) + "px, " + (py * -8) + "px, 0)";
            if (mid) mid.style.transform = "translate3d(" + (px * -10) + "px, 0, 0)";
            pTick = false;
        }

        world.addEventListener("pointermove", function (e) {
            var r = world.getBoundingClientRect();
            ptx = (e.clientX - r.left) / r.width - 0.5;
            pty = (e.clientY - r.top) / r.height - 0.5;
            if (!pTick) {
                pTick = true;
                requestAnimationFrame(parallax);
            }
        }, { passive: true });
    }

    var coarse = window.matchMedia("(hover: none)").matches;
    var wide = window.matchMedia("(min-width: 861px)");
    var avenueMq = window.matchMedia("(max-width: 860px)");
    var stage = document.querySelector("[data-stage]");
    var paceNow = document.querySelector("[data-pace-now]");
    var dots = document.querySelectorAll(".city__dots [data-jump]");

    if (coarse && districts.length && wide.matches) {
        districts.forEach(function (el) {
            el.addEventListener("click", function (e) {
                if (!el.classList.contains("is-lit")) {
                    e.preventDefault();
                    districts.forEach(function (d) { d.classList.remove("is-lit"); });
                    el.classList.add("is-lit");
                    if (world) world.classList.add("is-inspecting");
                }
            });
        });
        document.addEventListener("click", function (e) {
            if (world && !world.contains(e.target)) {
                districts.forEach(function (d) { d.classList.remove("is-lit"); });
                world.classList.remove("is-inspecting");
            }
        });
    }

    if (stage && districts.length && avenueMq.matches) {
        var active = 0;
        var dragging = false;
        var startX = 0;

        function light(index) {
            if (index < 0 || index >= districts.length) return;
            active = index;
            districts.forEach(function (d, i) {
                d.classList.toggle("is-lit", i === index);
            });
            if (world) world.classList.add("is-inspecting");
            if (paceNow) paceNow.textContent = districts[index].getAttribute("data-idx") || String(index + 1).padStart(2, "0");
            dots.forEach(function (btn, i) {
                if (i === index) btn.setAttribute("aria-current", "true");
                else btn.removeAttribute("aria-current");
            });
        }

        function nearest() {
            var mid = stage.scrollLeft + stage.clientWidth / 2;
            var best = 0;
            var bestDist = Infinity;
            districts.forEach(function (d, i) {
                var center = d.offsetLeft + d.offsetWidth / 2;
                var dist = Math.abs(center - mid);
                if (dist < bestDist) {
                    bestDist = dist;
                    best = i;
                }
            });
            return best;
        }

        function onAvenueScroll() {
            light(nearest());
            if (!reduce && far) {
                var max = stage.scrollWidth - stage.clientWidth;
                var p = max > 0 ? stage.scrollLeft / max : 0;
                far.style.transform = "translate3d(" + (p * -28) + "px, 0, 0)";
                if (mid) mid.style.transform = "translate3d(" + (p * -14) + "px, 0, 0)";
            }
        }

        stage.addEventListener("scroll", onAvenueScroll, { passive: true });

        districts.forEach(function (el) {
            el.addEventListener("pointerdown", function (e) {
                dragging = false;
                startX = e.clientX;
            });
            el.addEventListener("pointermove", function (e) {
                if (Math.abs(e.clientX - startX) > 12) dragging = true;
            });
            el.addEventListener("click", function (e) {
                if (dragging) {
                    e.preventDefault();
                    dragging = false;
                }
            });
        });

        function goTo(index) {
            var d = districts[index];
            if (!d) return;
            var left = d.offsetLeft - (stage.clientWidth - d.offsetWidth) / 2;
            stage.scrollLeft = Math.max(0, left);
            light(index);
        }

        dots.forEach(function (btn) {
            btn.addEventListener("click", function () {
                goTo(Number(btn.getAttribute("data-jump")));
            });
        });

        light(0);
        onAvenueScroll();
    }

    if (!reduce && "IntersectionObserver" in window) {
        var chips = document.querySelectorAll(".chips li");
        chips.forEach(function (el, i) {
            el.style.setProperty("--i", String(i));
        });
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-in");
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        document.querySelectorAll(".chips").forEach(function (el) { io.observe(el); });
    } else {
        document.querySelectorAll(".chips").forEach(function (el) {
            el.classList.add("is-in");
        });
    }
})();
