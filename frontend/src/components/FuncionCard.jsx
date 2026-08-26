import { useState } from "react";

function FuncionCard({ funcion, onReservar }) {
  const [errorImagen, setErrorImagen] = useState(false);

  const tieneImagen =
    funcion.pelicula.imagenUrl &&
    funcion.pelicula.imagenUrl.trim() !== "" &&
    !errorImagen;

  return (
    <article className="tarjeta">
      {tieneImagen ? (
        <img
          className="poster-pelicula"
          src={funcion.pelicula.imagenUrl}
          alt={`Portada de ${funcion.pelicula.titulo}`}
          onError={() => setErrorImagen(true)}
        />
      ) : (
        <div className="poster-sin-imagen">
          Sin imagen
        </div>
      )}

      <h3>{funcion.pelicula.titulo}</h3>

      <p>
        <strong>Género:</strong> {funcion.pelicula.genero}
      </p>

      <p>
        <strong>Duración:</strong>{" "}
        {funcion.pelicula.duracion} minutos
      </p>

      <p>
        <strong>Clasificación:</strong>{" "}
        {funcion.pelicula.clasificacion}
      </p>

      <hr />

      <p>
        <strong>Fecha:</strong>{" "}
        {new Date(funcion.fechaHora).toLocaleString("es-EC")}
      </p>

      <p>
        <strong>Sala:</strong> {funcion.sala.nombre}
      </p>

      <p>
        <strong>Precio:</strong> $
        {funcion.precio.toFixed(2)}
      </p>

      <p>
        <strong>Disponibles:</strong>{" "}
        {funcion.disponibles}
      </p>

      <button
        disabled={funcion.disponibles <= 0}
        onClick={() => onReservar(funcion)}
      >
        {funcion.disponibles > 0 ? "Reservar" : "Agotado"}
      </button>
    </article>
  );
}

export default FuncionCard;