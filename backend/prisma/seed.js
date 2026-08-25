const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function crearFechaFutura(dias, hora) {
  const fecha = new Date();

  fecha.setDate(fecha.getDate() + dias);
  fecha.setHours(hora, 0, 0, 0);

  return fecha;
}

async function main() {
  // Limpiar datos anteriores
  await prisma.reserva.deleteMany();
  await prisma.funcion.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.pelicula.deleteMany();
  await prisma.sala.deleteMany();

  // -------------------------
  // PELÍCULAS
  // -------------------------

  const interestelar = await prisma.pelicula.create({
    data: {
      titulo: "Interestelar",
      genero: "Ciencia ficción",
      duracion: 169,
      clasificacion: "PG-13",
      imagenUrl: "https://via.placeholder.com/300x450?text=Interestelar",
      activa: true,
    },
  });

  const coco = await prisma.pelicula.create({
    data: {
      titulo: "Coco",
      genero: "Animación",
      duracion: 105,
      clasificacion: "PG",
      imagenUrl: "https://via.placeholder.com/300x450?text=Coco",
      activa: true,
    },
  });

  const batman = await prisma.pelicula.create({
    data: {
      titulo: "Batman",
      genero: "Acción",
      duracion: 176,
      clasificacion: "PG-13",
      imagenUrl: "https://via.placeholder.com/300x450?text=Batman",
      activa: true,
    },
  });

  // -------------------------
  // SALAS
  // -------------------------

  const sala1 = await prisma.sala.create({
    data: {
      nombre: "Sala 1",
      capacidad: 40,
      activa: true,
    },
  });

  const sala2 = await prisma.sala.create({
    data: {
      nombre: "Sala 2",
      capacidad: 60,
      activa: true,
    },
  });

  // -------------------------
  // FUNCIONES
  // -------------------------

  await prisma.funcion.createMany({
    data: [
      {
        peliculaId: interestelar.id,
        salaId: sala1.id,
        fechaHora: crearFechaFutura(1, 18),
        precio: 6.5,
        estado: "ACTIVA",
      },
      {
        peliculaId: interestelar.id,
        salaId: sala2.id,
        fechaHora: crearFechaFutura(2, 20),
        precio: 7,
        estado: "ACTIVA",
      },
      {
        peliculaId: coco.id,
        salaId: sala1.id,
        fechaHora: crearFechaFutura(3, 16),
        precio: 5,
        estado: "ACTIVA",
      },
      {
        peliculaId: batman.id,
        salaId: sala2.id,
        fechaHora: crearFechaFutura(4, 19),
        precio: 7.5,
        estado: "ACTIVA",
      },
    ],
  });

  console.log("Seed ejecutado correctamente.");
}

main()
  .catch((error) => {
    console.error("Error al ejecutar el seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });