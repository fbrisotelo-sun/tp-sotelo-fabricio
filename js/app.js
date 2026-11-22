const API_BASE = "https://rickandmortyapi.com/api/location";

const formulario = document.getElementById("formulario-filtros");
const inputNombre = document.getElementById("input-nombre");
const inputTipo = document.getElementById("input-tipo");
const btnLimpiar = document.getElementById("btn-limpiar");
const estadoBusqueda = document.getElementById("estado-busqueda");
const contenedorResultados = document.getElementById("resultados");

function formatearValor(valor) {
  if (valor === null || valor === undefined) return "Desconocido";
  const limpio = String(valor).trim();
  if (!limpio || limpio.toLowerCase() === "unknown") {
    return "Desconocido";
  }
  return limpio;
}

function construirUrl(nombre, tipo) {
  const params = new URLSearchParams();
  if (nombre.trim()) {
    params.set("name", nombre.trim());
  }
  if (tipo.trim()) {
    params.set("type", tipo.trim());
  }
  const query = params.toString();
  return query ? `${API_BASE}?${query}` : API_BASE;
}

function renderizarUbicaciones(ubicaciones) {
  contenedorResultados.innerHTML = "";

  const fragmento = document.createDocumentFragment();

  ubicaciones.forEach((ubicacion) => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-ubicacion";

    const nombre = formatearValor(ubicacion.name);
    const tipo = formatearValor(ubicacion.type);
    const dimension = formatearValor(ubicacion.dimension);
    const cantidadResidentes = Array.isArray(ubicacion.residents)
      ? ubicacion.residents.length
      : 0;

    tarjeta.innerHTML = `
      <h2 class="tarjeta-titulo">${nombre}</h2>
      <p class="dato"><strong>Tipo:</strong> ${tipo}</p>
      <p class="dato"><strong>Dimensión:</strong> ${dimension}</p>
      <p class="dato"><strong>Cantidad de residentes:</strong> ${cantidadResidentes}</p>
    `;

    fragmento.appendChild(tarjeta);
  });

  contenedorResultados.appendChild(fragmento);
}

async function consultarUbicaciones(nombre = "", tipo = "") {
  const url = construirUrl(nombre, tipo);
  estadoBusqueda.textContent = "Cargando ubicaciones...";
  contenedorResultados.innerHTML = "";

  try {
    const respuesta = await fetch(url);

    if (respuesta.status === 404) {
      estadoBusqueda.textContent = "No se encontraron ubicaciones con esos criterios (sin resultados).";
      return;
    }

    if (!respuesta.ok) {
      throw new Error(`Error HTTP ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    const resultados = Array.isArray(datos.results) ? datos.results : [];

    if (resultados.length === 0) {
      estadoBusqueda.textContent = "No se encontraron ubicaciones con esos criterios (sin resultados).";
      return;
    }

    estadoBusqueda.textContent = `Mostrando ${resultados.length} ubicación(es) encontrada(s).`;
    renderizarUbicaciones(resultados);
  } catch (error) {
    console.error("Error al consultar ubicaciones:", error);
    estadoBusqueda.textContent = "Ocurrió un problema al conectar con la API de ubicaciones.";
  }
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  consultarUbicaciones(inputNombre.value, inputTipo.value);
});

btnLimpiar.addEventListener("click", () => {
  inputNombre.value = "";
  inputTipo.value = "";
  consultarUbicaciones("", "");
});

document.addEventListener("DOMContentLoaded", () => {
  consultarUbicaciones("", "");
});