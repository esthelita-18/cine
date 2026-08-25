const API_URL = "http://localhost:3000/api";

async function peticion(url, opciones = {}) {
  const respuesta = await fetch(`${API_URL}${url}`, opciones);

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.error || "Ocurrió un error en el servidor.");
  }

  return datos;
}

export function obtenerPeliculas() {
  return peticion("/peliculas");
}

export function crearPelicula(datos) {
  return peticion("/peliculas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });
}

export function obtenerSalas() {
  return peticion("/salas");
}

export function crearSala(datos) {
  return peticion("/salas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });
}

export function obtenerFunciones() {
  return peticion("/funciones");
}

export function crearFuncion(datos) {
  return peticion("/funciones", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });
}

export function obtenerReservas() {
  return peticion("/reservas");
}

export function crearReserva(datos) {
  return peticion("/reservas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });
}

export function cancelarReserva(id) {
  return peticion(`/reservas/${id}/cancelar`, {
    method: "PATCH",
  });
}