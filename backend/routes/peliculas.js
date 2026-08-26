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

router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "El ID de la película no es válido.",
      });
    }

    const peliculaExistente = await prisma.pelicula.findUnique({
      where: { id },
    });

    if (!peliculaExistente) {
      return res.status(404).json({
        error: "La película no existe.",
      });
    }

    const {
      titulo,
      genero,
      duracion,
      clasificacion,
      imagenUrl,
      activa,
    } = req.body;

    if (!titulo || !titulo.trim()) {
      return res.status(400).json({
        error: "El título es obligatorio.",
      });
    }

    if (!genero || !genero.trim()) {
      return res.status(400).json({
        error: "El género es obligatorio.",
      });
    }

    const duracionNumero = Number(duracion);

    if (
      !Number.isInteger(duracionNumero) ||
      duracionNumero <= 0
    ) {
      return res.status(400).json({
        error: "La duración debe ser un número entero mayor que cero.",
      });
    }

    if (!clasificacion || !clasificacion.trim()) {
      return res.status(400).json({
        error: "La clasificación es obligatoria.",
      });
    }

    const peliculaActualizada = await prisma.pelicula.update({
      where: { id },
      data: {
        titulo: titulo.trim(),
        genero: genero.trim(),
        duracion: duracionNumero,
        clasificacion: clasificacion.trim(),
        imagenUrl:
          imagenUrl && imagenUrl.trim()
            ? imagenUrl.trim()
            : null,
        activa:
          typeof activa === "boolean"
            ? activa
            : peliculaExistente.activa,
      },
    });

    return res.json({
      mensaje: "Película actualizada correctamente.",
      pelicula: peliculaActualizada,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "No se pudo actualizar la película.",
    });
  }
});

module.exports = router;