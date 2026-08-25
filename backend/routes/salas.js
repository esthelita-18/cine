const express = require("express");
const prisma = require("../lib/prisma");

const router = express.Router();

// Obtener todas las salas
router.get("/", async (req, res) => {
  try {
    const salas = await prisma.sala.findMany({
      orderBy: {
        id: "desc",
      },
    });

    res.json(salas);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "No se pudieron obtener las salas.",
    });
  }
});

// Registrar una nueva sala
router.post("/", async (req, res) => {
  try {
    const { nombre, capacidad } = req.body;

    if (!nombre || capacidad === undefined) {
      return res.status(400).json({
        error: "Nombre y capacidad son obligatorios.",
      });
    }

    const capacidadNumero = Number(capacidad);

    if (!Number.isInteger(capacidadNumero) || capacidadNumero <= 0) {
      return res.status(400).json({
        error: "La capacidad debe ser un número entero mayor que cero.",
      });
    }

    const sala = await prisma.sala.create({
      data: {
        nombre,
        capacidad: capacidadNumero,
      },
    });

    res.status(201).json(sala);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "No se pudo registrar la sala.",
    });
  }
});

module.exports = router;