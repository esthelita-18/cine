import { useState } from "react";

function FuncionCard({ funcion, onReservar }) {
  const [errorImagen, setErrorImagen] = useState(false);

  const tieneImagen =
    funcion.pelicula.imagenUrl &&
    funcion.pelicula.imagenUrl.trim() !== "" &&
    !errorImagen;

  const fechaFuncion = new Date(funcion.fechaHora);

  const fecha = fechaFuncion.toLocaleDateString("es-EC", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

  const hora = fechaFuncion.toLocaleTimeString("es-EC", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const capacidad = funcion.sala.capacidad || 0;
  const disponibles = funcion.disponibles || 0;

  const porcentajeDisponible =
    capacidad > 0
      ? Math.max(
          0,
          Math.min(100, (disponibles / capacidad) * 100)
        )
      : 0;

  let textoDisponibilidad = `${disponibles} disponibles`;
  let tipoDisponibilidad = "disponible";

  if (disponibles <= 0) {
    textoDisponibilidad = "Agotado";
    tipoDisponibilidad = "agotado";
  } else if (disponibles <= 5) {
    textoDisponibilidad = `Últimos ${disponibles}`;
    tipoDisponibilidad = "ultimos";
  }

  return (
    <article className="tarjeta pelicula-card">
      {/* POSTER */}
      <div className="poster-contenedor">
        {tieneImagen ? (
          <img
            className="poster-pelicula"
            src={funcion.pelicula.imagenUrl}
            alt={`Portada de ${funcion.pelicula.titulo}`}
            onError={() => setErrorImagen(true)}
          />
        ) : (
          <div className="poster-sin-imagen">
            <div className="sin-imagen-contenido">
              <span className="icono-cine">🎬</span>
              <span>Sin imagen disponible</span>
            </div>
          </div>
        )}

        <div className="poster-overlay" />

        <span className="badge-clasificacion">
          {funcion.pelicula.clasificacion}
        </span>

        <span
          className={`badge-disponibilidad ${tipoDisponibilidad}`}
        >
          {textoDisponibilidad}
        </span>
      </div>

      {/* INFORMACIÓN */}
      <div className="pelicula-contenido">
        <div className="pelicula-encabezado">
          <div>
            <h3>{funcion.pelicula.titulo}</h3>

            <p className="pelicula-meta">
              {funcion.pelicula.genero}
              <span>•</span>
              {funcion.pelicula.duracion} min
            </p>
          </div>
        </div>

        {/* INFORMACIÓN DE LA FUNCIÓN */}
        <div className="funcion-info">
          <div className="funcion-dato">
            <span className="funcion-etiqueta">
              Fecha
            </span>

            <strong>{fecha}</strong>
          </div>

          <div className="funcion-dato">
            <span className="funcion-etiqueta">
              Hora
            </span>

            <strong>{hora}</strong>
          </div>

          <div className="funcion-dato">
            <span className="funcion-etiqueta">
              Sala
            </span>

            <strong>{funcion.sala.nombre}</strong>
          </div>
        </div>

        {/* DISPONIBILIDAD */}
        <div className="disponibilidad-contenedor">
          <div className="disponibilidad-texto">
            <span>Disponibilidad</span>

            <strong>
              {disponibles <= 0
                ? "Sin lugares"
                : `${disponibles} lugares`}
            </strong>
          </div>

          <div className="barra-disponibilidad">
            <div
              className={`barra-disponibilidad-valor ${tipoDisponibilidad}`}
              style={{
                width: `${porcentajeDisponible}%`,
              }}
            />
          </div>
        </div>

        {/* PRECIO */}
        <div className="precio-contenedor">
          <div>
            <span className="precio-etiqueta">
              Precio por entrada
            </span>

            <div className="precio">
              ${funcion.precio.toFixed(2)}
            </div>
          </div>

          <button
            className="btn-reservar"
            type="button"
            disabled={disponibles <= 0}
            onClick={() => onReservar(funcion)}
          >
            {disponibles > 0
              ? "Reservar"
              : "Agotado"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default FuncionCard;