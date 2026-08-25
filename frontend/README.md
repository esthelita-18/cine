# Sistema web de reservas para cine

Aplicación web desarrollada como prueba técnica para administrar películas, salas, funciones y reservas de un cine.

## Tecnologías utilizadas

### Frontend
- React
- Vite
- JavaScript
- JSX
- CSS
- Fetch API

### Backend
- Node.js
- Express.js
- JavaScript

### Base de datos
- Prisma ORM
- SQLite

### Control de versiones
- Git
- GitHub

## Funcionalidades

### Cartelera
- Visualización de películas y funciones disponibles.
- Consulta de fecha, hora, sala y precio.
- Visualización de entradas disponibles.
- Filtro por película.

### Reservas
- Registro del nombre y correo del cliente.
- Selección de cantidad de entradas.
- Cálculo del total desde el backend.
- Validación de disponibilidad.
- Rechazo de reservas que superen la capacidad de la sala.
- Historial de reservas.
- Cancelación de reservas sin eliminar el registro.
- Liberación automática de cupos al cancelar.

### Administración
- Registro de películas.
- Registro de salas.
- Programación de funciones.
- Consulta de información almacenada.

## Reglas de negocio principales

- La cantidad de entradas debe ser un número entero mayor que cero.
- No se permiten reservas para funciones pasadas.
- No se permiten reservas para funciones canceladas o inactivas.
- Las reservas activas no pueden superar la capacidad de la sala.
- El total de una reserva se calcula en el backend:

  total = cantidad de entradas × precio de la función

- Una reserva cancelada permanece en el historial.
- Una reserva cancelada deja de ocupar cupos.

## Modelo de datos

El sistema utiliza cinco entidades principales:

- Pelicula
- Sala
- Funcion
- Cliente
- Reserva

Relaciones principales:

- Una película puede tener varias funciones.
- Una sala puede tener varias funciones.
- Una función puede tener varias reservas.
- Un cliente puede realizar varias reservas.

## Datos iniciales

El proyecto incluye un seed con:

- 3 películas.
- 2 salas.
- 4 funciones futuras.

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/esthelita-18/cine.git