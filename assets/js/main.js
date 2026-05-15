const nav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
const navCollapse = document.getElementById("mainNav");
const siteLoader = document.getElementById("siteLoader");
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
const revealItems = document.querySelectorAll("[data-reveal]");
const heroStage = document.querySelector(".hero-stage");
const parallaxItems = heroStage ? heroStage.querySelectorAll("[data-parallax]") : [];

const whatsappNumber = "593999457534";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.body.classList.add("is-loading");

if (window.lucide) {
  window.lucide.createIcons();
}

let loaderHidden = false;

const hideLoader = () => {
  if (loaderHidden) {
    return;
  }

  loaderHidden = true;
  siteLoader?.classList.add("is-hidden");
  document.body.classList.remove("is-loading");
};

window.addEventListener("load", () => {
  window.setTimeout(hideLoader, prefersReducedMotion.matches ? 120 : 760);
});

window.setTimeout(hideLoader, 1700);

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

const setSpotlight = (card) => {
  if (!card || !spotlightTitle || !spotlightImage) {
    return;
  }

  const categoryLabel = card.querySelector("span")?.textContent?.trim() || "Solucion";
  const title = card.querySelector("h3")?.textContent?.trim() || "";
  const description = card.querySelector("p")?.textContent?.trim() || "";
  const image = card.querySelector("img");

  productCards.forEach((item) => item.classList.remove("is-active"));
  card.classList.add("is-active");

  if (spotlightLabel) {
    spotlightLabel.textContent = categoryLabel;
  }

  spotlightTitle.textContent = title;
  spotlightDescription.textContent = description;

  if (spotlightCategory) {
    spotlightCategory.textContent = card.dataset.category;
  }

  if (image) {
    spotlightImage.src = image.src;
    spotlightImage.alt = image.alt;
  }
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
});

applyFilter("all");

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
      item.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
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
