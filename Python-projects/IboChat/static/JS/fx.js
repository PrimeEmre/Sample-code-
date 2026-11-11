/* IboChat visual layer, behaviour part. Two small things, both optional:
   1. Scroll reveal for elements marked class="fx-reveal". The elements stay visible if JavaScript fails, if
      IntersectionObserver is missing, if the visitor prefers reduced motion, and (as a fallback for crawlers
      and slow devices) after 2.5 s.
   2. Mouse spotlight: sets --mx / --my on a .card while the mouse moves over it (the highlight itself is CSS).
      Skipped for touch screens and for reduced motion. */
(function () {
    'use strict';
    var mq = window.matchMedia ? window.matchMedia.bind(window) : null;
    var reduced = mq && mq('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    /* 2. spotlight (cheap: one rAF-throttled handler per card) */
    if (mq && mq('(hover: hover) and (pointer: fine)').matches) {
        document.querySelectorAll('.card').forEach(function (card) {
            var frame = null, x = 0, y = 0;
            card.addEventListener('mousemove', function (e) {
                var r = card.getBoundingClientRect();
                x = e.clientX - r.left;
                y = e.clientY - r.top;
                if (frame) return;
                frame = requestAnimationFrame(function () {
                    card.style.setProperty('--mx', x + 'px');
                    card.style.setProperty('--my', y + 'px');
                    frame = null;
                });
            });
        });
    }

    /* 1. scroll reveal */
    if (!('IntersectionObserver' in window)) return;
    var targets = document.querySelectorAll('.fx-reveal');
    if (!targets.length) return;
    document.documentElement.classList.add('fx-ready');

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    targets.forEach(function (el) { io.observe(el); });

    setTimeout(function () {
        targets.forEach(function (el) { el.classList.add('is-visible'); });
    }, 2500);
})();
