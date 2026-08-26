import { useEffect, useState } from "react";
import "./App.css";
import Mensaje from "./components/Mensaje";
import FuncionCard from "./components/FuncionCard";

import {
  obtenerPeliculas,
  obtenerSalas,
  obtenerFunciones,
  obtenerReservas,
  crearPelicula,
  crearSala,
  crearFuncion,
  crearReserva,
  cancelarReserva,
  actualizarPelicula,
} from "./services/api";

function App() {
  const [vista, setVista] = useState("cartelera");

  const [peliculas, setPeliculas] = useState([]);
  const [salas, setSalas] = useState([]);
  const [funciones, setFunciones] = useState([]);
  const [reservas, setReservas] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  /* ======================================================
     FILTROS DE CARTELERA
     ====================================================== */

  const [busqueda, setBusqueda] = useState("");
  const [filtroPelicula, setFiltroPelicula] = useState("");
  const [filtroGenero, setFiltroGenero] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  /* ======================================================
     RESERVA
     ====================================================== */

  const [funcionSeleccionada, setFuncionSeleccionada] =
    useState(null);

  const [reservaForm, setReservaForm] = useState({
    nombre: "",
    correo: "",
    cantidad: 1,
  });

  /* ======================================================
     PELÍCULAS
     ====================================================== */

  const [peliculaForm, setPeliculaForm] = useState({
    titulo: "",
    genero: "",
    duracion: "",
    clasificacion: "",
    imagenUrl: "",
  });

  const [peliculaEditando, setPeliculaEditando] =
    useState(null);

  const [edicionPeliculaForm, setEdicionPeliculaForm] =
    useState({
      titulo: "",
      genero: "",
      duracion: "",
      clasificacion: "",
      imagenUrl: "",
      activa: true,
    });

  /* ======================================================
     SALAS
     ====================================================== */

  const [salaForm, setSalaForm] = useState({
    nombre: "",
    capacidad: "",
  });

  /* ======================================================
     FUNCIONES
     ====================================================== */

  const [funcionForm, setFuncionForm] = useState({
    peliculaId: "",
    salaId: "",
    fechaHora: "",
    precio: "",
  });

  /* ======================================================
     CARGAR DATOS
     ====================================================== */

  async function cargarDatos() {
    try {
      setCargando(true);
      setError("");

      const [
        datosPeliculas,
        datosSalas,
        datosFunciones,
        datosReservas,
      ] = await Promise.all([
        obtenerPeliculas(),
        obtenerSalas(),
        obtenerFunciones(),
        obtenerReservas(),
      ]);

      setPeliculas(datosPeliculas);
      setSalas(datosSalas);
      setFunciones(datosFunciones);
      setReservas(datosReservas);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  /* ======================================================
     MENSAJES
     ====================================================== */

  function mostrarMensaje(texto) {
    setMensaje(texto);

    setTimeout(() => {
      setMensaje("");
    }, 3000);
  }

  /* ======================================================
     CREAR RESERVA
     ====================================================== */

  async function manejarReserva(e) {
    e.preventDefault();

    if (!funcionSeleccionada) {
      return;
    }

    try {
      setError("");

      await crearReserva({
        nombre: reservaForm.nombre,
        correo: reservaForm.correo,
        funcionId: funcionSeleccionada.id,
        cantidad: Number(reservaForm.cantidad),
      });

      mostrarMensaje("Reserva creada correctamente.");

      setReservaForm({
        nombre: "",
        correo: "",
        cantidad: 1,
      });

      setFuncionSeleccionada(null);

      await cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  }

  /* ======================================================
     CERRAR MODAL DE RESERVA
     ====================================================== */

  function cerrarModalReserva() {
    setFuncionSeleccionada(null);

    setReservaForm((formActual) => ({
      ...formActual,
      cantidad: 1,
    }));
  }

  /* ======================================================
     CAMBIAR CANTIDAD DE ENTRADAS
     ====================================================== */

  function cambiarCantidadReserva(cambio) {
    if (!funcionSeleccionada) {
      return;
    }

    const cantidadActual =
      Number(reservaForm.cantidad) || 1;

    const maximo =
      Number(funcionSeleccionada.disponibles) || 0;

    if (maximo <= 0) {
      return;
    }

    const nuevaCantidad = Math.max(
      1,
      Math.min(
        maximo,
        cantidadActual + cambio
      )
    );

    setReservaForm({
      ...reservaForm,
      cantidad: nuevaCantidad,
    });
  }

  /* ======================================================
     CANCELAR RESERVA
     ====================================================== */

  async function manejarCancelarReserva(id) {
    try {
      setError("");

      await cancelarReserva(id);

      mostrarMensaje(
        "Reserva cancelada correctamente."
      );

      await cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  }

  /* ======================================================
     CREAR PELÍCULA
     ====================================================== */

  async function manejarCrearPelicula(e) {
    e.preventDefault();

    try {
      setError("");

      await crearPelicula({
        ...peliculaForm,
        duracion: Number(
          peliculaForm.duracion
        ),
      });

      mostrarMensaje(
        "Película registrada correctamente."
      );

      setPeliculaForm({
        titulo: "",
        genero: "",
        duracion: "",
        clasificacion: "",
        imagenUrl: "",
      });

      await cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  }

  /* ======================================================
     CREAR SALA
     ====================================================== */

  async function manejarCrearSala(e) {
    e.preventDefault();

    try {
      setError("");

      await crearSala({
        nombre: salaForm.nombre,
        capacidad: Number(
          salaForm.capacidad
        ),
      });

      mostrarMensaje(
        "Sala registrada correctamente."
      );

      setSalaForm({
        nombre: "",
        capacidad: "",
      });

      await cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  }

  /* ======================================================
     CREAR FUNCIÓN
     ====================================================== */

  async function manejarCrearFuncion(e) {
    e.preventDefault();

    try {
      setError("");

      await crearFuncion({
        peliculaId: Number(
          funcionForm.peliculaId
        ),
        salaId: Number(
          funcionForm.salaId
        ),
        fechaHora:
          funcionForm.fechaHora,
        precio: Number(
          funcionForm.precio
        ),
      });

      mostrarMensaje(
        "Función programada correctamente."
      );

      setFuncionForm({
        peliculaId: "",
        salaId: "",
        fechaHora: "",
        precio: "",
      });

      await cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  }

  /* ======================================================
     EDITAR PELÍCULA
     ====================================================== */

  function abrirEdicionPelicula(pelicula) {
    setPeliculaEditando(pelicula);

    setEdicionPeliculaForm({
      titulo: pelicula.titulo,
      genero: pelicula.genero,
      duracion: pelicula.duracion,
      clasificacion:
        pelicula.clasificacion,
      imagenUrl:
        pelicula.imagenUrl || "",
      activa: pelicula.activa,
    });
  }

  function cerrarEdicionPelicula() {
    setPeliculaEditando(null);
  }

  async function manejarEditarPelicula(e) {
    e.preventDefault();

    if (!peliculaEditando) {
      return;
    }

    try {
      setError("");

      await actualizarPelicula(
        peliculaEditando.id,
        {
          ...edicionPeliculaForm,
          duracion: Number(
            edicionPeliculaForm.duracion
          ),
        }
      );

      mostrarMensaje(
        "Película actualizada correctamente."
      );

      setPeliculaEditando(null);

      await cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  }

  /* ======================================================
     NORMALIZAR TEXTO
     ====================================================== */

  function normalizarTexto(texto = "") {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .trim();
  }

  /* ======================================================
     LIMPIAR FILTROS
     ====================================================== */

  function limpiarFiltros() {
    setBusqueda("");
    setFiltroPelicula("");
    setFiltroGenero("");
    setFiltroFecha("");
  }

  /* ======================================================
     GÉNEROS DISPONIBLES
     ====================================================== */

  const generosDisponibles = [
    ...new Set(
      peliculas
        .filter(
          (pelicula) =>
            pelicula.activa
        )
        .map(
          (pelicula) =>
            pelicula.genero?.trim()
        )
        .filter(Boolean)
    ),
  ].sort((a, b) =>
    a.localeCompare(b, "es")
  );

  /* ======================================================
     FECHAS PARA FILTROS
     ====================================================== */

  const hoy = new Date();

  hoy.setHours(0, 0, 0, 0);

  const manana = new Date(hoy);

  manana.setDate(
    manana.getDate() + 1
  );

  const pasadoManana =
    new Date(hoy);

  pasadoManana.setDate(
    pasadoManana.getDate() + 2
  );

  const finProximos7Dias =
    new Date(hoy);

  finProximos7Dias.setDate(
    finProximos7Dias.getDate() + 7
  );

  /* ======================================================
     CARTELERA FILTRADA
     ====================================================== */

  const funcionesCartelera = funciones
    .filter((funcion) => {
      const fechaFuncion =
        new Date(funcion.fechaHora);

      const futura =
        fechaFuncion > new Date();

      const funcionActiva =
        funcion.estado === "ACTIVA";

      const peliculaActiva =
        funcion.pelicula.activa;

      const coincidePelicula =
        filtroPelicula === "" ||
        funcion.pelicula.id ===
          Number(filtroPelicula);

      const coincideBusqueda =
        busqueda.trim() === "" ||
        normalizarTexto(
          funcion.pelicula.titulo
        ).includes(
          normalizarTexto(busqueda)
        );

      const coincideGenero =
        filtroGenero === "" ||
        normalizarTexto(
          funcion.pelicula.genero
        ) ===
          normalizarTexto(
            filtroGenero
          );

      let coincideFecha = true;

      if (
        filtroFecha === "hoy"
      ) {
        coincideFecha =
          fechaFuncion >= hoy &&
          fechaFuncion < manana;
      }

      if (
        filtroFecha === "manana"
      ) {
        coincideFecha =
          fechaFuncion >= manana &&
          fechaFuncion <
            pasadoManana;
      }

      if (
        filtroFecha ===
        "proximos7"
      ) {
        coincideFecha =
          fechaFuncion >= hoy &&
          fechaFuncion <
            finProximos7Dias;
      }

      return (
        futura &&
        funcionActiva &&
        peliculaActiva &&
        coincidePelicula &&
        coincideBusqueda &&
        coincideGenero &&
        coincideFecha
      );
    })
    .sort(
      (a, b) =>
        new Date(a.fechaHora) -
        new Date(b.fechaHora)
    );

  /* ======================================================
     FILTROS ACTIVOS
     ====================================================== */

  const hayFiltrosActivos =
    busqueda.trim() !== "" ||
    filtroPelicula !== "" ||
    filtroGenero !== "" ||
    filtroFecha !== "";

  /* ======================================================
     FUNCIÓN DESTACADA
     ====================================================== */

  const funcionDestacada =
    funcionesCartelera.length > 0
      ? funcionesCartelera[0]
      : null;

  /* ======================================================
     TOTAL VISUAL
     ====================================================== */

  const totalVisual =
    funcionSeleccionada
      ? Number(
          reservaForm.cantidad || 0
        ) *
        funcionSeleccionada.precio
      : 0;

  return (
    <div className="app">

      {/* ==================================================
          ENCABEZADO
          ================================================== */}

      <header className="encabezado">
        <div>
          <h1>Cine Reservas</h1>

          <p>
            Sistema de gestión y
            reserva de funciones
          </p>
        </div>

        <nav>
          <button
            className={
              vista === "cartelera"
                ? "activo"
                : ""
            }
            onClick={() =>
              setVista("cartelera")
            }
          >
            Cartelera
          </button>

          <button
            className={
              vista === "reservas"
                ? "activo"
                : ""
            }
            onClick={() =>
              setVista("reservas")
            }
          >
            Reservas
          </button>

          <button
            className={
              vista === "admin"
                ? "activo"
                : ""
            }
            onClick={() =>
              setVista("admin")
            }
          >
            Administración
          </button>
        </nav>
      </header>

      <main>

        <Mensaje
          tipo="exito"
          texto={mensaje}
        />

        <Mensaje
          tipo="error"
          texto={error}
        />

        {cargando ? (
          <p className="estado">
            Cargando información...
          </p>
        ) : (
          <>

            {/* ==================================================
                CARTELERA
                ================================================== */}

            {vista ===
              "cartelera" && (
              <section>

                {/* HERO */}

                {funcionDestacada && (
                  <div
                    className="hero-cine"
                    style={{
                      backgroundImage:
                        funcionDestacada
                          .pelicula
                          .imagenUrl
                          ? `url("${funcionDestacada.pelicula.imagenUrl}")`
                          : "none",
                    }}
                  >
                    <div className="hero-overlay" />

                    <div className="hero-contenido">

                      <span className="hero-etiqueta">
                        Destacada
                      </span>

                      <h2>
                        {
                          funcionDestacada
                            .pelicula
                            .titulo
                        }
                      </h2>

                      <div className="hero-meta">

                        <span>
                          {
                            funcionDestacada
                              .pelicula
                              .genero
                          }
                        </span>

                        <span>•</span>

                        <span>
                          {
                            funcionDestacada
                              .pelicula
                              .duracion
                          }{" "}
                          min
                        </span>

                        <span>•</span>

                        <span>
                          {
                            funcionDestacada
                              .pelicula
                              .clasificacion
                          }
                        </span>

                      </div>

                      <p className="hero-proxima">
                        Próxima función:{" "}
                        {new Date(
                          funcionDestacada
                            .fechaHora
                        ).toLocaleString(
                          "es-EC",
                          {
                            weekday:
                              "long",
                            day: "2-digit",
                            month:
                              "long",
                            hour: "2-digit",
                            minute:
                              "2-digit",
                          }
                        )}
                      </p>

                      <div className="hero-detalles">

                        <span>
                          {
                            funcionDestacada
                              .sala.nombre
                          }
                        </span>

                        <span>•</span>

                        <span>
                          {
                            funcionDestacada
                              .disponibles
                          }{" "}
                          lugares disponibles
                        </span>

                      </div>

                      <div className="hero-precio">
                        Desde{" "}

                        <strong>
                          $
                          {funcionDestacada.precio.toFixed(
                            2
                          )}
                        </strong>
                      </div>

                      <button
                        type="button"
                        className="hero-boton"
                        disabled={
                          funcionDestacada.disponibles <=
                          0
                        }
                        onClick={() =>
                          setFuncionSeleccionada(
                            funcionDestacada
                          )
                        }
                      >
                        {funcionDestacada.disponibles >
                        0
                          ? "Reservar ahora"
                          : "Función agotada"}
                      </button>

                    </div>
                  </div>
                )}

                {/* TÍTULO */}

                <div className="titulo-seccion">
                  <div>
                    <h2>
                      Cartelera
                    </h2>

                    <p>
                      Explora nuestras
                      funciones disponibles
                      y reserva tus entradas.
                    </p>
                  </div>
                </div>

                {/* FILTROS */}

                <div className="panel-filtros">

                  <div className="filtro-grupo filtro-busqueda">

                    <label htmlFor="buscar-pelicula">
                      Buscar
                    </label>

                    <div className="buscador-contenedor">

                      <span className="buscador-icono">
                        ⌕
                      </span>

                      <input
                        id="buscar-pelicula"
                        type="search"
                        placeholder="Buscar película..."
                        value={busqueda}
                        onChange={(e) =>
                          setBusqueda(
                            e.target.value
                          )
                        }
                      />

                    </div>
                  </div>

                  <div className="filtro-grupo">

                    <label htmlFor="filtro-pelicula">
                      Película
                    </label>

                    <select
                      id="filtro-pelicula"
                      value={
                        filtroPelicula
                      }
                      onChange={(e) =>
                        setFiltroPelicula(
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        Todas
                      </option>

                      {peliculas
                        .filter(
                          (pelicula) =>
                            pelicula.activa
                        )
                        .map(
                          (pelicula) => (
                            <option
                              key={
                                pelicula.id
                              }
                              value={
                                pelicula.id
                              }
                            >
                              {
                                pelicula.titulo
                              }
                            </option>
                          )
                        )}

                    </select>

                  </div>

                  <div className="filtro-grupo">

                    <label htmlFor="filtro-genero">
                      Género
                    </label>

                    <select
                      id="filtro-genero"
                      value={
                        filtroGenero
                      }
                      onChange={(e) =>
                        setFiltroGenero(
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        Todos
                      </option>

                      {generosDisponibles.map(
                        (genero) => (
                          <option
                            key={genero}
                            value={genero}
                          >
                            {genero}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  <div className="filtro-grupo">

                    <label htmlFor="filtro-fecha">
                      Fecha
                    </label>

                    <select
                      id="filtro-fecha"
                      value={
                        filtroFecha
                      }
                      onChange={(e) =>
                        setFiltroFecha(
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        Todas las fechas
                      </option>

                      <option value="hoy">
                        Hoy
                      </option>

                      <option value="manana">
                        Mañana
                      </option>

                      <option value="proximos7">
                        Próximos 7 días
                      </option>

                    </select>

                  </div>

                </div>

                {/* CONTADOR */}

                <div className="resumen-filtros">

                  <p>
                    <strong>
                      {
                        funcionesCartelera.length
                      }
                    </strong>{" "}
                    {funcionesCartelera.length ===
                    1
                      ? "función encontrada"
                      : "funciones encontradas"}
                  </p>

                  {hayFiltrosActivos && (
                    <button
                      type="button"
                      className="btn-limpiar-filtros"
                      onClick={
                        limpiarFiltros
                      }
                    >
                      Limpiar filtros
                    </button>
                  )}

                </div>

                {/* TARJETAS */}

                {funcionesCartelera.length ===
                0 ? (
                  <div className="estado estado-cartelera">

                    <span className="estado-icono">
                      🎬
                    </span>

                    <h3>
                      No encontramos
                      funciones
                    </h3>

                    <p>
                      Prueba cambiando los
                      filtros o realizando
                      otra búsqueda.
                    </p>

                    {hayFiltrosActivos && (
                      <button
                        type="button"
                        className="btn-limpiar-filtros"
                        onClick={
                          limpiarFiltros
                        }
                      >
                        Mostrar toda la
                        cartelera
                      </button>
                    )}

                  </div>
                ) : (
                  <div className="grid">

                    {funcionesCartelera.map(
                      (funcion) => (
                        <FuncionCard
                          key={
                            funcion.id
                          }
                          funcion={
                            funcion
                          }
                          onReservar={
                            setFuncionSeleccionada
                          }
                        />
                      )
                    )}

                  </div>
                )}

                {/* ==================================================
                    MODAL PROFESIONAL DE RESERVA
                    ================================================== */}

                {funcionSeleccionada && (
                  <div className="modal-fondo">

                    <div className="modal modal-reserva">

                      {/* ENCABEZADO */}

                      <div className="reserva-modal-header">

                        <div>

                          <span className="reserva-modal-etiqueta">
                            Reserva de entradas
                          </span>

                          <h2>
                            {
                              funcionSeleccionada
                                .pelicula
                                .titulo
                            }
                          </h2>

                          <p className="reserva-modal-meta">
                            {
                              funcionSeleccionada
                                .pelicula
                                .genero
                            }
                            {" • "}
                            {
                              funcionSeleccionada
                                .pelicula
                                .duracion
                            }{" "}
                            min
                            {" • "}
                            {
                              funcionSeleccionada
                                .pelicula
                                .clasificacion
                            }
                          </p>

                        </div>

                        <button
                          type="button"
                          className="modal-cerrar"
                          onClick={
                            cerrarModalReserva
                          }
                          aria-label="Cerrar reserva"
                        >
                          ×
                        </button>

                      </div>

                      {/* INFORMACIÓN DE FUNCIÓN */}

                      <div className="reserva-funcion-resumen">

                        <div className="reserva-funcion-dato">

                          <span>
                            Fecha
                          </span>

                          <strong>
                            {new Date(
                              funcionSeleccionada.fechaHora
                            ).toLocaleDateString(
                              "es-EC",
                              {
                                weekday:
                                  "long",
                                day: "2-digit",
                                month:
                                  "long",
                              }
                            )}
                          </strong>

                        </div>

                        <div className="reserva-funcion-dato">

                          <span>
                            Hora
                          </span>

                          <strong>
                            {new Date(
                              funcionSeleccionada.fechaHora
                            ).toLocaleTimeString(
                              "es-EC",
                              {
                                hour: "2-digit",
                                minute:
                                  "2-digit",
                              }
                            )}
                          </strong>

                        </div>

                        <div className="reserva-funcion-dato">

                          <span>
                            Sala
                          </span>

                          <strong>
                            {
                              funcionSeleccionada
                                .sala
                                .nombre
                            }
                          </strong>

                        </div>

                      </div>

                      {/* FORMULARIO */}

                      <form
                        onSubmit={
                          manejarReserva
                        }
                      >

                        <div className="reserva-campos">

                          <label>
                            Nombre completo

                            <input
                              type="text"
                              required
                              placeholder="Ej. María López"
                              value={
                                reservaForm.nombre
                              }
                              onChange={(e) =>
                                setReservaForm({
                                  ...reservaForm,
                                  nombre:
                                    e.target.value,
                                })
                              }
                            />

                          </label>

                          <label>
                            Correo electrónico

                            <input
                              type="email"
                              required
                              placeholder="correo@ejemplo.com"
                              value={
                                reservaForm.correo
                              }
                              onChange={(e) =>
                                setReservaForm({
                                  ...reservaForm,
                                  correo:
                                    e.target.value,
                                })
                              }
                            />

                          </label>

                        </div>

                        {/* CANTIDAD */}

                        <div className="cantidad-seccion">

                          <div>

                            <span className="cantidad-titulo">
                              Entradas
                            </span>

                            <p>
                              {
                                funcionSeleccionada.disponibles
                              }{" "}
                              lugares disponibles
                            </p>

                          </div>

                          <div className="cantidad-selector">

                            <button
                              type="button"
                              className="cantidad-btn"
                              aria-label="Disminuir cantidad"
                              disabled={
                                Number(
                                  reservaForm.cantidad
                                ) <= 1
                              }
                              onClick={() =>
                                cambiarCantidadReserva(
                                  -1
                                )
                              }
                            >
                              −
                            </button>

                            <span className="cantidad-valor">
                              {
                                reservaForm.cantidad
                              }
                            </span>

                            <button
                              type="button"
                              className="cantidad-btn"
                              aria-label="Aumentar cantidad"
                              disabled={
                                Number(
                                  reservaForm.cantidad
                                ) >=
                                funcionSeleccionada.disponibles
                              }
                              onClick={() =>
                                cambiarCantidadReserva(
                                  1
                                )
                              }
                            >
                              +
                            </button>

                          </div>

                        </div>

                        {/* RESUMEN */}

                        <div className="reserva-resumen">

                          <div className="reserva-resumen-fila">

                            <span>
                              Precio por entrada
                            </span>

                            <strong>
                              $
                              {funcionSeleccionada.precio.toFixed(
                                2
                              )}
                            </strong>

                          </div>

                          <div className="reserva-resumen-fila">

                            <span>
                              Cantidad
                            </span>

                            <strong>
                              {
                                reservaForm.cantidad
                              }
                            </strong>

                          </div>

                          <div className="reserva-resumen-total">

                            <span>
                              Total estimado
                            </span>

                            <strong>
                              $
                              {totalVisual.toFixed(
                                2
                              )}
                            </strong>

                          </div>

                        </div>

                        {/* ACCIONES */}

                        <div className="reserva-acciones">

                          <button
                            type="submit"
                            className="btn-confirmar-reserva"
                          >
                            Confirmar reserva
                          </button>

                          <button
                            type="button"
                            className="btn-cancelar-reserva"
                            onClick={
                              cerrarModalReserva
                            }
                          >
                            Cancelar
                          </button>

                        </div>

                      </form>

                    </div>

                  </div>
                )}

              </section>
            )}

            {/* ==================================================
                RESERVAS
                ================================================== */}

            {vista === "reservas" && (
              <section>

                <h2>
                  Historial de reservas
                </h2>

                {reservas.length === 0 ? (
                  <p className="estado">
                    No existen reservas
                    registradas.
                  </p>
                ) : (
                  <div className="tabla-contenedor">

                    <table>

                      <thead>
                        <tr>
                          <th>
                            Cliente
                          </th>
                          <th>
                            Película
                          </th>
                          <th>
                            Entradas
                          </th>
                          <th>
                            Total
                          </th>
                          <th>
                            Estado
                          </th>
                          <th>
                            Acción
                          </th>
                        </tr>
                      </thead>

                      <tbody>

                        {reservas.map(
                          (reserva) => (
                            <tr
                              key={
                                reserva.id
                              }
                            >

                              <td>
                                {
                                  reserva
                                    .cliente
                                    .nombre
                                }

                                <br />

                                <small>
                                  {
                                    reserva
                                      .cliente
                                      .correo
                                  }
                                </small>
                              </td>

                              <td>
                                {
                                  reserva
                                    .funcion
                                    .pelicula
                                    .titulo
                                }
                              </td>

                              <td>
                                {
                                  reserva.cantidad
                                }
                              </td>

                              <td>
                                $
                                {reserva.total.toFixed(
                                  2
                                )}
                              </td>

                              <td>
                                <span
                                  className={
                                    reserva.estado ===
                                    "ACTIVA"
                                      ? "estado-activo"
                                      : "estado-cancelado"
                                  }
                                >
                                  {
                                    reserva.estado
                                  }
                                </span>
                              </td>

                              <td>
                                {reserva.estado ===
                                "ACTIVA" ? (
                                  <button
                                    className="peligro"
                                    onClick={() =>
                                      manejarCancelarReserva(
                                        reserva.id
                                      )
                                    }
                                  >
                                    Cancelar
                                  </button>
                                ) : (
                                  "-"
                                )}
                              </td>

                            </tr>
                          )
                        )}

                      </tbody>

                    </table>

                  </div>
                )}

              </section>
            )}

            {/* ==================================================
                ADMINISTRACIÓN
                ================================================== */}

            {vista === "admin" && (
              <section>

                <h2>
                  Administración
                </h2>

                <div className="formularios-admin">

                  {/* REGISTRAR PELÍCULA */}

                  <form
                    className="formulario-card"
                    onSubmit={
                      manejarCrearPelicula
                    }
                  >

                    <h3>
                      Registrar película
                    </h3>

                    <input
                      placeholder="Título"
                      required
                      value={
                        peliculaForm.titulo
                      }
                      onChange={(e) =>
                        setPeliculaForm({
                          ...peliculaForm,
                          titulo:
                            e.target.value,
                        })
                      }
                    />

                    <input
                      placeholder="Género"
                      required
                      value={
                        peliculaForm.genero
                      }
                      onChange={(e) =>
                        setPeliculaForm({
                          ...peliculaForm,
                          genero:
                            e.target.value,
                        })
                      }
                    />

                    <input
                      type="number"
                      min="1"
                      placeholder="Duración en minutos"
                      required
                      value={
                        peliculaForm.duracion
                      }
                      onChange={(e) =>
                        setPeliculaForm({
                          ...peliculaForm,
                          duracion:
                            e.target.value,
                        })
                      }
                    />

                    <input
                      placeholder="Clasificación"
                      required
                      value={
                        peliculaForm.clasificacion
                      }
                      onChange={(e) =>
                        setPeliculaForm({
                          ...peliculaForm,
                          clasificacion:
                            e.target.value,
                        })
                      }
                    />

                    <input
                      placeholder="URL de imagen (opcional)"
                      value={
                        peliculaForm.imagenUrl
                      }
                      onChange={(e) =>
                        setPeliculaForm({
                          ...peliculaForm,
                          imagenUrl:
                            e.target.value,
                        })
                      }
                    />

                    <button type="submit">
                      Registrar película
                    </button>

                  </form>

                  {/* REGISTRAR SALA */}

                  <form
                    className="formulario-card"
                    onSubmit={
                      manejarCrearSala
                    }
                  >

                    <h3>
                      Registrar sala
                    </h3>

                    <input
                      placeholder="Nombre de la sala"
                      required
                      value={
                        salaForm.nombre
                      }
                      onChange={(e) =>
                        setSalaForm({
                          ...salaForm,
                          nombre:
                            e.target.value,
                        })
                      }
                    />

                    <input
                      type="number"
                      min="1"
                      placeholder="Capacidad"
                      required
                      value={
                        salaForm.capacidad
                      }
                      onChange={(e) =>
                        setSalaForm({
                          ...salaForm,
                          capacidad:
                            e.target.value,
                        })
                      }
                    />

                    <button type="submit">
                      Registrar sala
                    </button>

                  </form>

                  {/* PROGRAMAR FUNCIÓN */}

                  <form
                    className="formulario-card"
                    onSubmit={
                      manejarCrearFuncion
                    }
                  >

                    <h3>
                      Programar función
                    </h3>

                    <select
                      required
                      value={
                        funcionForm.peliculaId
                      }
                      onChange={(e) =>
                        setFuncionForm({
                          ...funcionForm,
                          peliculaId:
                            e.target.value,
                        })
                      }
                    >
                      <option value="">
                        Seleccione película
                      </option>

                      {peliculas
                        .filter(
                          (pelicula) =>
                            pelicula.activa
                        )
                        .map(
                          (pelicula) => (
                            <option
                              key={
                                pelicula.id
                              }
                              value={
                                pelicula.id
                              }
                            >
                              {
                                pelicula.titulo
                              }
                            </option>
                          )
                        )}

                    </select>

                    <select
                      required
                      value={
                        funcionForm.salaId
                      }
                      onChange={(e) =>
                        setFuncionForm({
                          ...funcionForm,
                          salaId:
                            e.target.value,
                        })
                      }
                    >
                      <option value="">
                        Seleccione sala
                      </option>

                      {salas
                        .filter(
                          (sala) =>
                            sala.activa
                        )
                        .map(
                          (sala) => (
                            <option
                              key={
                                sala.id
                              }
                              value={
                                sala.id
                              }
                            >
                              {
                                sala.nombre
                              }
                            </option>
                          )
                        )}

                    </select>

                    <input
                      type="datetime-local"
                      required
                      value={
                        funcionForm.fechaHora
                      }
                      onChange={(e) =>
                        setFuncionForm({
                          ...funcionForm,
                          fechaHora:
                            e.target.value,
                        })
                      }
                    />

                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="Precio"
                      required
                      value={
                        funcionForm.precio
                      }
                      onChange={(e) =>
                        setFuncionForm({
                          ...funcionForm,
                          precio:
                            e.target.value,
                        })
                      }
                    />

                    <button type="submit">
                      Programar función
                    </button>

                  </form>

                </div>

                {/* LISTADOS */}

                <div className="listados-admin">

                  {/* PELÍCULAS */}

                  <div className="lista-admin">

                    <h3>
                      Películas registradas
                    </h3>

                    {peliculas.length ===
                    0 ? (
                      <p className="estado">
                        No existen películas
                        registradas.
                      </p>
                    ) : (
                      <div className="tabla-contenedor">

                        <table>

                          <thead>
                            <tr>
                              <th>
                                Título
                              </th>
                              <th>
                                Género
                              </th>
                              <th>
                                Duración
                              </th>
                              <th>
                                Clasificación
                              </th>
                              <th>
                                Estado
                              </th>
                              <th>
                                Acción
                              </th>
                            </tr>
                          </thead>

                          <tbody>

                            {peliculas.map(
                              (
                                pelicula
                              ) => (
                                <tr
                                  key={
                                    pelicula.id
                                  }
                                >

                                  <td>
                                    {
                                      pelicula.titulo
                                    }
                                  </td>

                                  <td>
                                    {
                                      pelicula.genero
                                    }
                                  </td>

                                  <td>
                                    {
                                      pelicula.duracion
                                    }{" "}
                                    min
                                  </td>

                                  <td>
                                    {
                                      pelicula.clasificacion
                                    }
                                  </td>

                                  <td>
                                    <span
                                      className={
                                        pelicula.activa
                                          ? "estado-activo"
                                          : "estado-cancelado"
                                      }
                                    >
                                      {pelicula.activa
                                        ? "ACTIVA"
                                        : "INACTIVA"}
                                    </span>
                                  </td>

                                  <td>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        abrirEdicionPelicula(
                                          pelicula
                                        )
                                      }
                                    >
                                      Editar
                                    </button>
                                  </td>

                                </tr>
                              )
                            )}

                          </tbody>

                        </table>

                      </div>
                    )}

                  </div>

                  {/* SALAS */}

                  <div className="lista-admin">

                    <h3>
                      Salas registradas
                    </h3>

                    {salas.length === 0 ? (
                      <p className="estado">
                        No existen salas
                        registradas.
                      </p>
                    ) : (
                      <div className="tabla-contenedor">

                        <table>

                          <thead>
                            <tr>
                              <th>
                                Nombre
                              </th>
                              <th>
                                Capacidad máxima
                              </th>
                              <th>
                                Estado
                              </th>
                            </tr>
                          </thead>

                          <tbody>

                            {salas.map(
                              (sala) => (
                                <tr
                                  key={
                                    sala.id
                                  }
                                >

                                  <td>
                                    {
                                      sala.nombre
                                    }
                                  </td>

                                  <td>
                                    {
                                      sala.capacidad
                                    }
                                  </td>

                                  <td>
                                    <span
                                      className={
                                        sala.activa
                                          ? "estado-activo"
                                          : "estado-cancelado"
                                      }
                                    >
                                      {sala.activa
                                        ? "ACTIVA"
                                        : "INACTIVA"}
                                    </span>
                                  </td>

                                </tr>
                              )
                            )}

                          </tbody>

                        </table>

                      </div>
                    )}

                  </div>

                  {/* FUNCIONES */}

                  <div className="lista-admin">

                    <h3>
                      Funciones programadas
                    </h3>

                    {funciones.length ===
                    0 ? (
                      <p className="estado">
                        No existen funciones
                        programadas.
                      </p>
                    ) : (
                      <div className="tabla-contenedor">

                        <table>

                          <thead>
                            <tr>
                              <th>
                                Película
                              </th>
                              <th>
                                Sala
                              </th>
                              <th>
                                Fecha y hora
                              </th>
                              <th>
                                Precio
                              </th>
                              <th>
                                Disponibles
                              </th>
                              <th>
                                Estado
                              </th>
                            </tr>
                          </thead>

                          <tbody>

                            {funciones.map(
                              (
                                funcion
                              ) => (
                                <tr
                                  key={
                                    funcion.id
                                  }
                                >

                                  <td>
                                    {
                                      funcion
                                        .pelicula
                                        .titulo
                                    }
                                  </td>

                                  <td>
                                    {
                                      funcion
                                        .sala
                                        .nombre
                                    }
                                  </td>

                                  <td>
                                    {new Date(
                                      funcion.fechaHora
                                    ).toLocaleString(
                                      "es-EC"
                                    )}
                                  </td>

                                  <td>
                                    $
                                    {funcion.precio.toFixed(
                                      2
                                    )}
                                  </td>

                                  <td>
                                    {
                                      funcion.disponibles
                                    }
                                  </td>

                                  <td>
                                    <span
                                      className={
                                        funcion.estado ===
                                        "ACTIVA"
                                          ? "estado-activo"
                                          : "estado-cancelado"
                                      }
                                    >
                                      {
                                        funcion.estado
                                      }
                                    </span>
                                  </td>

                                </tr>
                              )
                            )}

                          </tbody>

                        </table>

                      </div>
                    )}

                  </div>

                </div>

                {/* ==================================================
                    MODAL EDITAR PELÍCULA
                    ================================================== */}

                {peliculaEditando && (
                  <div className="modal-fondo">

                    <div className="modal">

                      <h2>
                        Editar película
                      </h2>

                      <form
                        onSubmit={
                          manejarEditarPelicula
                        }
                      >

                        <label>
                          Título

                          <input
                            type="text"
                            required
                            value={
                              edicionPeliculaForm.titulo
                            }
                            onChange={(e) =>
                              setEdicionPeliculaForm({
                                ...edicionPeliculaForm,
                                titulo:
                                  e.target.value,
                              })
                            }
                          />

                        </label>

                        <label>
                          Género

                          <input
                            type="text"
                            required
                            value={
                              edicionPeliculaForm.genero
                            }
                            onChange={(e) =>
                              setEdicionPeliculaForm({
                                ...edicionPeliculaForm,
                                genero:
                                  e.target.value,
                              })
                            }
                          />

                        </label>

                        <label>
                          Duración en minutos

                          <input
                            type="number"
                            min="1"
                            required
                            value={
                              edicionPeliculaForm.duracion
                            }
                            onChange={(e) =>
                              setEdicionPeliculaForm({
                                ...edicionPeliculaForm,
                                duracion:
                                  e.target.value,
                              })
                            }
                          />

                        </label>

                        <label>
                          Clasificación

                          <input
                            type="text"
                            required
                            value={
                              edicionPeliculaForm.clasificacion
                            }
                            onChange={(e) =>
                              setEdicionPeliculaForm({
                                ...edicionPeliculaForm,
                                clasificacion:
                                  e.target.value,
                              })
                            }
                          />

                        </label>

                        <label>
                          URL de imagen

                          <input
                            type="text"
                            value={
                              edicionPeliculaForm.imagenUrl
                            }
                            onChange={(e) =>
                              setEdicionPeliculaForm({
                                ...edicionPeliculaForm,
                                imagenUrl:
                                  e.target.value,
                              })
                            }
                          />

                        </label>

                        <label>

                          <input
                            type="checkbox"
                            checked={
                              edicionPeliculaForm.activa
                            }
                            onChange={(e) =>
                              setEdicionPeliculaForm({
                                ...edicionPeliculaForm,
                                activa:
                                  e.target.checked,
                              })
                            }
                          />

                          Película activa

                        </label>

                        <div className="acciones">

                          <button type="submit">
                            Guardar cambios
                          </button>

                          <button
                            type="button"
                            className="secundario"
                            onClick={
                              cerrarEdicionPelicula
                            }
                          >
                            Cancelar
                          </button>

                        </div>

                      </form>

                    </div>

                  </div>
                )}

              </section>
            )}

          </>
        )}

      </main>

    </div>
  );
}

export default App;