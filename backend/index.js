const express = require("express");
const cors = require("cors");

const peliculasRouter = require("./routes/peliculas");
const salasRouter = require("./routes/salas");
const funcionesRouter = require("./routes/funciones");
const reservasRouter = require("./routes/reservas");

const app = express();
const PORT = 3000;

// Permite comunicación desde React
app.use(cors());

// Permite recibir JSON en el backend
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    mensaje: "API del sistema de reservas de cine funcionando",
  });
});

// Rutas de la API
app.use("/api/peliculas", peliculasRouter);
app.use("/api/salas", salasRouter);
app.use("/api/funciones", funcionesRouter);
app.use("/api/reservas", reservasRouter);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});