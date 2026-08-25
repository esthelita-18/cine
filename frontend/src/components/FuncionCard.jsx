function FuncionCard({ funcion, onReservar }) {
  return (
    <article className="tarjeta">
      <h3>{funcion.pelicula.titulo}</h3>

      <p>
        <strong>Género:</strong> {funcion.pelicula.genero}
      </p>

      <p>
        <strong>Duración:</strong> {funcion.pelicula.duracion} minutos
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
        <strong>Precio:</strong> ${funcion.precio.toFixed(2)}
      </p>

      <p>
        <strong>Disponibles:</strong> {funcion.disponibles}
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