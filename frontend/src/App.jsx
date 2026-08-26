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

  const [filtroPelicula, setFiltroPelicula] = useState("");

  const [funcionSeleccionada, setFuncionSeleccionada] = useState(null);

  const [reservaForm, setReservaForm] = useState({
    nombre: "",
    correo: "",
    cantidad: 1,
  });

  const [peliculaForm, setPeliculaForm] = useState({
    titulo: "",
    genero: "",
    duracion: "",
    clasificacion: "",
    imagenUrl: "",
  });

  /* ESTADOS PARA EDITAR UNA PELÍCULA */
  const [peliculaEditando, setPeliculaEditando] = useState(null);

  const [edicionPeliculaForm, setEdicionPeliculaForm] = useState({
    titulo: "",
    genero: "",
    duracion: "",
    clasificacion: "",
    imagenUrl: "",
    activa: true,
  });

  const [salaForm, setSalaForm] = useState({
    nombre: "",
    capacidad: "",
  });

  const [funcionForm, setFuncionForm] = useState({
    peliculaId: "",
    salaId: "",
    fechaHora: "",
    precio: "",
  });

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

  function mostrarMensaje(texto) {
    setMensaje(texto);

    setTimeout(() => {
      setMensaje("");
    }, 3000);
  }

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

  async function manejarCancelarReserva(id) {
    try {
      setError("");

      await cancelarReserva(id);

      mostrarMensaje("Reserva cancelada correctamente.");

      await cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  }

  async function manejarCrearPelicula(e) {
    e.preventDefault();

    try {
      setError("");

      await crearPelicula({
        ...peliculaForm,
        duracion: Number(peliculaForm.duracion),
      });

      mostrarMensaje("Película registrada correctamente.");

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

  async function manejarCrearSala(e) {
    e.preventDefault();

    try {
      setError("");

      await crearSala({
        nombre: salaForm.nombre,
        capacidad: Number(salaForm.capacidad),
      });

      mostrarMensaje("Sala registrada correctamente.");

      setSalaForm({
        nombre: "",
        capacidad: "",
      });

      await cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  }

  async function manejarCrearFuncion(e) {
    e.preventDefault();

    try {
      setError("");

      await crearFuncion({
        peliculaId: Number(funcionForm.peliculaId),
        salaId: Number(funcionForm.salaId),
        fechaHora: funcionForm.fechaHora,
        precio: Number(funcionForm.precio),
      });

      mostrarMensaje("Función programada correctamente.");

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

  /* ================= EDICIÓN DE PELÍCULAS ================= */

  function abrirEdicionPelicula(pelicula) {
    setPeliculaEditando(pelicula);

    setEdicionPeliculaForm({
      titulo: pelicula.titulo,
      genero: pelicula.genero,
      duracion: pelicula.duracion,
      clasificacion: pelicula.clasificacion,
      imagenUrl: pelicula.imagenUrl || "",
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

      await actualizarPelicula(peliculaEditando.id, {
        ...edicionPeliculaForm,
        duracion: Number(edicionPeliculaForm.duracion),
      });

      mostrarMensaje("Película actualizada correctamente.");

      setPeliculaEditando(null);

      await cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  }

  const funcionesCartelera = funciones.filter((funcion) => {
    const futura = new Date(funcion.fechaHora) > new Date();
    const activa = funcion.estado === "ACTIVA";

    const coincidePelicula =
      filtroPelicula === "" ||
      funcion.pelicula.id === Number(filtroPelicula);

    return futura && activa && coincidePelicula;
  });

  const totalVisual = funcionSeleccionada
    ? Number(reservaForm.cantidad || 0) * funcionSeleccionada.precio
    : 0;

  return (
    <div className="app">
      <header className="encabezado">
        <div>
          <h1>Cine Reservas</h1>
          <p>Sistema de gestión y reserva de funciones</p>
        </div>

        <nav>
          <button
            className={vista === "cartelera" ? "activo" : ""}
            onClick={() => setVista("cartelera")}
          >
            Cartelera
          </button>

          <button
            className={vista === "reservas" ? "activo" : ""}
            onClick={() => setVista("reservas")}
          >
            Reservas
          </button>

          <button
            className={vista === "admin" ? "activo" : ""}
            onClick={() => setVista("admin")}
          >
            Administración
          </button>
        </nav>
      </header>

      <main>
        <Mensaje tipo="exito" texto={mensaje} />
        <Mensaje tipo="error" texto={error} />

        {cargando ? (
          <p className="estado">Cargando información...</p>
        ) : (
          <>
            {/* ================= CARTELERA ================= */}
            {vista === "cartelera" && (
              <section>
                <div className="titulo-seccion">
                  <div>
                    <h2>Cartelera</h2>
                    <p>Funciones disponibles para reservar.</p>
                  </div>

                  <select
                    value={filtroPelicula}
                    onChange={(e) => setFiltroPelicula(e.target.value)}
                  >
                    <option value="">Todas las películas</option>

                    {peliculas
                      .filter((pelicula) => pelicula.activa)
                      .map((pelicula) => (
                        <option key={pelicula.id} value={pelicula.id}>
                          {pelicula.titulo}
                        </option>
                      ))}
                  </select>
                </div>

                {funcionesCartelera.length === 0 ? (
                  <p className="estado">
                    No existen funciones disponibles.
                  </p>
                ) : (
                  <div className="grid">
                    {funcionesCartelera.map((funcion) => (
                      <FuncionCard
                        key={funcion.id}
                        funcion={funcion}
                        onReservar={setFuncionSeleccionada}
                      />
                    ))}
                  </div>
                )}

                {funcionSeleccionada && (
                  <div className="modal-fondo">
                    <div className="modal">
                      <h2>Realizar reserva</h2>

                      <p>
                        <strong>
                          {funcionSeleccionada.pelicula.titulo}
                        </strong>
                      </p>

                      <p>
                        {funcionSeleccionada.sala.nombre} - $
                        {funcionSeleccionada.precio.toFixed(2)}
                      </p>

                      <form onSubmit={manejarReserva}>
                        <label>
                          Nombre
                          <input
                            type="text"
                            required
                            value={reservaForm.nombre}
                            onChange={(e) =>
                              setReservaForm({
                                ...reservaForm,
                                nombre: e.target.value,
                              })
                            }
                          />
                        </label>

                        <label>
                          Correo
                          <input
                            type="email"
                            required
                            value={reservaForm.correo}
                            onChange={(e) =>
                              setReservaForm({
                                ...reservaForm,
                                correo: e.target.value,
                              })
                            }
                          />
                        </label>

                        <label>
                          Cantidad
                          <input
                            type="number"
                            min="1"
                            max={funcionSeleccionada.disponibles}
                            required
                            value={reservaForm.cantidad}
                            onChange={(e) =>
                              setReservaForm({
                                ...reservaForm,
                                cantidad: e.target.value,
                              })
                            }
                          />
                        </label>

                        <p className="total">
                          Total estimado: ${totalVisual.toFixed(2)}
                        </p>

                        <div className="acciones">
                          <button type="submit">
                            Confirmar reserva
                          </button>

                          <button
                            type="button"
                            className="secundario"
                            onClick={() =>
                              setFuncionSeleccionada(null)
                            }
                          >
                            Cerrar
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* ================= RESERVAS ================= */}
            {vista === "reservas" && (
              <section>
                <h2>Historial de reservas</h2>

                {reservas.length === 0 ? (
                  <p className="estado">
                    No existen reservas registradas.
                  </p>
                ) : (
                  <div className="tabla-contenedor">
                    <table>
                      <thead>
                        <tr>
                          <th>Cliente</th>
                          <th>Película</th>
                          <th>Entradas</th>
                          <th>Total</th>
                          <th>Estado</th>
                          <th>Acción</th>
                        </tr>
                      </thead>

                      <tbody>
                        {reservas.map((reserva) => (
                          <tr key={reserva.id}>
                            <td>
                              {reserva.cliente.nombre}
                              <br />
                              <small>{reserva.cliente.correo}</small>
                            </td>

                            <td>{reserva.funcion.pelicula.titulo}</td>

                            <td>{reserva.cantidad}</td>

                            <td>${reserva.total.toFixed(2)}</td>

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
                                  className="peligro"
                                  onClick={() =>
                                    manejarCancelarReserva(reserva.id)
                                  }
                                >
                                  Cancelar
                                </button>
                              ) : (
                                "-"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {/* ================= ADMINISTRACIÓN ================= */}
            {vista === "admin" && (
              <section>
                <h2>Administración</h2>

                <div className="formularios-admin">
                  {/* REGISTRAR PELÍCULA */}
                  <form
                    className="formulario-card"
                    onSubmit={manejarCrearPelicula}
                  >
                    <h3>Registrar película</h3>

                    <input
                      placeholder="Título"
                      required
                      value={peliculaForm.titulo}
                      onChange={(e) =>
                        setPeliculaForm({
                          ...peliculaForm,
                          titulo: e.target.value,
                        })
                      }
                    />

                    <input
                      placeholder="Género"
                      required
                      value={peliculaForm.genero}
                      onChange={(e) =>
                        setPeliculaForm({
                          ...peliculaForm,
                          genero: e.target.value,
                        })
                      }
                    />

                    <input
                      type="number"
                      min="1"
                      placeholder="Duración en minutos"
                      required
                      value={peliculaForm.duracion}
                      onChange={(e) =>
                        setPeliculaForm({
                          ...peliculaForm,
                          duracion: e.target.value,
                        })
                      }
                    />

                    <input
                      placeholder="Clasificación"
                      required
                      value={peliculaForm.clasificacion}
                      onChange={(e) =>
                        setPeliculaForm({
                          ...peliculaForm,
                          clasificacion: e.target.value,
                        })
                      }
                    />

                    <input
                      placeholder="URL de imagen (opcional)"
                      value={peliculaForm.imagenUrl}
                      onChange={(e) =>
                        setPeliculaForm({
                          ...peliculaForm,
                          imagenUrl: e.target.value,
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
                    onSubmit={manejarCrearSala}
                  >
                    <h3>Registrar sala</h3>

                    <input
                      placeholder="Nombre de la sala"
                      required
                      value={salaForm.nombre}
                      onChange={(e) =>
                        setSalaForm({
                          ...salaForm,
                          nombre: e.target.value,
                        })
                      }
                    />

                    <input
                      type="number"
                      min="1"
                      placeholder="Capacidad"
                      required
                      value={salaForm.capacidad}
                      onChange={(e) =>
                        setSalaForm({
                          ...salaForm,
                          capacidad: e.target.value,
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
                    onSubmit={manejarCrearFuncion}
                  >
                    <h3>Programar función</h3>

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
                        .filter((pelicula) => pelicula.activa)
                        .map((pelicula) => (
                          <option
                            key={pelicula.id}
                            value={pelicula.id}
                          >
                            {pelicula.titulo}
                          </option>
                        ))}
                    </select>

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
                        .filter((sala) => sala.activa)
                        .map((sala) => (
                          <option
                            key={sala.id}
                            value={sala.id}
                          >
                            {sala.nombre}
                          </option>
                        ))}
                    </select>

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

                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="Precio"
                      required
                      value={funcionForm.precio}
                      onChange={(e) =>
                        setFuncionForm({
                          ...funcionForm,
                          precio: e.target.value,
                        })
                      }
                    />

                    <button type="submit">
                      Programar función
                    </button>
                  </form>
                </div>

                {/* ================= LISTADOS ================= */}
                <div className="listados-admin">
                  {/* PELÍCULAS */}
                  <div className="lista-admin">
                    <h3>Películas registradas</h3>

                    {peliculas.length === 0 ? (
                      <p className="estado">
                        No existen películas registradas.
                      </p>
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
                                <td>{pelicula.titulo}</td>
                                <td>{pelicula.genero}</td>
                                <td>{pelicula.duracion} min</td>
                                <td>{pelicula.clasificacion}</td>

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
                                      abrirEdicionPelicula(pelicula)
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
                  </div>

                  {/* SALAS */}
                  <div className="lista-admin">
                    <h3>Salas registradas</h3>

                    {salas.length === 0 ? (
                      <p className="estado">
                        No existen salas registradas.
                      </p>
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
                                <td>{sala.nombre}</td>
                                <td>{sala.capacidad}</td>
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
                  </div>

                  {/* FUNCIONES */}
                  <div className="lista-admin">
                    <h3>Funciones programadas</h3>

                    {funciones.length === 0 ? (
                      <p className="estado">
                        No existen funciones programadas.
                      </p>
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
                                <td>{funcion.pelicula.titulo}</td>

                                <td>{funcion.sala.nombre}</td>

                                <td>
                                  {new Date(
                                    funcion.fechaHora
                                  ).toLocaleString("es-EC")}
                                </td>

                                <td>
                                  ${funcion.precio.toFixed(2)}
                                </td>

                                <td>{funcion.disponibles}</td>

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
                  </div>
                </div>

                {/* ================= MODAL EDITAR PELÍCULA ================= */}
                {peliculaEditando && (
                  <div className="modal-fondo">
                    <div className="modal">
                      <h2>Editar película</h2>

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
                            type="text"
                            value={edicionPeliculaForm.imagenUrl}
                            onChange={(e) =>
                              setEdicionPeliculaForm({
                                ...edicionPeliculaForm,
                                imagenUrl: e.target.value,
                              })
                            }
                          />
                        </label>

                        <label>
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
                          Película activa
                        </label>

                        <div className="acciones">
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