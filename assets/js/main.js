const nav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
const navCollapse = document.getElementById("mainNav");
const siteLoader = document.getElementById("siteLoader");
const loaderTitle = siteLoader?.querySelector(".loader-title-shell");
const brandLockup = document.querySelector(".brand-lockup");
const scrollBar = document.getElementById("scrollBar");
const scrollNode = document.getElementById("scrollNode");
const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");
const whatsappForm = document.getElementById("whatsappForm");
const whatsappStatus = document.getElementById("whatsappStatus");
const catalogCounter = document.getElementById("catalogCounter");
const spotlightLabel = document.getElementById("spotlightLabel");
const spotlightTitle = document.getElementById("spotlightTitle");
const spotlightDescription = document.getElementById("spotlightDescription");
const spotlightCategory = document.getElementById("spotlightCategory");
const spotlightImage = document.getElementById("spotlightImage");
const catalogModal = document.getElementById("catalogModal");
const catalogModalClose = document.getElementById("catalogModalClose");
const catalogModalSecondaryClose = document.getElementById("catalogModalSecondaryClose");
const catalogModalLabel = document.getElementById("catalogModalLabel");
const catalogModalTitle = document.getElementById("catalogModalTitle");
const catalogModalDescription = document.getElementById("catalogModalDescription");
const catalogModalCategory = document.getElementById("catalogModalCategory");
const catalogModalImage = document.getElementById("catalogModalImage");
const revealItems = document.querySelectorAll("[data-reveal]");
const heroStage = document.querySelector(".hero-stage");
const parallaxItems = heroStage ? heroStage.querySelectorAll("[data-parallax]") : [];
const catalogOrbitStage = document.querySelector(".catalog-orbit-stage");

const whatsappNumber = "593999457534";
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

const updateNav = () => {
  if (!nav) {
    return;
  }

  nav.classList.toggle("is-scrolled", window.scrollY > 14);
  updateScrollProgress();
};

updateNav();
window.addEventListener("scroll", updateNav, { passive: true });

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (!navCollapse || !window.bootstrap) {
      return;
    }

    const instance = window.bootstrap.Collapse.getInstance(navCollapse);
    if (instance) {
      instance.hide();
    }
  });
});

const updateCatalogCounter = (visibleCount, filter) => {
  if (!catalogCounter) {
    return;
  }

  const label = filter === "all" ? "soluciones activas" : `resultados en ${filter}`;
  catalogCounter.textContent = `${visibleCount} ${label}`;
};

const getCardData = (card) => {
  const categoryLabel = card.querySelector("span")?.textContent?.trim() || "Solucion";
  const title = card.querySelector("h3")?.textContent?.trim() || "";
  const description = card.querySelector("p")?.textContent?.trim() || "";
  const image = card.querySelector("img");

  return {
    categoryLabel,
    title,
    description,
    category: card.dataset.category,
    imageSrc: image?.src || "",
    imageAlt: image?.alt || ""
  };
};

const setSpotlight = (card) => {
  if (!card || !spotlightTitle || !spotlightImage) {
    return;
  }

  const cardData = getCardData(card);

  productCards.forEach((item) => item.classList.remove("is-active"));
  card.classList.add("is-active");

  if (spotlightLabel) {
    spotlightLabel.textContent = cardData.categoryLabel;
  }

  spotlightTitle.textContent = cardData.title;
  spotlightDescription.textContent = cardData.description;

  if (spotlightCategory) {
    spotlightCategory.textContent = cardData.category;
  }

  if (cardData.imageSrc) {
    spotlightImage.src = cardData.imageSrc;
    spotlightImage.alt = cardData.imageAlt;
  }
};

