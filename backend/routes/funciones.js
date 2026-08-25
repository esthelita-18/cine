const express = require("express");
const prisma = require("../lib/prisma");

const router = express.Router();

// --------------------------------------------------
// GET /api/funciones
// Listar funciones y calcular disponibilidad
// --------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const { peliculaId, fecha } = req.query;

    const filtros = {};

    // Filtrar por película
    if (peliculaId) {
      filtros.peliculaId = Number(peliculaId);
    }

    // Filtrar por fecha
    if (fecha) {
      const inicio = new Date(`${fecha}T00:00:00`);
      const fin = new Date(`${fecha}T23:59:59`);

      filtros.fechaHora = {
        gte: inicio,
        lte: fin,
      };
    }

    const funciones = await prisma.funcion.findMany({
      where: filtros,

      include: {
        pelicula: true,
        sala: true,

        reservas: {
          where: {
            estado: "ACTIVA",
          },
        },
      },

      orderBy: {
        fechaHora: "asc",
      },
    });

    const resultado = funciones.map((funcion) => {
      const entradasReservadas = funcion.reservas.reduce(
        (total, reserva) => total + reserva.cantidad,
        0
      );

      const disponibles =
        funcion.sala.capacidad - entradasReservadas;

      return {
        id: funcion.id,
        fechaHora: funcion.fechaHora,
        precio: funcion.precio,
        estado: funcion.estado,

        pelicula: funcion.pelicula,
        sala: funcion.sala,

        entradasReservadas,
        disponibles,
      };
    });

    res.json(resultado);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "No se pudieron obtener las funciones.",
    });
  }
});

// --------------------------------------------------
// POST /api/funciones
// Crear una nueva función
// --------------------------------------------------
router.post("/", async (req, res) => {
  try {
    const {
      peliculaId,
      salaId,
      fechaHora,
      precio,
    } = req.body;

    if (
      !peliculaId ||
      !salaId ||
      !fechaHora ||
      precio === undefined
    ) {
      return res.status(400).json({
        error:
          "Película, sala, fecha, hora y precio son obligatorios.",
      });
    }

    const peliculaIdNumero = Number(peliculaId);
    const salaIdNumero = Number(salaId);
    const precioNumero = Number(precio);
    const fecha = new Date(fechaHora);

    // Validar precio
    if (Number.isNaN(precioNumero) || precioNumero <= 0) {
      return res.status(400).json({
        error: "El precio debe ser mayor que cero.",
      });
    }

    // Validar fecha
    if (Number.isNaN(fecha.getTime())) {
      return res.status(400).json({
        error: "La fecha y hora no son válidas.",
      });
    }

    // No permitir crear funciones pasadas
    if (fecha <= new Date()) {
      return res.status(400).json({
        error: "La función debe programarse para una fecha futura.",
      });
    }

    // Comprobar película
    const pelicula = await prisma.pelicula.findUnique({
      where: {
        id: peliculaIdNumero,
      },
    });

    if (!pelicula) {
      return res.status(404).json({
        error: "La película seleccionada no existe.",
      });
    }

    if (!pelicula.activa) {
      return res.status(400).json({
        error: "La película seleccionada está inactiva.",
      });
    }

    // Comprobar sala
    const sala = await prisma.sala.findUnique({
      where: {
        id: salaIdNumero,
      },
    });

    if (!sala) {
      return res.status(404).json({
        error: "La sala seleccionada no existe.",
      });
    }

    if (!sala.activa) {
      return res.status(400).json({
        error: "La sala seleccionada está inactiva.",
      });
    }

    const funcion = await prisma.funcion.create({
      data: {
        peliculaId: peliculaIdNumero,
        salaId: salaIdNumero,
        fechaHora: fecha,
        precio: precioNumero,
        estado: "ACTIVA",
      },

      include: {
        pelicula: true,
        sala: true,
      },
    });

    res.status(201).json(funcion);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "No se pudo programar la función.",
    });
  }
});

module.exports = router;