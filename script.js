
// script.js
document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("malla_traduccion.json");
  const data = await response.json();

  const mallaContainer = document.getElementById("malla");
  const semestres = {};

  // Agrupar asignaturas por semestre
  data.forEach(asignatura => {
    const semestre = asignatura.Semestre;
    if (!semestres[semestre]) semestres[semestre] = [];
    semestres[semestre].push(asignatura);
  });

  // Crear columnas por semestre
  Object.keys(semestres).sort((a, b) => a - b).forEach(num => {
    const columna = document.createElement("div");
    columna.className = "semestre";

    const titulo = document.createElement("h2");
    titulo.textContent = `Semestre ${num}`;
    columna.appendChild(titulo);

    semestres[num].forEach(asignatura => {
      const card = document.createElement("div");
      card.className = "card";
      card.textContent = asignatura.Asignatura;

      const tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      tooltip.innerHTML = `
        <strong>Código:</strong> ${asignatura.Código}<br>
        <strong>Prerrequisito:</strong> ${asignatura.Prerequisito || "Ninguno"}
      `;

      card.appendChild(tooltip);
      columna.appendChild(card);
    });

    mallaContainer.appendChild(columna);
  });
});
