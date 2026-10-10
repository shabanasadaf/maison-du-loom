const menuButton = document.querySelector(".menu-toggle");
const navigationLinks = document.querySelector(".nav-links");
const siteHeader = document.querySelector(".site-header");

if (siteHeader) {
  const updateHeader = () => siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

if (menuButton && navigationLinks) {
  const closeMenu = (returnFocus = false) => {
    navigationLinks.classList.remove("active");
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
    if (returnFocus) menuButton.focus();
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    navigationLinks.classList.toggle("active", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  });

  navigationLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      closeMenu(true);
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".navigation") && menuButton.getAttribute("aria-expanded") === "true") {
      closeMenu();
    }
  });
}

const revealTargets = document.querySelectorAll(
  ".intro-copy, .collection-card, .craft-image-wrap, .craft-copy, .craft-list article, .materials-intro, .materials-list article, .material-image, .atelier-image, .atelier-copy, .why-heading, .why-list article, .journal-top, .journal-image, .journal-copy, .quote-section, .closing-content, .contact-copy, .enquiry-card"
);

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.classList.add("reveal-ready");
  revealTargets.forEach((element, index) => {
    element.dataset.reveal = "";
    element.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });

  revealTargets.forEach((element) => revealObserver.observe(element));
}

// This static site opens a draft for the visitor to review; it does not send the enquiry.
const tradeForm = document.getElementById("trade-enquiry-form");
const tradeStatus = document.getElementById("trade-form-status");
const tradeFallback = document.getElementById("trade-whatsapp-fallback");

if (tradeForm && tradeStatus && tradeFallback) {
  tradeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = new FormData(tradeForm);
    const lines = [
      "Catalogue and private consultation request for Maison du Loom",
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
      tradeStatus.textContent = "WhatsApp opened with your catalogue request. Review the details and press Send there.";
    } else {
      tradeFallback.hidden = false;
      tradeStatus.textContent = "Your catalogue request is ready. Use the link below to open WhatsApp and review it before sending.";
    }
  });
}
