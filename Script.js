(function () {
  "use strict";

  const navbar = document.getElementById("navbar");
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  const links = Array.from(document.querySelectorAll(".nav-link"));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  }

  toggle.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  function goTo(hash) {
    const target = document.querySelector(hash);
    if (!target) return;

    const offset = navbar.offsetHeight;
    const top = hash === "#inicio"
      ? 0
      : target.getBoundingClientRect().top + window.pageYOffset - offset - 16;

    window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    history.replaceState(null, "", hash);
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const hash = a.getAttribute("href");
      if (hash.length < 2) return;
      e.preventDefault();
      setMenu(false);
      goTo(hash);
    });
  });

  function setActive(id) {
    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
    });
  }

  function updateActive() {
    const marker = navbar.offsetHeight + window.innerHeight * 0.25;
    let current = sections[0] ? sections[0].id : "";

    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= marker) current = section.id;
    });

    if (window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 4) {
      current = sections[sections.length - 1].id;
    }

    setActive(current);
  }

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateActive();
      ticking = false;
    });
  }, { passive: true });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) setMenu(false);
    updateActive();
  });

  updateActive();

  if (location.hash) {
    window.addEventListener("load", () => goTo(location.hash));
  }
})();