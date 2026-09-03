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
    if (coarse && districts.length && window.matchMedia("(min-width: 861px)").matches) {
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
