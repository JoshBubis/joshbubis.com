(function () {
    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
    document.documentElement.classList.add("is-ready");

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var glow = document.querySelector(".cursor-glow");
    var bar = document.querySelector(".scroll-progress");

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
