
// script.js
document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("malla_traduccion.json");
  const data = await response.json();

  const mallaContainer = document.getElementById("malla");

  data.forEach(asignatura => {
    const card = document.createElement("div");
    card.className = "card";

    const title = document.createElement("h3");
    title.textContent = `${asignatura.Asignatura}`;

    const code = document.createElement("p");
    code.textContent = `Código: ${asignatura.Código}`;

    const sct = document.createElement("p");
    sct.textContent = `Créditos SCT: ${asignatura.SCT}`;

    const semestre = document.createElement("p");
    semestre.textContent = `Semestre: ${asignatura.Semestre}`;

    const prereq = document.createElement("p");
    prereq.textContent = asignatura.Prerequisito
      ? `Prerrequisito: ${asignatura.Prerequisito}`
      : "Prerrequisito: Ninguno";

    card.appendChild(title);
    card.appendChild(code);
    card.appendChild(sct);
    card.appendChild(semestre);
    card.appendChild(prereq);

    mallaContainer.appendChild(card);
  });
});
