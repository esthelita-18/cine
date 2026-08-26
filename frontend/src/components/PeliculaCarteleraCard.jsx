import { useMemo, useState } from "react";

function obtenerClaveFecha(fechaHora) {
  const fecha = new Date(fechaHora);

  return [
    fecha.getFullYear(),
    String(fecha.getMonth() + 1).padStart(2, "0"),
    String(fecha.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatearFecha(fechaHora) {
  return new Date(fechaHora).toLocaleDateString("es-EC", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function formatearHora(fechaHora) {
  return new Date(fechaHora).toLocaleTimeString("es-EC", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function PeliculaCarteleraCard({
  pelicula,
  funciones,
  onReservar,
}) {
  const [imagenError, setImagenError] = useState(false);

  const funcionesPorFecha = useMemo(() => {
    const grupos = new Map();

    funciones
      .slice()
      .sort(
        (a, b) =>
          new Date(a.fechaHora) - new Date(b.fechaHora)
      )
      .forEach((funcion) => {
        const clave = obtenerClaveFecha(funcion.fechaHora);

        if (!grupos.has(clave)) {
          grupos.set(clave, []);
        }

        grupos.get(clave).push(funcion);
      });

    return Array.from(grupos.entries());
  }, [funciones]);

  const totalDisponibles = funciones.reduce(
    (total, funcion) =>
      total + Number(funcion.disponibles || 0),
    0
  );

  const precioMinimo =
    funciones.length > 0
      ? Math.min(
          ...funciones.map((funcion) =>
            Number(funcion.precio)
          )
        )
      : 0;

  return (
    <article className="tarjeta pelicula-card pelicula-agrupada-card">

      <div className="poster-contenedor">

        {pelicula.imagenUrl && !imagenError ? (
          <img
            src={pelicula.imagenUrl}
            alt={`Poster de ${pelicula.titulo}`}
            className="poster-pelicula"
            onError={() => setImagenError(true)}
          />
        ) : (
          <div className="poster-sin-imagen">
            <div className="sin-imagen-contenido">
              <span className="icono-cine">
                🎬
              </span>

              <span>
                Sin imagen
              </span>
            </div>
          </div>
        )}

        <div className="poster-overlay" />

        <span className="badge-clasificacion">
          {pelicula.clasificacion}
        </span>

        <span
          className={
            totalDisponibles > 0
              ? "badge-disponibilidad disponible"
              : "badge-disponibilidad agotado"
          }
        >
          {totalDisponibles > 0
            ? `${funciones.length} ${
                funciones.length === 1
                  ? "función"
                  : "funciones"
              }`
            : "Agotada"}
        </span>

      </div>

      <div className="pelicula-contenido">

        <div className="pelicula-encabezado">
          <div>
            <h3>
              {pelicula.titulo}
            </h3>

            <p className="pelicula-meta">
              {pelicula.genero}

              <span>•</span>

              {pelicula.duracion} min

              <span>•</span>

              {pelicula.clasificacion}
            </p>
          </div>
        </div>

        <div className="pelicula-horarios">

          <div className="pelicula-horarios-cabecera">
            <span>
              Selecciona una función
            </span>

            <small>
              {funciones.length}{" "}
              {funciones.length === 1
                ? "horario"
                : "horarios"}
            </small>
          </div>

          {funcionesPorFecha.map(
            ([fecha, funcionesFecha]) => (
              <div
                className="grupo-fecha-funciones"
                key={fecha}
              >

                <div className="fecha-funciones">
                  {formatearFecha(
                    funcionesFecha[0].fechaHora
                  )}
                </div>

                <div className="lista-horarios">

                  {funcionesFecha.map((funcion) => {
                    const agotada =
                      Number(funcion.disponibles) <= 0;

                    return (
                      <button
                        key={funcion.id}
                        type="button"
                        className={
                          agotada
                            ? "horario-funcion agotado"
                            : "horario-funcion"
                        }
                        disabled={agotada}
                        onClick={() =>
                          onReservar(funcion)
                        }
                      >
                        <span className="horario-hora">
                          {formatearHora(
                            funcion.fechaHora
                          )}
                        </span>

                        <span className="horario-sala">
                          {funcion.sala.nombre}
                        </span>

                        <span className="horario-detalle">
                          {agotada
                            ? "Agotada"
                            : `${funcion.disponibles} disp.`}
                        </span>

                        <strong>
                          ${Number(
                            funcion.precio
                          ).toFixed(2)}
                        </strong>
                      </button>
                    );
                  })}

                </div>

              </div>
            )
          )}

        </div>

        <div className="pelicula-agrupada-footer">

          <div>
            <span className="precio-etiqueta">
              Desde
            </span>

            <span className="precio">
              ${precioMinimo.toFixed(2)}
            </span>
          </div>

          <span className="texto-seleccion-horario">
            Elige un horario para reservar
          </span>

        </div>

      </div>

    </article>
  );
}

export default PeliculaCarteleraCard;
