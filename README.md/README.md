# Sistema web de reservas para un cine

Prueba técnica desarrollada para ROBOTIC MINDS S.A.S. BIC.

La aplicación permite administrar películas, salas y funciones, visualizar una cartelera, registrar reservas y cancelarlas manteniendo correctamente la disponibilidad de entradas.

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

### Administración

El sistema permite:

- Registrar películas.
- Listar películas registradas.
- Registrar salas y su capacidad máxima.
- Listar salas registradas.
- Programar funciones seleccionando película, sala, fecha, hora y precio.
- Listar las funciones programadas y visualizar su estado.

### Cartelera

La cartelera permite:

- Visualizar películas activas.
- Consultar funciones futuras.
- Consultar fecha y hora.
- Consultar sala.
- Consultar precio.
- Consultar entradas disponibles.
- Filtrar las funciones por película.

### Reservas

El sistema permite:

- Registrar nombre del cliente.
- Registrar correo electrónico.
- Seleccionar cantidad de entradas.
- Crear una reserva.
- Calcular automáticamente el valor total.
- Consultar el historial de reservas.
- Cancelar una reserva sin eliminarla.
- Liberar automáticamente los cupos cuando una reserva es cancelada.

## Reglas de negocio

Las principales validaciones se realizan en el backend.

### Cantidad de entradas

La cantidad debe ser un número entero mayor que cero.

### Función disponible

No se permite realizar reservas para funciones pasadas o funciones que no estén activas.

### Control de capacidad

La suma de entradas correspondientes a reservas activas no puede superar la capacidad máxima de la sala.

La disponibilidad se calcula mediante:

```text
Entradas disponibles =
Capacidad de la sala - Entradas de reservas activas