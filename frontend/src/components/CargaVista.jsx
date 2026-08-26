function LineaSkeleton({ className = "" }) {
  return (
    <div
      className={`skeleton skeleton-linea ${className}`}
    />
  );
}

function SkeletonCartelera() {
  return (
    <section
      className="skeleton-vista"
      aria-busy="true"
      aria-label="Cargando cartelera"
    >
      <div className="skeleton skeleton-hero">
        <div className="skeleton-hero-contenido">
          <LineaSkeleton className="skeleton-etiqueta" />
          <LineaSkeleton className="skeleton-titulo-grande" />
          <LineaSkeleton className="skeleton-texto-medio" />
          <LineaSkeleton className="skeleton-texto-largo" />
          <div className="skeleton skeleton-boton" />
        </div>
      </div>

      <div className="skeleton-cabecera-seccion">
        <div>
          <LineaSkeleton className="skeleton-titulo" />
          <LineaSkeleton className="skeleton-texto-largo" />
        </div>
      </div>

      <div className="skeleton-filtros">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="skeleton-filtro"
          >
            <LineaSkeleton className="skeleton-label" />
            <div className="skeleton skeleton-input" />
          </div>
        ))}
      </div>

      <div className="skeleton-grid-cartelera">
        {[1, 2, 3].map((item) => (
          <article
            key={item}
            className="skeleton-card-pelicula"
          >
            <div className="skeleton skeleton-poster" />

            <div className="skeleton-card-contenido">
              <LineaSkeleton className="skeleton-titulo-card" />
              <LineaSkeleton className="skeleton-texto-medio" />

              <div className="skeleton-datos-card">
                <div className="skeleton skeleton-dato-card" />
                <div className="skeleton skeleton-dato-card" />
              </div>

              <LineaSkeleton className="skeleton-texto-largo" />

              <div className="skeleton-card-footer">
                <LineaSkeleton className="skeleton-precio" />
                <div className="skeleton skeleton-boton-card" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SkeletonReservas() {
  return (
    <section
      className="skeleton-vista"
      aria-busy="true"
      aria-label="Cargando reservas"
    >
      <div className="skeleton-cabecera-seccion">
        <div>
          <LineaSkeleton className="skeleton-etiqueta" />
          <LineaSkeleton className="skeleton-titulo" />
          <LineaSkeleton className="skeleton-texto-largo" />
        </div>
      </div>

      <div className="skeleton-estadisticas">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="skeleton-stat-card"
          >
            <LineaSkeleton className="skeleton-label" />
            <LineaSkeleton className="skeleton-numero" />
            <LineaSkeleton className="skeleton-texto-corto" />
          </div>
        ))}
      </div>

      <div className="skeleton-filtros skeleton-filtros-reservas">
        <div className="skeleton-filtro">
          <LineaSkeleton className="skeleton-label" />
          <div className="skeleton skeleton-input" />
        </div>

        <div className="skeleton-filtro">
          <LineaSkeleton className="skeleton-label" />
          <div className="skeleton skeleton-input" />
        </div>
      </div>

      <div className="skeleton-tabla">
        <div className="skeleton-tabla-header">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <LineaSkeleton
              key={item}
              className="skeleton-celda-header"
            />
          ))}
        </div>

        {[1, 2, 3, 4].map((fila) => (
          <div
            key={fila}
            className="skeleton-tabla-fila"
          >
            {[1, 2, 3, 4, 5, 6].map((celda) => (
              <LineaSkeleton
                key={celda}
                className="skeleton-celda"
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function SkeletonAdmin() {
  return (
    <section
      className="skeleton-vista"
      aria-busy="true"
      aria-label="Cargando administración"
    >
      <div className="skeleton-admin-cabecera">
        <div>
          <LineaSkeleton className="skeleton-etiqueta" />
          <LineaSkeleton className="skeleton-titulo" />
          <LineaSkeleton className="skeleton-texto-largo" />
        </div>

        <div className="skeleton-admin-acciones">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="skeleton skeleton-boton-admin"
            />
          ))}
        </div>
      </div>

      <div className="skeleton-estadisticas">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="skeleton-stat-card skeleton-stat-admin"
          >
            <div className="skeleton skeleton-icono-admin" />

            <div className="skeleton-stat-info">
              <LineaSkeleton className="skeleton-label" />
              <LineaSkeleton className="skeleton-numero" />
              <LineaSkeleton className="skeleton-texto-corto" />
            </div>
          </div>
        ))}
      </div>

      <div className="skeleton-tabs">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="skeleton skeleton-tab"
          />
        ))}
      </div>

      <div className="skeleton-panel-admin">
        <div className="skeleton-panel-header">
          <div>
            <LineaSkeleton className="skeleton-titulo-card" />
            <LineaSkeleton className="skeleton-texto-largo" />
          </div>

          <div className="skeleton skeleton-boton-card" />
        </div>

        <div className="skeleton-tabla">
          <div className="skeleton-tabla-header">
            {[1, 2, 3, 4, 5].map((item) => (
              <LineaSkeleton
                key={item}
                className="skeleton-celda-header"
              />
            ))}
          </div>

          {[1, 2, 3, 4].map((fila) => (
            <div
              key={fila}
              className="skeleton-tabla-fila"
            >
              {[1, 2, 3, 4, 5].map((celda) => (
                <LineaSkeleton
                  key={celda}
                  className="skeleton-celda"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CargaVista({ vista }) {
  if (vista === "reservas") {
    return <SkeletonReservas />;
  }

  if (vista === "admin") {
    return <SkeletonAdmin />;
  }

  return <SkeletonCartelera />;
}

export default CargaVista;
