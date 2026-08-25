-- CreateTable
CREATE TABLE "Pelicula" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "duracion" INTEGER NOT NULL,
    "clasificacion" TEXT NOT NULL,
    "imagenUrl" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Sala" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Funcion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "peliculaId" INTEGER NOT NULL,
    "salaId" INTEGER NOT NULL,
    "fechaHora" DATETIME NOT NULL,
    "precio" REAL NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVA',
    CONSTRAINT "Funcion_peliculaId_fkey" FOREIGN KEY ("peliculaId") REFERENCES "Pelicula" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Funcion_salaId_fkey" FOREIGN KEY ("salaId") REFERENCES "Sala" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Reserva" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clienteId" INTEGER NOT NULL,
    "funcionId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "total" REAL NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVA',
    "fechaCreada" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reserva_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reserva_funcionId_fkey" FOREIGN KEY ("funcionId") REFERENCES "Funcion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_correo_key" ON "Cliente"("correo");
