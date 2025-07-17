
// script.js

const estado = {
  aprobadas: new Set(),
  tarjetas: new Map(),
  datos: []
};

document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("malla_traduccion.json");
  const data = await response.json();
  estado.datos = data;

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
      card.dataset.codigo = asignatura.Código;

      const categoria = detectarCategoria(asignatura.Asignatura);
      card.classList.add(categoria);

      const tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      tooltip.innerHTML = `
        <strong>Código:</strong> ${asignatura.Código}<br>
        <strong>Prerrequisito:</strong> ${asignatura.Prerequisito || "Ninguno"}
      `;

      card.appendChild(tooltip);

      // Guardar referencia
      estado.tarjetas.set(asignatura.Código, {
        element: card,
        prereq: asignatura.Prerequisito
      });

      columna.appendChild(card);
    });

    mallaContainer.appendChild(columna);
  });

  // Delegar eventos
  mallaContainer.addEventListener("click", event => {
    const card = event.target.closest(".card");
    if (!card || card.classList.contains("bloqueada")) return;
    const codigo = card.dataset.codigo;
    toggleAprobada(codigo);
  });

  actualizarEstado();
});

function toggleAprobada(codigo) {
  if (estado.aprobadas.has(codigo)) {
    estado.aprobadas.delete(codigo);
  } else {
    estado.aprobadas.add(codigo);
  }
  actualizarEstado();
}

function actualizarEstado() {
  estado.tarjetas.forEach((info, codigo) => {
    const { element, prereq } = info;
    const aprobado = estado.aprobadas.has(codigo);
    const habilitado = !prereq || estado.aprobadas.has(getCodigoPorNombre(prereq));

    element.classList.toggle("aprobada", aprobado);
    element.classList.toggle("bloqueada", !habilitado && !aprobado);
  });
}

function getCodigoPorNombre(nombre) {
  const match = estado.datos.find(a => a.Asignatura === nombre);
  return match ? match.Código : "";
}

function detectarCategoria(nombre) {
  const n = nombre.toLowerCase();
  if (n.includes("inglés")) return "ingles";
  if (n.includes("portugués")) return "portugues";
  if (n.includes("japonés")) return "japones";
  return "general";
}
