// Enable progressive enhancements only when this script is available.
document.documentElement.classList.add("js");

const loader = document.getElementById("loader");
const reveals = document.querySelectorAll(".reveal");
const nav = document.querySelector("nav");
const hero = document.querySelector(".hero");
const toggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Reveal sections as they enter view. Without JavaScript, all sections remain visible.
if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  reveals.forEach((el) => el.classList.add("active"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -80px 0px" });

  reveals.forEach((el) => revealObserver.observe(el));
}

// Keep scroll effects lightweight and usable on touch devices.
function updateScrollEffects() {
  if (nav) {
    nav.classList.toggle("shrink", window.scrollY > 50);
  }

  if (hero && !prefersReducedMotion) {
    hero.style.backgroundPositionY =
      window.innerWidth > 768 ? String(window.scrollY * 0.4) + "px" : "center";
  }
}

window.addEventListener("scroll", updateScrollEffects, { passive: true });
window.addEventListener("resize", updateScrollEffects);
updateScrollEffects();

// Dismiss the decorative loader after the document is parsed; do not wait for
// every full-size image or external resource to finish downloading.
if (loader) {
  document.body.classList.add("loading");

  const hideLoader = () => {
    window.setTimeout(() => {
      loader.style.opacity = "0";
      window.setTimeout(() => {
        loader.style.display = "none";
        loader.setAttribute("aria-hidden", "true");
        document.body.classList.remove("loading");
      }, 600);
    }, 100);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hideLoader, { once: true });
  } else {
    hideLoader();
  }
}

// Accessible mobile navigation.
if (toggle && navLinks) {
  const closeMenu = (returnFocus = false) => {
    navLinks.classList.remove("active");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    toggle.textContent = "☰";
    if (returnFocus) toggle.focus();
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMenu();
    } else {
      navLinks.classList.add("active");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      toggle.textContent = "×";
    }
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      closeMenu(true);
    }
  });
}

// GitHub Pages is static, so prepare a WhatsApp draft instead of posting to a server.
const tradeForm = document.getElementById("trade-enquiry-form");
const tradeStatus = document.getElementById("trade-form-status");
const tradeFallback = document.getElementById("trade-whatsapp-fallback");

if (tradeForm && tradeStatus && tradeFallback) {
  tradeForm.hidden = false;

  tradeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = new FormData(tradeForm);
    const lines = [
      "Trade enquiry for Maison du Loom",
      "Name: " + fields.get("name"),
      "Email: " + fields.get("email"),
      "Destination country: " + fields.get("destination")
    ];

    [
      ["Company", fields.get("company")],
      ["Carpet construction", fields.get("construction")],
      ["Approximate size", fields.get("size")],
      ["Approximate quantity", fields.get("quantity")],
      ["Target timeline", fields.get("timeline")],
      ["Project details", fields.get("project")]
    ].forEach(([label, value]) => {
      if (value && String(value).trim()) lines.push(label + ": " + String(value).trim());
    });

    const whatsappUrl = "https://wa.me/917275938382?text=" + encodeURIComponent(lines.join("\n"));
    tradeFallback.href = whatsappUrl;
    const whatsappWindow = window.open(whatsappUrl, "_blank");

    if (whatsappWindow) {
      whatsappWindow.opener = null;
      tradeFallback.hidden = true;
      tradeStatus.textContent = "WhatsApp opened with your draft. Review the details and press Send there.";
    } else {
      tradeFallback.hidden = false;
      tradeStatus.textContent = "Your draft is ready. Use the link below to open WhatsApp and review it before sending.";
    }
  });
}
