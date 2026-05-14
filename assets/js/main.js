const nav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
const navCollapse = document.getElementById("mainNav");
const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");
const emailForm = document.getElementById("emailForm");
const whatsappForm = document.getElementById("whatsappForm");
const emailStatus = document.getElementById("emailStatus");
const whatsappStatus = document.getElementById("whatsappStatus");

const primaryEmail = "contacto@bysing.com";
const ccEmail = "vbarrionuevo@bysing.com";
const whatsappNumber = "593999457534";

if (window.lucide) {
  window.lucide.createIcons();
}

const updateNav = () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateNav();
window.addEventListener("scroll", updateNav, { passive: true });

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const instance = bootstrap.Collapse.getInstance(navCollapse);
    if (instance) {
      instance.hide();
    }
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    productCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      const shouldShow = filter === "all" || categories.includes(filter);
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

const fieldValue = (form, name) => {
  const field = form.elements[name];
  return field ? field.value.trim() : "";
};

const encodeMailBody = (lines) => encodeURIComponent(lines.filter(Boolean).join("\n"));

emailForm.addEventListener("submit", (event) => {
  event.preventDefault();
  emailForm.classList.add("was-validated");

  if (!emailForm.checkValidity()) {
    emailStatus.textContent = "Revisa los campos marcados antes de preparar el correo.";
    return;
  }

  const name = fieldValue(emailForm, "name");
  const company = fieldValue(emailForm, "company");
  const phone = fieldValue(emailForm, "phone");
  const service = fieldValue(emailForm, "service");
  const message = fieldValue(emailForm, "message");
  const subject = encodeURIComponent(`Solicitud web BYSING - ${service}`);
  const body = encodeMailBody([
    "Hola BYSING,",
    "",
    "Me gustaría recibir información o una cotización.",
    "",
    `Nombre: ${name}`,
    `Empresa: ${company}`,
    `Teléfono: ${phone}`,
    `Servicio: ${service}`,
    "",
    "Detalle:",
    message
  ]);

  emailStatus.textContent = "Abriendo tu cliente de correo con la solicitud lista.";
  window.location.href = `mailto:${primaryEmail}?cc=${encodeURIComponent(ccEmail)}&subject=${subject}&body=${body}`;
});

whatsappForm.addEventListener("submit", (event) => {
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
      "Hola BYSING, quiero información.",
      `Nombre: ${name}`,
      `Empresa: ${company}`,
      `Necesidad: ${need}`,
      `Mensaje: ${message}`
    ].join("\n")
  );

  whatsappStatus.textContent = "Abriendo WhatsApp con el mensaje preparado.";
  window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank", "noopener,noreferrer");
});
