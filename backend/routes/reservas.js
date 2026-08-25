const express = require("express");
const prisma = require("../lib/prisma");

const router = express.Router();

// --------------------------------------------------
// GET /api/reservas
// Obtener historial de reservas
// --------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const reservas = await prisma.reserva.findMany({
      include: {
        cliente: true,

        funcion: {
          include: {
            pelicula: true,
            sala: true,
          },
        },
      },

      orderBy: {
        fechaCreada: "desc",
      },
    });

    res.json(reservas);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "No se pudieron obtener las reservas.",
    });
  }
});

// --------------------------------------------------
// POST /api/reservas
// Crear reserva
// --------------------------------------------------
router.post("/", async (req, res) => {
  try {
    const {
      nombre,
      correo,
      funcionId,
      cantidad,
    } = req.body;

    if (
      !nombre ||
      !correo ||
      !funcionId ||
      cantidad === undefined
    ) {
      return res.status(400).json({
        error:
          "Nombre, correo, función y cantidad son obligatorios.",
      });
    }

    const cantidadNumero = Number(cantidad);
    const funcionIdNumero = Number(funcionId);

    // Regla 1:
    // La cantidad debe ser un entero mayor que cero
    if (
      !Number.isInteger(cantidadNumero) ||
      cantidadNumero <= 0
    ) {
      return res.status(400).json({
        error:
          "La cantidad de entradas debe ser un número entero mayor que cero.",
      });
    }

    // Ejecutar toda la reserva como una sola operación lógica
    const reserva = await prisma.$transaction(async (tx) => {

      // Buscar función
      const funcion = await tx.funcion.findUnique({
        where: {
          id: funcionIdNumero,
        },

        include: {
          sala: true,

          pelicula: true,

          reservas: {
            where: {
              estado: "ACTIVA",
            },
          },
        },
      });

      // La función debe existir
      if (!funcion) {
        const error = new Error(
          "La función seleccionada no existe."
        );

        error.status = 404;
        throw error;
      }

      // Regla 2:
      // No reservar una función cancelada
      if (funcion.estado !== "ACTIVA") {
        const error = new Error(
          "No se puede reservar una función cancelada."
        );

        error.status = 400;
        throw error;
      }

      // Regla 2:
      // No reservar una función pasada
      if (new Date(funcion.fechaHora) <= new Date()) {
        const error = new Error(
          "No se puede reservar una función que ya pasó."
        );

        error.status = 400;
        throw error;
      }

      // Sumar entradas activas
      const entradasReservadas =
        funcion.reservas.reduce(
          (total, reservaActual) =>
            total + reservaActual.cantidad,
          0
        );

      // Calcular disponibilidad
      const disponibles =
        funcion.sala.capacidad - entradasReservadas;

      // Regla 3:
      // Evitar superar la capacidad
      if (cantidadNumero > disponibles) {
        const error = new Error(
          `No hay suficientes entradas disponibles. Solo quedan ${disponibles}.`
        );

        error.status = 400;
        throw error;
      }

      // Buscar o crear cliente usando el correo
      const cliente = await tx.cliente.upsert({
        where: {
          correo,
        },

        update: {
          nombre,
        },

        create: {
          nombre,
          correo,
        },
      });

      // Regla 4:
      // El backend calcula el total
      const total = cantidadNumero * funcion.precio;

      // Crear reserva
      const nuevaReserva = await tx.reserva.create({
        data: {
          clienteId: cliente.id,
          funcionId: funcion.id,
          cantidad: cantidadNumero,
          total,
          estado: "ACTIVA",
        },

        include: {
          cliente: true,

          funcion: {
            include: {
              pelicula: true,
              sala: true,
            },
          },
        },
      });

      return nuevaReserva;
    });

    res.status(201).json({
      mensaje: "Reserva creada correctamente.",
      reserva,
    });
  } catch (error) {
    console.error(error);

    res.status(error.status || 500).json({
      error:
        error.message ||
        "No se pudo crear la reserva.",
    });
  }
});

// --------------------------------------------------
// PATCH /api/reservas/:id/cancelar
// Cancelar una reserva
// --------------------------------------------------
router.patch("/:id/cancelar", async (req, res) => {
  try {
    const reservaId = Number(req.params.id);

    const reserva = await prisma.reserva.findUnique({
      where: {
        id: reservaId,
      },
    });

    if (!reserva) {
      return res.status(404).json({
        error: "La reserva no existe.",
      });
    }

    if (reserva.estado === "CANCELADA") {
      return res.status(400).json({
        error: "La reserva ya se encuentra cancelada.",
      });
    }

    const reservaCancelada = await prisma.reserva.update({
      where: {
        id: reservaId,
      },

      data: {
        estado: "CANCELADA",
      },
    });

    res.json({
      mensaje: "Reserva cancelada correctamente.",
      reserva: reservaCancelada,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "No se pudo cancelar la reserva.",
    });
  }
});

module.exports = router;