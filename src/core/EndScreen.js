// Pantalla final: se funde a un blanco cálido y muestra el agradecimiento.
export const END_LINES = ["Lo que fue, sigue creciendo."];

export const END_CONFIG = {
  resources: [
    {
      label: "Línea de Salud Mental (Municipalidad de Córdoba)",
      phone: "0800-888-5555",
      note: "gratuita, confidencial, 24 hs",
    },
    {
      label: "Fundación Argentina para el Duelo",
      url: "https://www.instagram.com/duelarf/",
    },
    {
      label: "Fundación Aikén",
      url: "https://www.fundacionaiken.org.ar/en/",
    },
    {
      label: "Red de Servicios de Salud y Atención Psicológica (ReSSAP - UNC)",
      url: "https://unc.edu.ar",
    },
  ],
  feedbackUrl: "", // enlace a un formulario con las preguntas abiertas del plan de pruebas
};

export function showEndScreen({
  lines = END_LINES,
  resources = END_CONFIG.resources,
  feedbackUrl = END_CONFIG.feedbackUrl,
} = {}) {
  document.getElementById("crosshair")?.style.setProperty("display", "none");
  document.getElementById("ui-prompt")?.style.setProperty("display", "none");

  // Fundido a blanco
  const fade = document.createElement("div");
  fade.style.cssText =
    "position:fixed;inset:0;background:#fbf3dc;opacity:0;transition:opacity 3s ease-in-out;z-index:200;pointer-events:none;";
  document.body.appendChild(fade);
  requestAnimationFrame(() =>
    requestAnimationFrame(() => (fade.style.opacity = "1")),
  );

  // Pantalla de agradecimiento
  setTimeout(() => {
    const screen = document.createElement("div");
    screen.style.cssText =
      "position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#fbf3dc;color:#3b2f22;z-index:201;opacity:0;transition:opacity 2s ease-in-out;padding:1.5rem;";
    const box = document.createElement("div");
    box.style.cssText =
      "max-width:520px;text-align:center;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;line-height:1.55;";

    const title = document.createElement("h1");
    title.textContent = "Gracias por recorrer este espacio";
    title.style.cssText =
      "font-size:1.7rem;letter-spacing:0.08rem;margin-bottom:1.4rem;color:#3b2f22;";

    const line = document.createElement("p");
    line.textContent = lines[Math.floor(Math.random() * lines.length)];
    line.style.cssText =
      "font-size:1.35rem;font-style:italic;margin-bottom:1.6rem;color:#6a4a2a;";

    const note = document.createElement("p");
    note.textContent =
      "Este recorrido es una simplificación: en la vida real las etapas del duelo no son lineales, no son pasos ordenados y cada persona puede ir y volver entre etapas.";
    note.style.cssText = "font-size:0.9rem;margin-bottom:1.4rem;color:#7a6a58;";

    box.append(title, line, note);

    if (resources.length) {
      const css = document.createElement("style");
      css.textContent = `
        .hog-end-link {
          color: #6a4a2a;
          text-decoration: underline;
          text-decoration-color: rgba(106, 74, 42, 0.35);
          text-underline-offset: 3px;
          transition: color 0.2s ease, text-decoration-color 0.2s ease;
        }
        .hog-end-link:hover,
        .hog-end-link:focus-visible {
          color: #3b2f22;
          text-decoration-color: currentColor;
        }
        .hog-end-link:focus-visible {
          outline: 2px solid #6a4a2a;
          outline-offset: 3px;
          border-radius: 2px;
        }`;
      box.appendChild(css);

      const wrap = document.createElement("div");
      wrap.style.cssText =
        "max-width:440px;margin:0 auto 1.8rem;padding-top:1.1rem;border-top:1px solid rgba(90,74,56,0.18);";

      const head = document.createElement("p");
      head.textContent = "Si necesitás apoyo o querés hablar con alguien:";
      head.style.cssText =
        "font-size:0.8rem;margin-bottom:0.8rem;color:#7a6a58;";
      wrap.appendChild(head);

      const mkLink = (text, href, external) => {
        const a = document.createElement("a");
        a.className = "hog-end-link";
        a.textContent = text;
        a.href = href;
        if (external) {
          a.target = "_blank";
          a.rel = "noopener noreferrer";
        }
        return a;
      };

      const list = document.createElement("ul");
      list.style.cssText =
        "list-style:none;margin:0;padding:0;font-size:0.82rem;line-height:1.45;color:#7a6a58;";
      resources.forEach((r) => {
        const li = document.createElement("li");
        li.style.cssText = "margin-bottom:0.55rem;";
        if (r.url) li.appendChild(mkLink(r.label, r.url, true));
        else li.append(r.label);
        if (r.phone) {
          li.append(document.createElement("br"));
          li.appendChild(
            mkLink(r.phone, `tel:${r.phone.replace(/[^\d+]/g, "")}`, false),
          );
        }
        if (r.note) li.append(` · ${r.note}`);
        list.appendChild(li);
      });
      wrap.appendChild(list);
      box.appendChild(wrap);
    }
    if (feedbackUrl) {
      const a = document.createElement("a");
      a.href = feedbackUrl;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = "Contanos cómo fue (opcional)";
      a.style.cssText =
        "display:block;margin-bottom:1.4rem;font-size:0.95rem;color:#6a4a2a;";
      box.appendChild(a);
    }

    const again = document.createElement("button");
    again.textContent = "Volver a empezar";
    again.style.cssText =
      "background:#d9c9a3;color:#3b2f22;padding:0.7rem 1.6rem;font-size:1rem;border:0;border-radius:4px;cursor:pointer;";
    again.onclick = () => location.reload();
    box.appendChild(again);

    const foot = document.createElement("p");
    foot.textContent =
      "Hall of Grief · Creatividad y Desarrollo de Entornos Virtuales · UTN FRC · Grupo 9";
    foot.style.cssText = "margin-top:2rem;font-size:0.75rem;color:#a39580;";
    box.appendChild(foot);

    screen.appendChild(box);
    document.body.appendChild(screen);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => (screen.style.opacity = "1")),
    );
  }, 3200);
}
