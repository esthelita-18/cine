const express = require("express");
const prisma = require("../lib/prisma");

const router = express.Router();

// Obtener todas las películas
router.get("/", async (req, res) => {
  try {
    const peliculas = await prisma.pelicula.findMany({
      orderBy: {
        id: "desc",
      },
    });

    res.json(peliculas);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "No se pudieron obtener las películas.",
    });
  }
});

// Registrar una nueva película
router.post("/", async (req, res) => {
  try {
    const {
      titulo,
      genero,
      duracion,
      clasificacion,
      imagenUrl,
    } = req.body;

    if (!titulo || !genero || !duracion || !clasificacion) {
      return res.status(400).json({
        error: "Título, género, duración y clasificación son obligatorios.",
      });
    }

    const duracionNumero = Number(duracion);

    if (!Number.isInteger(duracionNumero) || duracionNumero <= 0) {
      return res.status(400).json({
        error: "La duración debe ser un número entero mayor que cero.",
      });
    }

    const pelicula = await prisma.pelicula.create({
      data: {
        titulo,
        genero,
        duracion: duracionNumero,
        clasificacion,
        imagenUrl: imagenUrl || null,
      },
    });

    res.status(201).json(pelicula);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "No se pudo registrar la película.",
    });
  }
});

module.exports = router;