const nav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
const navCollapse = document.getElementById("mainNav");
const sectionNavItems = Array.from(navLinks)
  .map((link) => ({
    link,
    id: link.hash ? link.hash.slice(1) : "",
    section: link.hash ? document.querySelector(link.hash) : null
  }))
  .filter((item) => item.id && item.section);
const siteLoader = document.getElementById("siteLoader");
const loaderTitle = siteLoader?.querySelector(".loader-title-shell");
const brandLockup = document.querySelector(".brand-lockup");
const scrollBar = document.getElementById("scrollBar");
const scrollNode = document.getElementById("scrollNode");
const productCards = document.querySelectorAll(".product-card");
const emailForm = document.getElementById("emailForm");
const emailStatus = document.getElementById("emailStatus");
const revealItems = document.querySelectorAll("[data-reveal]");
const heroStage = document.querySelector(".hero-stage");
const parallaxItems = heroStage ? heroStage.querySelectorAll("[data-parallax]") : [];

const contactEmail = "contacto@bysing.com";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.body.classList.add("is-loading");

const createLucideIcons = () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
};

createLucideIcons();

let loaderHidden = false;
const loaderStartedAt = window.performance ? window.performance.now() : Date.now();
const minimumLoaderTime = prefersReducedMotion.matches ? 120 : 2500;
const maximumLoaderTime = prefersReducedMotion.matches ? 700 : 5200;

const finishLoader = () => {
  siteLoader?.classList.add("is-hidden");
  brandLockup?.classList.remove("is-loader-target");
  document.body.classList.remove("is-loading");
};

const hideLoader = () => {
  if (loaderHidden) {
    return;
  }

  loaderHidden = true;

  if (!siteLoader || !loaderTitle || !brandLockup || prefersReducedMotion.matches) {
    finishLoader();
    return;
  }

  const sourceRect = loaderTitle.getBoundingClientRect();
  const targetRect = brandLockup.getBoundingClientRect();
  const sourceCenterX = sourceRect.left + sourceRect.width / 2;
  const sourceCenterY = sourceRect.top + sourceRect.height / 2;
  const targetCenterX = targetRect.left + targetRect.width / 2;
  const targetCenterY = targetRect.top + targetRect.height / 2;
  const targetScale = Math.max(0.22, Math.min(0.42, targetRect.height / sourceRect.height));

  siteLoader.style.setProperty("--loader-exit-x", `${targetCenterX - sourceCenterX}px`);
  siteLoader.style.setProperty("--loader-exit-y", `${targetCenterY - sourceCenterY}px`);
  siteLoader.style.setProperty("--loader-exit-scale", targetScale.toFixed(3));

  brandLockup.classList.add("is-loader-target");
  document.body.classList.remove("is-loading");
  siteLoader.classList.add("is-leaving");

  window.setTimeout(finishLoader, 1450);
};

const scheduleLoaderHide = () => {
  const now = window.performance ? window.performance.now() : Date.now();
  const elapsed = now - loaderStartedAt;
  const remaining = Math.max(0, minimumLoaderTime - elapsed);

  window.setTimeout(hideLoader, remaining);
};

window.addEventListener("load", () => {
  createLucideIcons();
  scheduleLoaderHide();
});

window.setTimeout(hideLoader, maximumLoaderTime);

const updateScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  const clamped = Math.max(0, Math.min(100, progress));

  if (scrollBar) {
    scrollBar.style.width = `${clamped}%`;
  }

  if (scrollNode) {
    scrollNode.style.left = `${clamped}%`;
  }
};

let activeSectionId = "";

const setActiveNavItem = (sectionId) => {
  if (activeSectionId === sectionId) {
    return;
  }

  activeSectionId = sectionId;

  sectionNavItems.forEach(({ link, id }) => {
    const isActive = id === sectionId;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const updateActiveNavItem = () => {
  if (!sectionNavItems.length) {
    return;
  }

  const navOffset = (nav?.offsetHeight || 86) + 90;
  const scrollPosition = window.scrollY + navOffset;
  let currentId = "";

  sectionNavItems.forEach(({ id, section }) => {
    if (section.offsetTop <= scrollPosition) {
      currentId = id;
    }
  });

  const isAtPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  if (isAtPageEnd) {
    currentId = sectionNavItems[sectionNavItems.length - 1].id;
  }

  setActiveNavItem(currentId);
};

const updateNav = () => {
  if (!nav) {
    return;
  }

  nav.classList.toggle("is-scrolled", window.scrollY > 14);
  updateScrollProgress();
  updateActiveNavItem();
};

updateNav();
window.addEventListener("scroll", updateNav, { passive: true });

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (link.hash) {
      setActiveNavItem(link.hash.slice(1));
    }

    if (!navCollapse || !window.bootstrap) {
      return;
    }

    const instance = window.bootstrap.Collapse.getInstance(navCollapse);
    if (instance) {
      instance.hide();
    }
  });
});

productCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    card.style.setProperty("--card-glow-x", `${x}%`);
    card.style.setProperty("--card-glow-y", `${y}%`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.removeProperty("--card-glow-x");
    card.style.removeProperty("--card-glow-y");
  });
});

if (revealItems.length) {
  if (prefersReducedMotion.matches) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -12% 0px"
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }
}

if (heroStage && parallaxItems.length && !prefersReducedMotion.matches) {
  let frameId = null;
  let currentX = 0;
  let currentY = 0;

  const applyParallax = () => {
    parallaxItems.forEach((item) => {
      const depth = Number(item.dataset.parallax || 0.08);
      const translateX = currentX * depth * 42;
      const translateY = currentY * depth * 34;
      item.style.setProperty("--parallax-x", `${translateX}px`);
      item.style.setProperty("--parallax-y", `${translateY}px`);
    });

    frameId = null;
  };

  const scheduleParallax = () => {
    if (frameId) {
      return;
    }

    frameId = window.requestAnimationFrame(applyParallax);
  };

  heroStage.addEventListener("pointermove", (event) => {
    const bounds = heroStage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    currentX = x - 0.5;
    currentY = y - 0.5;
    scheduleParallax();
  });

  heroStage.addEventListener("pointerleave", () => {
    currentX = 0;
    currentY = 0;
    scheduleParallax();
  });
}

const fieldValue = (form, name) => {
  const field = form.elements[name];
  return field ? field.value.trim() : "";
};

emailForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  emailForm.classList.add("was-validated");

  if (!emailForm.checkValidity()) {
    emailStatus.textContent = "Completa los campos requeridos para preparar el correo.";
    return;
  }

  const name = fieldValue(emailForm, "name");
  const company = fieldValue(emailForm, "company") || "No especificada";
  const need = fieldValue(emailForm, "need");
  const message = fieldValue(emailForm, "message");
  const subject = encodeURIComponent(`Solicitud web BYSING - ${need}`);
  const body = encodeURIComponent(
    [
      "Hola BYSING, quiero información sobre sus servicios.",
      `Nombre: ${name}`,
      `Empresa: ${company}`,
      `Necesidad: ${need}`,
      `Mensaje: ${message}`
    ].join("\n")
  );

  emailStatus.textContent = "Abriendo tu correo con la solicitud preparada.";
  window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
});
