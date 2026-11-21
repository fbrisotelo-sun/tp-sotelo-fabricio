const contenedor = document.getElementById('contenedor-personajes');
const estado = document.getElementById('estado');
const inputBusqueda = document.getElementById('input-busqueda');
const btnBuscar = document.getElementById('btn-buscar');

async function cargarPersonajes(nombre = '') {
  estado.textContent = 'Cargando personajes...';
  contenedor.innerHTML = '';

  const url = nombre
    ? `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(nombre)}`
    : 'https://rickandmortyapi.com/api/character';

  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      throw new Error('No se encontraron personajes con ese nombre.');
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
  cargarPersonajes(inputBusqueda.value.trim());
});

inputBusqueda.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    cargarPersonajes(inputBusqueda.value.trim());
  }
});

cargarPersonajes();