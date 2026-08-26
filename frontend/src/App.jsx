import { useEffect, useState } from "react";
import "./App.css";
import Mensaje from "./components/Mensaje";
import FuncionCard from "./components/FuncionCard";
import CargaVista from "./components/CargaVista";

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
     FILTROS DEL HISTORIAL DE RESERVAS
     ====================================================== */

  const [busquedaReserva, setBusquedaReserva] = useState("");
  const [filtroEstadoReserva, setFiltroEstadoReserva] = useState("");
  const [reservaACancelar, setReservaACancelar] = useState(null);


  /* ======================================================
     ADMINISTRACIÓN
     ====================================================== */

  const [seccionAdmin, setSeccionAdmin] = useState("peliculas");
  const [modalAdmin, setModalAdmin] = useState(null);

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
     MODALES DE ADMINISTRACIÓN
     ====================================================== */

  function abrirModalAdmin(tipo) {
    setError("");
    setModalAdmin(tipo);
  }

  function cerrarModalAdmin() {
    setModalAdmin(null);
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

  function cerrarConfirmacionCancelacion() {
    setReservaACancelar(null);
  }

  async function manejarCancelarReserva(id) {
    try {
      setError("");

      await cancelarReserva(id);

      mostrarMensaje(
        "Reserva cancelada correctamente."
      );

      setReservaACancelar(null);

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

      setModalAdmin(null);

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

      setModalAdmin(null);

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

      setModalAdmin(null);

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
     HISTORIAL DE RESERVAS
     ====================================================== */

  const reservasFiltradas = reservas
    .filter((reserva) => {
      const termino = normalizarTexto(busquedaReserva);

      const coincideBusqueda =
        termino === "" ||
        normalizarTexto(reserva.cliente?.nombre).includes(termino) ||
        normalizarTexto(reserva.cliente?.correo).includes(termino) ||
        normalizarTexto(
          reserva.funcion?.pelicula?.titulo
        ).includes(termino);

      const coincideEstado =
        filtroEstadoReserva === "" ||
        reserva.estado === filtroEstadoReserva;

      return coincideBusqueda && coincideEstado;
    })
    .sort(
      (a, b) =>
        new Date(b.fechaCreada) -
        new Date(a.fechaCreada)
    );

  const reservasActivasLista = reservas.filter(
    (reserva) => reserva.estado === "ACTIVA"
  );

  const reservasCanceladasLista = reservas.filter(
    (reserva) => reserva.estado === "CANCELADA"
  );

  const entradasActivas = reservasActivasLista.reduce(
    (total, reserva) =>
      total + Number(reserva.cantidad || 0),
    0
  );

  const valorReservasActivas = reservasActivasLista.reduce(
    (total, reserva) =>
      total + Number(reserva.total || 0),
    0
  );

  const hayFiltrosReservaActivos =
    busquedaReserva.trim() !== "" ||
    filtroEstadoReserva !== "";

  function limpiarFiltrosReserva() {
    setBusquedaReserva("");
    setFiltroEstadoReserva("");
  }

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

  /* ======================================================
     ESTADÍSTICAS DE ADMINISTRACIÓN
     ====================================================== */

  const peliculasActivas = peliculas.filter(
    (pelicula) => pelicula.activa
  ).length;

  const salasActivas = salas.filter(
    (sala) => sala.activa
  ).length;

  const funcionesProximas = funciones.filter((funcion) => {
    return (
      funcion.estado === "ACTIVA" &&
      funcion.pelicula.activa &&
      new Date(funcion.fechaHora) > new Date()
    );
  }).length;

  const reservasActivas = reservas.filter(
    (reserva) => reserva.estado === "ACTIVA"
  ).length;

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
          <CargaVista vista={vista} />
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
              <section className="reservas-page">

                {/* CABECERA */}

                <div className="reservas-cabecera">
                  <div>
                    <span className="reservas-kicker">
                      Gestión de reservas
                    </span>

                    <h2>
                      Historial de reservas
                    </h2>

                    <p>
                      Consulta las reservas realizadas,
                      revisa su estado y cancela las que
                      sigan activas.
                    </p>
                  </div>
                </div>

                {/* ESTADÍSTICAS */}

                <div className="reservas-estadisticas">

                  <div className="reserva-stat-card">
                    <span className="reserva-stat-etiqueta">
                      Total reservas
                    </span>

                    <strong>
                      {reservas.length}
                    </strong>

                    <small>
                      Registros históricos
                    </small>
                  </div>

                  <div className="reserva-stat-card">
                    <span className="reserva-stat-etiqueta">
                      Activas
                    </span>

                    <strong>
                      {reservasActivasLista.length}
                    </strong>

                    <small>
                      {reservasCanceladasLista.length} canceladas
                    </small>
                  </div>

                  <div className="reserva-stat-card">
                    <span className="reserva-stat-etiqueta">
                      Entradas activas
                    </span>

                    <strong>
                      {entradasActivas}
                    </strong>

                    <small>
                      Boletos reservados
                    </small>
                  </div>

                  <div className="reserva-stat-card">
                    <span className="reserva-stat-etiqueta">
                      Valor activo
                    </span>

                    <strong>
                      ${valorReservasActivas.toFixed(2)}
                    </strong>

                    <small>
                      Reservas no canceladas
                    </small>
                  </div>

                </div>

                {/* FILTROS */}

                <div className="reservas-filtros">

                  <div className="reserva-filtro-busqueda">

                    <label htmlFor="buscar-reserva">
                      Buscar
                    </label>

                    <input
                      id="buscar-reserva"
                      type="search"
                      placeholder="Cliente, correo o película..."
                      value={busquedaReserva}
                      onChange={(e) =>
                        setBusquedaReserva(e.target.value)
                      }
                    />

                  </div>

                  <div>

                    <label htmlFor="estado-reserva">
                      Estado
                    </label>

                    <select
                      id="estado-reserva"
                      value={filtroEstadoReserva}
                      onChange={(e) =>
                        setFiltroEstadoReserva(e.target.value)
                      }
                    >

                      <option value="">
                        Todos los estados
                      </option>

                      <option value="ACTIVA">
                        Activas
                      </option>

                      <option value="CANCELADA">
                        Canceladas
                      </option>

                    </select>

                  </div>

                </div>

                {/* RESULTADOS */}

                <div className="reservas-resumen-resultados">

                  <p>
                    <strong>
                      {reservasFiltradas.length}
                    </strong>{" "}
                    {reservasFiltradas.length === 1
                      ? "reserva encontrada"
                      : "reservas encontradas"}
                  </p>

                  {hayFiltrosReservaActivos && (
                    <button
                      type="button"
                      className="btn-limpiar-filtros"
                      onClick={limpiarFiltrosReserva}
                    >
                      Limpiar filtros
                    </button>
                  )}

                </div>

                {/* TABLA */}

                {reservasFiltradas.length === 0 ? (

                  <div className="estado reserva-estado-vacio">

                    <h3>
                      No encontramos reservas
                    </h3>

                    <p>
                      No existen registros que coincidan
                      con los filtros seleccionados.
                    </p>

                    {hayFiltrosReservaActivos && (
                      <button
                        type="button"
                        className="btn-limpiar-filtros"
                        onClick={limpiarFiltrosReserva}
                      >
                        Mostrar todas las reservas
                      </button>
                    )}

                  </div>

                ) : (

                  <div className="tabla-contenedor reservas-tabla">

                    <table>

                      <thead>
                        <tr>
                          <th>Cliente</th>
                          <th>Película / función</th>
                          <th>Registrada</th>
                          <th>Entradas</th>
                          <th>Total</th>
                          <th>Estado</th>
                          <th>Acción</th>
                        </tr>
                      </thead>

                      <tbody>

                        {reservasFiltradas.map((reserva) => (

                          <tr key={reserva.id}>

                            <td>
                              <div className="reserva-cliente">

                                <strong>
                                  {reserva.cliente.nombre}
                                </strong>

                                <span>
                                  {reserva.cliente.correo}
                                </span>

                              </div>
                            </td>

                            <td>
                              <div className="reserva-funcion-tabla">

                                <strong>
                                  {reserva.funcion.pelicula.titulo}
                                </strong>

                                <span>
                                  {new Date(
                                    reserva.funcion.fechaHora
                                  ).toLocaleString("es-EC", {
                                    day: "2-digit",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}

                                  {" · "}

                                  {reserva.funcion.sala?.nombre}
                                </span>

                              </div>
                            </td>

                            <td>
                              {reserva.fechaCreada
                                ? new Date(
                                    reserva.fechaCreada
                                  ).toLocaleString("es-EC", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "-"}
                            </td>

                            <td>
                              <span className="reserva-cantidad-tabla">
                                {reserva.cantidad}
                              </span>
                            </td>

                            <td>
                              <strong className="reserva-total-tabla">
                                ${reserva.total.toFixed(2)}
                              </strong>
                            </td>

                            <td>
                              <span
                                className={
                                  reserva.estado === "ACTIVA"
                                    ? "estado-activo"
                                    : "estado-cancelado"
                                }
                              >
                                {reserva.estado}
                              </span>
                            </td>

                            <td>
                              {reserva.estado === "ACTIVA" ? (

                                <button
                                  type="button"
                                  className="peligro"
                                  onClick={() =>
                                    setReservaACancelar(reserva)
                                  }
                                >
                                  Cancelar
                                </button>

                              ) : (

                                <span className="reserva-sin-accion">
                                  Sin acciones
                                </span>

                              )}
                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                )}

                {/* MODAL DE CONFIRMACIÓN */}

                {reservaACancelar && (

                  <div className="modal-fondo">

                    <div className="modal modal-cancelacion">

                      <span className="cancelacion-kicker">
                        Confirmar cancelación
                      </span>

                      <h2>
                        ¿Cancelar esta reserva?
                      </h2>

                      <p>
                        La reserva de{" "}

                        <strong>
                          {reservaACancelar.cliente.nombre}
                        </strong>

                        {" "}para{" "}

                        <strong>
                          {
                            reservaACancelar.funcion
                              .pelicula.titulo
                          }
                        </strong>

                        {" "}quedará registrada como cancelada.
                      </p>

                      <div className="cancelacion-resumen">

                        <span>
                          {reservaACancelar.cantidad} entrada(s)
                        </span>

                        <strong>
                          ${reservaACancelar.total.toFixed(2)}
                        </strong>

                      </div>

                      <div className="cancelacion-acciones">

                        <button
                          type="button"
                          className="btn-confirmar-cancelacion"
                          onClick={() =>
                            manejarCancelarReserva(
                              reservaACancelar.id
                            )
                          }
                        >
                          Sí, cancelar reserva
                        </button>

                        <button
                          type="button"
                          className="secundario"
                          onClick={
                            cerrarConfirmacionCancelacion
                          }
                        >
                          Volver
                        </button>

                      </div>

                    </div>

                  </div>

                )}

              </section>
            )}

            {/* ==================================================
                ADMINISTRACIÓN
                ================================================== */}

            {vista === "admin" && (
              <section className="admin-page">

                {/* ENCABEZADO */}

                <div className="admin-cabecera">
                  <div>
                    <span className="admin-kicker">
                      Panel de gestión
                    </span>

                    <h2>
                      Administración
                    </h2>

                    <p>
                      Gestiona películas, salas y funciones desde un solo lugar.
                    </p>
                  </div>

                  <div className="admin-acciones-principales">
                    <button
                      type="button"
                      className="admin-btn-accion"
                      onClick={() => {
                        setSeccionAdmin("peliculas");
                        abrirModalAdmin("pelicula");
                      }}
                    >
                      <span>+</span>
                      Nueva película
                    </button>

                    <button
                      type="button"
                      className="admin-btn-accion secundario-admin"
                      onClick={() => {
                        setSeccionAdmin("salas");
                        abrirModalAdmin("sala");
                      }}
                    >
                      <span>+</span>
                      Nueva sala
                    </button>

                    <button
                      type="button"
                      className="admin-btn-accion secundario-admin"
                      onClick={() => {
                        setSeccionAdmin("funciones");
                        abrirModalAdmin("funcion");
                      }}
                    >
                      <span>+</span>
                      Nueva función
                    </button>
                  </div>
                </div>

                {/* ESTADÍSTICAS */}

                <div className="admin-estadisticas">

                  <article className="admin-stat-card">
                    <div className="admin-stat-icono">
                      P
                    </div>

                    <div>
                      <span className="admin-stat-etiqueta">
                        Películas
                      </span>

                      <strong>
                        {peliculas.length}
                      </strong>

                      <small>
                        {peliculasActivas} activas
                      </small>
                    </div>
                  </article>

                  <article className="admin-stat-card">
                    <div className="admin-stat-icono">
                      S
                    </div>

                    <div>
                      <span className="admin-stat-etiqueta">
                        Salas
                      </span>

                      <strong>
                        {salas.length}
                      </strong>

                      <small>
                        {salasActivas} activas
                      </small>
                    </div>
                  </article>

                  <article className="admin-stat-card">
                    <div className="admin-stat-icono">
                      F
                    </div>

                    <div>
                      <span className="admin-stat-etiqueta">
                        Funciones
                      </span>

                      <strong>
                        {funciones.length}
                      </strong>

                      <small>
                        {funcionesProximas} próximas
                      </small>
                    </div>
                  </article>

                  <article className="admin-stat-card">
                    <div className="admin-stat-icono">
                      R
                    </div>

                    <div>
                      <span className="admin-stat-etiqueta">
                        Reservas
                      </span>

                      <strong>
                        {reservas.length}
                      </strong>

                      <small>
                        {reservasActivas} activas
                      </small>
                    </div>
                  </article>

                </div>

                {/* NAVEGACIÓN INTERNA */}

                <div className="admin-tabs">
                  <button
                    type="button"
                    className={
                      seccionAdmin === "peliculas"
                        ? "activo"
                        : ""
                    }
                    onClick={() =>
                      setSeccionAdmin("peliculas")
                    }
                  >
                    Películas
                    <span>
                      {peliculas.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    className={
                      seccionAdmin === "salas"
                        ? "activo"
                        : ""
                    }
                    onClick={() =>
                      setSeccionAdmin("salas")
                    }
                  >
                    Salas
                    <span>
                      {salas.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    className={
                      seccionAdmin === "funciones"
                        ? "activo"
                        : ""
                    }
                    onClick={() =>
                      setSeccionAdmin("funciones")
                    }
                  >
                    Funciones
                    <span>
                      {funciones.length}
                    </span>
                  </button>
                </div>

                {/* PANEL DE CONTENIDO */}

                <div className="admin-panel">

                  {/* PELÍCULAS */}

                  {seccionAdmin === "peliculas" && (
                    <>
                      <div className="admin-panel-header">
                        <div>
                          <h3>
                            Películas registradas
                          </h3>

                          <p>
                            Consulta el catálogo y administra el estado de cada película.
                          </p>
                        </div>

                        <button
                          type="button"
                          className="admin-btn-tabla"
                          onClick={() =>
                            abrirModalAdmin("pelicula")
                          }
                        >
                          + Nueva película
                        </button>
                      </div>

                      {peliculas.length === 0 ? (
                        <div className="estado admin-vacio">
                          <h3>
                            No existen películas registradas
                          </h3>

                          <p>
                            Registra la primera película para comenzar a programar funciones.
                          </p>

                          <button
                            type="button"
                            className="admin-btn-tabla"
                            onClick={() =>
                              abrirModalAdmin("pelicula")
                            }
                          >
                            Registrar película
                          </button>
                        </div>
                      ) : (
                        <div className="tabla-contenedor">
                          <table>
                            <thead>
                              <tr>
                                <th>Título</th>
                                <th>Género</th>
                                <th>Duración</th>
                                <th>Clasificación</th>
                                <th>Estado</th>
                                <th>Acción</th>
                              </tr>
                            </thead>

                            <tbody>
                              {peliculas.map((pelicula) => (
                                <tr key={pelicula.id}>
                                  <td>
                                    <div className="tabla-titulo">
                                      {pelicula.imagenUrl ? (
                                        <img
                                          src={pelicula.imagenUrl}
                                          alt=""
                                          className="admin-mini-poster"
                                        />
                                      ) : (
                                        <div className="admin-mini-poster sin-poster">
                                          P
                                        </div>
                                      )}

                                      <strong>
                                        {pelicula.titulo}
                                      </strong>
                                    </div>
                                  </td>

                                  <td>
                                    {pelicula.genero}
                                  </td>

                                  <td>
                                    {pelicula.duracion} min
                                  </td>

                                  <td>
                                    {pelicula.clasificacion}
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
                                      className="admin-btn-editar"
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
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </>
                  )}

                  {/* SALAS */}

                  {seccionAdmin === "salas" && (
                    <>
                      <div className="admin-panel-header">
                        <div>
                          <h3>
                            Salas registradas
                          </h3>

                          <p>
                            Revisa la capacidad y disponibilidad administrativa de las salas.
                          </p>
                        </div>

                        <button
                          type="button"
                          className="admin-btn-tabla"
                          onClick={() =>
                            abrirModalAdmin("sala")
                          }
                        >
                          + Nueva sala
                        </button>
                      </div>

                      {salas.length === 0 ? (
                        <div className="estado admin-vacio">
                          <h3>
                            No existen salas registradas
                          </h3>

                          <p>
                            Registra una sala antes de programar funciones.
                          </p>

                          <button
                            type="button"
                            className="admin-btn-tabla"
                            onClick={() =>
                              abrirModalAdmin("sala")
                            }
                          >
                            Registrar sala
                          </button>
                        </div>
                      ) : (
                        <div className="tabla-contenedor">
                          <table>
                            <thead>
                              <tr>
                                <th>Nombre</th>
                                <th>Capacidad máxima</th>
                                <th>Estado</th>
                              </tr>
                            </thead>

                            <tbody>
                              {salas.map((sala) => (
                                <tr key={sala.id}>
                                  <td>
                                    <strong>
                                      {sala.nombre}
                                    </strong>
                                  </td>

                                  <td>
                                    {sala.capacidad} personas
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
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </>
                  )}

                  {/* FUNCIONES */}

                  {seccionAdmin === "funciones" && (
                    <>
                      <div className="admin-panel-header">
                        <div>
                          <h3>
                            Funciones programadas
                          </h3>

                          <p>
                            Consulta horarios, salas, precios y disponibilidad.
                          </p>
                        </div>

                        <button
                          type="button"
                          className="admin-btn-tabla"
                          onClick={() =>
                            abrirModalAdmin("funcion")
                          }
                        >
                          + Nueva función
                        </button>
                      </div>

                      {funciones.length === 0 ? (
                        <div className="estado admin-vacio">
                          <h3>
                            No existen funciones programadas
                          </h3>

                          <p>
                            Programa una función utilizando una película y una sala activas.
                          </p>

                          <button
                            type="button"
                            className="admin-btn-tabla"
                            onClick={() =>
                              abrirModalAdmin("funcion")
                            }
                          >
                            Programar función
                          </button>
                        </div>
                      ) : (
                        <div className="tabla-contenedor">
                          <table>
                            <thead>
                              <tr>
                                <th>Película</th>
                                <th>Sala</th>
                                <th>Fecha y hora</th>
                                <th>Precio</th>
                                <th>Disponibles</th>
                                <th>Estado</th>
                              </tr>
                            </thead>

                            <tbody>
                              {funciones.map((funcion) => (
                                <tr key={funcion.id}>
                                  <td>
                                    <strong>
                                      {funcion.pelicula.titulo}
                                    </strong>
                                  </td>

                                  <td>
                                    {funcion.sala.nombre}
                                  </td>

                                  <td>
                                    {new Date(
                                      funcion.fechaHora
                                    ).toLocaleString(
                                      "es-EC"
                                    )}
                                  </td>

                                  <td>
                                    ${funcion.precio.toFixed(2)}
                                  </td>

                                  <td>
                                    {funcion.disponibles}
                                  </td>

                                  <td>
                                    <span
                                      className={
                                        funcion.estado === "ACTIVA"
                                          ? "estado-activo"
                                          : "estado-cancelado"
                                      }
                                    >
                                      {funcion.estado}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </>
                  )}

                </div>

                {/* ==================================================
                    MODAL NUEVA PELÍCULA
                    ================================================== */}

                {modalAdmin === "pelicula" && (
                  <div className="modal-fondo">
                    <div className="modal modal-admin">

                      <div className="admin-modal-header">
                        <div>
                          <span>
                            Catálogo
                          </span>

                          <h2>
                            Nueva película
                          </h2>

                          <p>
                            Ingresa la información que se mostrará en la cartelera.
                          </p>
                        </div>

                        <button
                          type="button"
                          className="modal-cerrar"
                          onClick={cerrarModalAdmin}
                          aria-label="Cerrar"
                        >
                          ×
                        </button>
                      </div>

                      <form onSubmit={manejarCrearPelicula}>

                        <label>
                          Título
                          <input
                            type="text"
                            placeholder="Ej. Interestelar"
                            required
                            value={peliculaForm.titulo}
                            onChange={(e) =>
                              setPeliculaForm({
                                ...peliculaForm,
                                titulo: e.target.value,
                              })
                            }
                          />
                        </label>

                        <div className="admin-form-grid">
                          <label>
                            Género
                            <input
                              type="text"
                              placeholder="Ej. Ciencia ficción"
                              required
                              value={peliculaForm.genero}
                              onChange={(e) =>
                                setPeliculaForm({
                                  ...peliculaForm,
                                  genero: e.target.value,
                                })
                              }
                            />
                          </label>

                          <label>
                            Duración
                            <input
                              type="number"
                              min="1"
                              placeholder="Minutos"
                              required
                              value={peliculaForm.duracion}
                              onChange={(e) =>
                                setPeliculaForm({
                                  ...peliculaForm,
                                  duracion: e.target.value,
                                })
                              }
                            />
                          </label>
                        </div>

                        <label>
                          Clasificación
                          <input
                            type="text"
                            placeholder="Ej. PG-13"
                            required
                            value={peliculaForm.clasificacion}
                            onChange={(e) =>
                              setPeliculaForm({
                                ...peliculaForm,
                                clasificacion: e.target.value,
                              })
                            }
                          />
                        </label>

                        <label>
                          URL de imagen
                          <input
                            type="url"
                            placeholder="https://..."
                            value={peliculaForm.imagenUrl}
                            onChange={(e) =>
                              setPeliculaForm({
                                ...peliculaForm,
                                imagenUrl: e.target.value,
                              })
                            }
                          />
                        </label>

                        <div className="admin-modal-acciones">
                          <button type="submit">
                            Registrar película
                          </button>

                          <button
                            type="button"
                            className="secundario"
                            onClick={cerrarModalAdmin}
                          >
                            Cancelar
                          </button>
                        </div>

                      </form>
                    </div>
                  </div>
                )}

                {/* ==================================================
                    MODAL NUEVA SALA
                    ================================================== */}

                {modalAdmin === "sala" && (
                  <div className="modal-fondo">
                    <div className="modal modal-admin">

                      <div className="admin-modal-header">
                        <div>
                          <span>
                            Infraestructura
                          </span>

                          <h2>
                            Nueva sala
                          </h2>

                          <p>
                            Define el nombre y la capacidad máxima de la sala.
                          </p>
                        </div>

                        <button
                          type="button"
                          className="modal-cerrar"
                          onClick={cerrarModalAdmin}
                          aria-label="Cerrar"
                        >
                          ×
                        </button>
                      </div>

                      <form onSubmit={manejarCrearSala}>

                        <label>
                          Nombre de la sala
                          <input
                            type="text"
                            placeholder="Ej. Sala 1"
                            required
                            value={salaForm.nombre}
                            onChange={(e) =>
                              setSalaForm({
                                ...salaForm,
                                nombre: e.target.value,
                              })
                            }
                          />
                        </label>

                        <label>
                          Capacidad máxima
                          <input
                            type="number"
                            min="1"
                            placeholder="Ej. 40"
                            required
                            value={salaForm.capacidad}
                            onChange={(e) =>
                              setSalaForm({
                                ...salaForm,
                                capacidad: e.target.value,
                              })
                            }
                          />
                        </label>

                        <div className="admin-modal-acciones">
                          <button type="submit">
                            Registrar sala
                          </button>

                          <button
                            type="button"
                            className="secundario"
                            onClick={cerrarModalAdmin}
                          >
                            Cancelar
                          </button>
                        </div>

                      </form>
                    </div>
                  </div>
                )}

                {/* ==================================================
                    MODAL NUEVA FUNCIÓN
                    ================================================== */}

                {modalAdmin === "funcion" && (
                  <div className="modal-fondo">
                    <div className="modal modal-admin">

                      <div className="admin-modal-header">
                        <div>
                          <span>
                            Programación
                          </span>

                          <h2>
                            Nueva función
                          </h2>

                          <p>
                            Selecciona película, sala, fecha, hora y precio.
                          </p>
                        </div>

                        <button
                          type="button"
                          className="modal-cerrar"
                          onClick={cerrarModalAdmin}
                          aria-label="Cerrar"
                        >
                          ×
                        </button>
                      </div>

                      <form onSubmit={manejarCrearFuncion}>

                        <label>
                          Película
                          <select
                            required
                            value={funcionForm.peliculaId}
                            onChange={(e) =>
                              setFuncionForm({
                                ...funcionForm,
                                peliculaId: e.target.value,
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
                              .map((pelicula) => (
                                <option
                                  key={pelicula.id}
                                  value={pelicula.id}
                                >
                                  {pelicula.titulo}
                                </option>
                              ))}
                          </select>
                        </label>

                        <label>
                          Sala
                          <select
                            required
                            value={funcionForm.salaId}
                            onChange={(e) =>
                              setFuncionForm({
                                ...funcionForm,
                                salaId: e.target.value,
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
                              .map((sala) => (
                                <option
                                  key={sala.id}
                                  value={sala.id}
                                >
                                  {sala.nombre}
                                </option>
                              ))}
                          </select>
                        </label>

                        <div className="admin-form-grid">
                          <label>
                            Fecha y hora
                            <input
                              type="datetime-local"
                              required
                              value={funcionForm.fechaHora}
                              onChange={(e) =>
                                setFuncionForm({
                                  ...funcionForm,
                                  fechaHora: e.target.value,
                                })
                              }
                            />
                          </label>

                          <label>
                            Precio
                            <input
                              type="number"
                              step="0.01"
                              min="0.01"
                              placeholder="Ej. 5.50"
                              required
                              value={funcionForm.precio}
                              onChange={(e) =>
                                setFuncionForm({
                                  ...funcionForm,
                                  precio: e.target.value,
                                })
                              }
                            />
                          </label>
                        </div>

                        <div className="admin-modal-acciones">
                          <button type="submit">
                            Programar función
                          </button>

                          <button
                            type="button"
                            className="secundario"
                            onClick={cerrarModalAdmin}
                          >
                            Cancelar
                          </button>
                        </div>

                      </form>
                    </div>
                  </div>
                )}

                {/* ==================================================
                    MODAL EDITAR PELÍCULA
                    ================================================== */}

                {peliculaEditando && (
                  <div className="modal-fondo">
                    <div className="modal modal-admin">

                      <div className="admin-modal-header">
                        <div>
                          <span>
                            Catálogo
                          </span>

                          <h2>
                            Editar película
                          </h2>

                          <p>
                            Actualiza los datos o cambia el estado de la película.
                          </p>
                        </div>

                        <button
                          type="button"
                          className="modal-cerrar"
                          onClick={cerrarEdicionPelicula}
                          aria-label="Cerrar"
                        >
                          ×
                        </button>
                      </div>

                      <form onSubmit={manejarEditarPelicula}>

                        <label>
                          Título
                          <input
                            type="text"
                            required
                            value={edicionPeliculaForm.titulo}
                            onChange={(e) =>
                              setEdicionPeliculaForm({
                                ...edicionPeliculaForm,
                                titulo: e.target.value,
                              })
                            }
                          />
                        </label>

                        <div className="admin-form-grid">
                          <label>
                            Género
                            <input
                              type="text"
                              required
                              value={edicionPeliculaForm.genero}
                              onChange={(e) =>
                                setEdicionPeliculaForm({
                                  ...edicionPeliculaForm,
                                  genero: e.target.value,
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
                              value={edicionPeliculaForm.duracion}
                              onChange={(e) =>
                                setEdicionPeliculaForm({
                                  ...edicionPeliculaForm,
                                  duracion: e.target.value,
                                })
                              }
                            />
                          </label>
                        </div>

                        <label>
                          Clasificación
                          <input
                            type="text"
                            required
                            value={edicionPeliculaForm.clasificacion}
                            onChange={(e) =>
                              setEdicionPeliculaForm({
                                ...edicionPeliculaForm,
                                clasificacion: e.target.value,
                              })
                            }
                          />
                        </label>

                        <label>
                          URL de imagen
                          <input
                            type="url"
                            value={edicionPeliculaForm.imagenUrl}
                            onChange={(e) =>
                              setEdicionPeliculaForm({
                                ...edicionPeliculaForm,
                                imagenUrl: e.target.value,
                              })
                            }
                          />
                        </label>

                        <label className="admin-check">
                          <input
                            type="checkbox"
                            checked={edicionPeliculaForm.activa}
                            onChange={(e) =>
                              setEdicionPeliculaForm({
                                ...edicionPeliculaForm,
                                activa: e.target.checked,
                              })
                            }
                          />

                          <span>
                            Película activa
                          </span>
                        </label>

                        <div className="admin-modal-acciones">
                          <button type="submit">
                            Guardar cambios
                          </button>

                          <button
                            type="button"
                            className="secundario"
                            onClick={cerrarEdicionPelicula}
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