const openCatalogModal = (card) => {
  if (!catalogModal || !catalogModalTitle || !card) {
    return;
  }

  const cardData = getCardData(card);

  if (catalogModalLabel) {
    catalogModalLabel.textContent = cardData.categoryLabel;
  }

  catalogModalTitle.textContent = cardData.title;
  catalogModalDescription.textContent = cardData.description;

  if (catalogModalCategory) {
    catalogModalCategory.textContent = cardData.category;
  }

  if (catalogModalImage && cardData.imageSrc) {
    catalogModalImage.src = cardData.imageSrc;
    catalogModalImage.alt = cardData.imageAlt;
  }

  catalogModal.hidden = false;
  document.body.style.overflow = "hidden";
};

const closeCatalogModal = () => {
  if (!catalogModal) {
    return;
  }

  catalogModal.hidden = true;
  document.body.style.overflow = "";
};

const applyFilter = (filter) => {
  let visibleCount = 0;
  let firstVisibleCard = null;

  productCards.forEach((card) => {
    const categories = card.dataset.category.split(" ");
    const shouldShow = filter === "all" || categories.includes(filter);

    card.classList.toggle("is-hidden", !shouldShow);

    if (shouldShow) {
      visibleCount += 1;
      if (!firstVisibleCard) {
        firstVisibleCard = card;
      }
    }
  });

  updateCatalogCounter(visibleCount, filter);

  const currentActive = document.querySelector(".product-card.is-active:not(.is-hidden)");
  setSpotlight(currentActive || firstVisibleCard);
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    applyFilter(filter);
  });
});

productCards.forEach((card) => {
  card.addEventListener("click", () => setSpotlight(card));
  card.addEventListener("mouseenter", () => {
    if (!prefersReducedMotion.matches) {
      setSpotlight(card);
    }
  });

  const cta = card.querySelector(".product-cta");
  cta?.addEventListener("click", (event) => {
    event.stopPropagation();
    setSpotlight(card);
    openCatalogModal(card);
  });

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

applyFilter("all");

catalogModalClose?.addEventListener("click", closeCatalogModal);
catalogModalSecondaryClose?.addEventListener("click", closeCatalogModal);
catalogModal?.addEventListener("click", (event) => {
  if (event.target === catalogModal) {
    closeCatalogModal();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCatalogModal();
  }
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

if (catalogOrbitStage && !prefersReducedMotion.matches) {
  let catalogFrameId = null;
  let orbitX = 0;
  let orbitY = 0;

  const applyCatalogOrbit = () => {
    catalogOrbitStage.style.setProperty("--orbit-x", `${orbitX.toFixed(2)}deg`);
    catalogOrbitStage.style.setProperty("--orbit-y", `${orbitY.toFixed(2)}deg`);
    catalogFrameId = null;
  };

  const scheduleCatalogOrbit = () => {
    if (catalogFrameId) {
      return;
    }

    catalogFrameId = window.requestAnimationFrame(applyCatalogOrbit);
  };

  catalogOrbitStage.addEventListener("pointermove", (event) => {
    const bounds = catalogOrbitStage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    orbitX = (0.5 - y) * 5;
    orbitY = (x - 0.5) * 7;
    scheduleCatalogOrbit();
  });

  catalogOrbitStage.addEventListener("pointerleave", () => {
    orbitX = 0;
    orbitY = 0;
    scheduleCatalogOrbit();
  });
}

const fieldValue = (form, name) => {
  const field = form.elements[name];
  return field ? field.value.trim() : "";
};

whatsappForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  whatsappForm.classList.add("was-validated");

  if (!whatsappForm.checkValidity()) {
    whatsappStatus.textContent = "Completa los campos requeridos para generar el mensaje.";
    return;
  }

  const name = fieldValue(whatsappForm, "name");
  const company = fieldValue(whatsappForm, "company") || "No especificada";
  const need = fieldValue(whatsappForm, "need");
  const message = fieldValue(whatsappForm, "message");
  const text = encodeURIComponent(
    [
      "Hola BYSING, quiero informacion.",
      `Nombre: ${name}`,
      `Empresa: ${company}`,
      `Necesidad: ${need}`,
      `Mensaje: ${message}`
    ].join("\n")
  );

  whatsappStatus.textContent = "Abriendo WhatsApp con el mensaje preparado.";
  window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank", "noopener,noreferrer");
});
