const revealItems = document.querySelectorAll("[data-reveal]");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const prefillLinks = document.querySelectorAll("[data-prefill]");
const eventTypeField = document.querySelector('select[name="eventType"]');
const messageField = document.querySelector('textarea[name="message"]');

prefillLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const eventType = link.getAttribute("data-prefill");

    if (eventTypeField) {
      eventTypeField.value = eventType;
    }

    if (messageField && !messageField.value.trim()) {
      messageField.value = `Hola, quiero cotizar una propuesta de Musicale para ${eventType}. Me interesa recibir una recomendación de formato, repertorio y presencia musical para mi evento.`;
    }
  });
});

const form = document.getElementById("contactForm");
const mailButton = document.getElementById("mailButton");
const formStatus = document.getElementById("formStatus");

function getFormMessage(data) {
  return [
    "Hola, quiero cotizar una propuesta musical de Musicale.",
    "",
    `Nombre: ${data.name}`,
    `Correo: ${data.email}`,
    `Teléfono: ${data.phone}`,
    `Tipo de evento: ${data.eventType}`,
    `Mensaje: ${data.message}`
  ].join("\n");
}

function readFormData() {
  const formData = new FormData(form);

  return {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    eventType: String(formData.get("eventType") || "").trim(),
    message: String(formData.get("message") || "").trim()
  };
}

function hasMissingFields(data) {
  return Object.values(data).some((value) => !value);
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = readFormData();

    if (hasMissingFields(data)) {
      formStatus.textContent = "Complete todos los campos para generar su solicitud.";
      return;
    }

    const message = encodeURIComponent(getFormMessage(data));
    const whatsappUrl = `https://wa.me/56993319981?text=${message}`;

    formStatus.textContent = "Abrimos su solicitud en WhatsApp para que pueda enviarla de inmediato.";
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  });
}

if (mailButton) {
  mailButton.addEventListener("click", () => {
    const data = readFormData();

    if (hasMissingFields(data)) {
      formStatus.textContent = "Complete todos los campos para preparar el correo.";
      return;
    }

    const subject = encodeURIComponent(`Cotización ${data.eventType}`);
    const body = encodeURIComponent(getFormMessage(data));

    formStatus.textContent = "Preparamos su correo con el resumen de la solicitud.";
    window.location.href = `mailto:fantireno@gmail.com?subject=${subject}&body=${body}`;
  });
}
