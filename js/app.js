const contenedor = document.getElementById('contenedor-personajes');
const estado = document.getElementById('estado');
const inputBusqueda = document.getElementById('input-busqueda');
const filtroEstado = document.getElementById('filtro-estado');
const btnBuscar = document.getElementById('btn-buscar');

async function cargarPersonajes(nombre = '', estadoFiltro = '') {
  estado.textContent = 'Cargando personajes...';
  contenedor.innerHTML = '';

  const params = new URLSearchParams();
  if (nombre) params.append('name', nombre);
  if (estadoFiltro) params.append('status', estadoFiltro);

  const query = params.toString();
  const url = query
    ? `https://rickandmortyapi.com/api/character/?${query}`
    : 'https://rickandmortyapi.com/api/character';

  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      throw new Error('No se encontraron personajes con ese criterio.');
    }
    const datos = await respuesta.json();
    estado.textContent = '';
    mostrarPersonajes(datos.results);
  } catch (error) {
    estado.textContent = error.message;
  }
}

function mostrarPersonajes(personajes) {
  contenedor.innerHTML = personajes.map(p => `
    <article class="card">
      <img src="${p.image}" alt="${p.name}">
      <div class="card-body">
        <h3>${p.name}</h3>
        <p>Estado: ${p.status}</p>
        <p>Especie: ${p.species}</p>
      </div>
    </article>
  `).join('');
}

btnBuscar.addEventListener('click', () => {
  cargarPersonajes(inputBusqueda.value.trim(), filtroEstado.value);
});

inputBusqueda.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    cargarPersonajes(inputBusqueda.value.trim(), filtroEstado.value);
  }
});

filtroEstado.addEventListener('change', () => {
  cargarPersonajes(inputBusqueda.value.trim(), filtroEstado.value);
});

cargarPersonajes();