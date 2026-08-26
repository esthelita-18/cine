Sistema web de reservas para cine

Prueba técnica Full Stack desarrollada para ROBOTIC MINDS S.A.S. BIC.

La aplicación permite administrar películas, salas y funciones, consultar la cartelera, realizar reservas, controlar la disponibilidad de entradas y cancelar reservas sin eliminar su historial.

Estado actual del proyecto

Actualmente el sistema permite:

Registrar y listar películas.

Editar películas existentes.

Activar o desactivar películas.

Seleccionar género y clasificación desde listas predefinidas.

Registrar salas con capacidad máxima.

Programar funciones futuras seleccionando película, sala, fecha, hora y precio.

Mostrar funciones futuras en la cartelera.

Mostrar una sola tarjeta por película, agrupando dentro de ella sus distintas funciones, salas, fechas y horarios.

Mostrar disponibilidad y precio por función.

Buscar películas por título.

Filtrar cartelera por película, género y rangos de fecha.

Realizar reservas con nombre, correo y cantidad de entradas.

Calcular visualmente el total estimado en el frontend.

Calcular y validar el total definitivo en el backend.

Impedir reservas superiores a la disponibilidad.

Mantener la disponibilidad actualizada después de reservar o cancelar.

Consultar el historial completo de reservas.

Filtrar reservas por estado.

Buscar reservas por cliente, correo o película.

Cancelar una reserva manteniendo el registro histórico.

Mostrar estadísticas básicas en Reservas y Administración.

Mostrar estados de carga mediante skeletons.

Mostrar mensajes de éxito, error y estados vacíos.

Adaptar la interfaz a escritorio, tablet y dispositivos móviles.

Una película registrada sin funciones permanece visible en Administración, pero no aparece en la cartelera hasta que tenga al menos una función futura activa.

Tecnologías utilizadas

Frontend

React

Vite

JavaScript

JSX

CSS

Fetch API

async/await

Backend

Node.js

Express

JavaScript

CORS

Persistencia

Prisma ORM 6

SQLite

Control de versiones

Git

GitHub

Repositorio:

https://github.com/esthelita-18/cine

Arquitectura general

El proyecto utiliza una arquitectura cliente-servidor.

React
  ↓
Fetch API
  ↓
Express
  ↓
Prisma ORM
  ↓
SQLite

El frontend consume una API REST. Express recibe las solicitudes, ejecuta las reglas de negocio y utiliza Prisma para consultar o modificar la base de datos SQLite.

La API devuelve respuestas JSON y React actualiza la interfaz con los datos recibidos.

Estructura principal

cine_prueba_tecnica/
│
├── backend/
│   ├── index.js
│   ├── lib/
│   │   └── prisma.js
│   ├── routes/
│   │   ├── peliculas.js
│   │   ├── salas.js
│   │   ├── funciones.js
│   │   └── reservas.js
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CargaVista.jsx
│   │   │   ├── Mensaje.jsx
│   │   │   └── PeliculaCarteleraCard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .env.example
├── .gitignore
└── README.md

Modelo de datos

Película

Guarda:

título;

género;

duración;

clasificación;

URL opcional de imagen;

estado activo o inactivo.

Una película puede tener varias funciones.

Sala

Guarda:

nombre;

capacidad máxima;

estado activo o inactivo.

Una sala puede tener varias funciones.

Función

Relaciona una película con una sala y guarda:

fecha y hora;

precio;

estado.

Una función puede recibir varias reservas.

Cliente

Guarda:

nombre;

correo electrónico.

Un cliente puede realizar varias reservas.

Reserva

Relaciona un cliente con una función y guarda:

cantidad de entradas;

total;

estado;

fecha de creación.

Relaciones principales

Pelicula 1 ───── N Funcion

Sala     1 ───── N Funcion

Funcion  1 ───── N Reserva

Cliente  1 ───── N Reserva

Reglas de negocio implementadas

Cantidad válida

La cantidad de entradas debe ser un número entero mayor que cero.

Función válida

No se permite reservar una función:

cancelada;

inactiva;

con fecha pasada.

Capacidad de sala

La suma de entradas pertenecientes a reservas activas no puede superar la capacidad máxima de la sala.

La disponibilidad se calcula como:

Entradas disponibles =
capacidad de la sala
-
entradas pertenecientes a reservas activas

Ejemplo:

Capacidad: 40
Entradas reservadas activas: 34

Disponibles: 6

Si un usuario intenta reservar 7 entradas, la API rechaza la operación.

Cálculo del total

El frontend muestra un total estimado para mejorar la experiencia de usuario.

Sin embargo, el valor definitivo se calcula nuevamente en el backend:

total = cantidad × precio de la función

De esta forma el cliente no puede modificar manualmente el total enviado al servidor.

Cancelación

Cancelar una reserva no elimina el registro.

El estado cambia de:

ACTIVA

a:

CANCELADA

Las entradas de una reserva cancelada dejan de ocupar capacidad y vuelven a estar disponibles.

Cartelera

La cartelera muestra únicamente películas activas que tengan funciones futuras activas.

Para evitar duplicar una misma película cuando tiene varias funciones, la interfaz agrupa las funciones por película.

Ejemplo:

Interestelar

30 ago.
16:00 · Sala 1 · $5.00
18:30 · Sala 2 · $5.50

31 ago.
15:00 · Sala 1 · $5.00

El usuario selecciona un horario específico y posteriormente se abre el formulario de reserva correspondiente a esa función.

Filtros actuales

La cartelera permite:

buscar por título;

seleccionar una película;

seleccionar un género;

mostrar todas las fechas;

mostrar funciones de hoy;

mostrar funciones de mañana;

mostrar funciones de los próximos 7 días.

Administración

La sección de Administración funciona como un dashboard.

Incluye estadísticas de:

películas;

salas;

funciones;

reservas.

Dispone de secciones independientes para:

Películas
Salas
Funciones

Los formularios de registro se muestran mediante modales.

Registro de películas

Actualmente se solicitan:

título;

género;

duración;

clasificación;

URL de imagen opcional.

El género y la clasificación se seleccionan desde listas de opciones para evitar inconsistencias de escritura.

Películas sin funciones

Registrar una película no obliga a crear inmediatamente una función.

La película queda almacenada en el catálogo administrativo, pero no aparece en la cartelera mientras no tenga una función futura activa.

Historial de reservas

La vista de Reservas permite:

consultar todas las reservas;

visualizar cliente y correo;

visualizar película, fecha, hora y sala;

visualizar cantidad de entradas;

visualizar total;

distinguir reservas activas y canceladas;

buscar por cliente, correo o película;

filtrar por estado;

cancelar una reserva activa.

Antes de cancelar se muestra un modal de confirmación.

También se presentan indicadores con:

total de reservas;

reservas activas;

entradas activas;

valor correspondiente a reservas activas.

Estados visuales

La interfaz incluye:

indicadores de carga;

skeletons;

estados vacíos;

mensajes de éxito;

mensajes de error;

botones deshabilitados cuando una función está agotada;

indicadores visuales de disponibilidad.

Diseño responsive

El CSS está adaptado para:

escritorio;

tablet;

celular.

Las tablas utilizan desplazamiento horizontal cuando la pantalla no tiene espacio suficiente.

Los modales, filtros, tarjetas y paneles administrativos también cambian su distribución en pantallas pequeñas.

Instalación

Requisitos

Tener instalado:

Node.js

npm

Git

No es necesario instalar SQLite como programa independiente porque Prisma administra la conexión con el archivo SQLite.

1. Clonar el repositorio

git clone https://github.com/esthelita-18/cine.git

Entrar al proyecto:

cd cine

2. Instalar el backend

cd backend
npm install

Crear el archivo .env a partir de .env.example.

Configuración utilizada para SQLite:

DATABASE_URL="file:./dev.db"

Generar Prisma Client:

npx prisma generate

Aplicar las migraciones existentes:

npx prisma migrate deploy

3. Datos de prueba opcionales

El proyecto incluye un seed con datos de demostración.

El seed permite cargar al menos:

3 películas;

2 salas;

4 funciones.

Ejecutar:

npm run seed

El seed es opcional para trabajar con la aplicación.

Si se desea demostrar el registro manual desde Administración, se puede iniciar con una base sin estos datos.

4. Ejecutar backend

Desde:

backend/

ejecutar:

npm run dev

La API se utiliza en:

http://localhost:3000/api

5. Instalar frontend

Abrir otra terminal:

cd frontend
npm install

6. Ejecutar frontend

npm run dev

Vite mostrará la dirección local de la aplicación, normalmente:

http://localhost:5173

API REST

Películas

GET /api/peliculas
POST /api/peliculas
PATCH /api/peliculas/:id

Salas

GET /api/salas
POST /api/salas

Funciones

GET /api/funciones
POST /api/funciones

Reservas

GET /api/reservas
POST /api/reservas
PATCH /api/reservas/:id/cancelar

Flujo de una reserva

1. React muestra la cartelera.
2. El usuario selecciona una película.
3. Selecciona una función específica.
4. Ingresa nombre, correo y cantidad.
5. React envía la solicitud mediante fetch.
6. Express recibe la solicitud.
7. El backend valida cantidad, estado, fecha y disponibilidad.
8. Prisma consulta SQLite.
9. El backend calcula el total.
10. La reserva se guarda.
11. Express devuelve JSON.
12. React actualiza disponibilidad e historial.

Flujo de cancelación

Reserva ACTIVA
      ↓
Usuario solicita cancelar
      ↓
Modal de confirmación
      ↓
PATCH a la API
      ↓
Estado = CANCELADA
      ↓
El registro permanece en el historial
      ↓
Las entradas vuelven a estar disponibles

Decisiones técnicas principales

SQLite

Se utilizó SQLite porque es la base de datos solicitada para la prueba y permite disponer de persistencia relacional sin configurar un servidor externo.

Prisma ORM

Prisma se utiliza para:

definir los modelos;

establecer relaciones;

crear migraciones;

ejecutar consultas;

realizar agregaciones;

trabajar con transacciones.

La aplicación no necesita escribir SQL directamente para las operaciones principales porque Prisma abstrae el acceso a la base de datos.

Validaciones en backend

Las reglas críticas no dependen solamente del frontend.

La API vuelve a validar:

cantidad;

fecha de la función;

estado;

disponibilidad;

cálculo del total.

Esto evita confiar en datos que pueden modificarse desde el navegador.

Agrupación de cartelera

Una película puede tener varias funciones.

En lugar de mostrar una tarjeta repetida por cada función, el frontend agrupa las funciones por pelicula.id y presenta una sola tarjeta con sus distintos horarios.

La base de datos no cambia por esta decisión: sigue existiendo una relación uno a muchos entre Película y Función.

Cancelación lógica

Las reservas no se eliminan físicamente cuando el usuario cancela.

Se modifica su estado a CANCELADA.

Esto permite conservar historial y liberar disponibilidad al mismo tiempo.

Seed

El seed se utiliza para disponer de un conjunto reproducible de datos durante desarrollo y pruebas.

Permite probar rápidamente:

cartelera;

funciones;

capacidad;

disponibilidad;

reservas;

cancelaciones.

Los registros creados mediante seed no representan información obligatoria de producción.

Archivos que no deben subirse al repositorio

El proyecto utiliza .gitignore para evitar versionar archivos generados o sensibles, entre ellos:

node_modules/
.env
*.db
*.db-journal
dist/
*.log

El archivo .env.example sí debe permanecer en Git porque documenta las variables necesarias sin exponer información sensible.

Comandos útiles

Backend

npm install
npm run dev
npm run seed
npx prisma generate
npx prisma migrate deploy
npx prisma studio

Frontend

npm install
npm run dev
npm run build

Git

git status
git add .
git commit -m "Descripcion del cambio"
git push origin main

Prisma Studio

Para inspeccionar los registros de SQLite visualmente:

cd backend
npx prisma studio

Después abrir la dirección mostrada por Prisma, normalmente:

http://localhost:5555

Desde Prisma Studio pueden revisarse:

Pelicula;

Sala;

Funcion;

Cliente;

Reserva.

Herramientas utilizadas durante el desarrollo

Durante el desarrollo se utilizaron:

Visual Studio Code como editor;

Git para control de versiones;

GitHub como repositorio remoto;

documentación técnica;

terminal de Windows;

Prisma Studio para inspección de datos;

ChatGPT como asistente para investigación, explicación de conceptos, revisión de errores y apoyo durante el desarrollo.

Las decisiones, cambios y funcionamiento del código fueron revisados durante el proceso para poder explicar la implementación técnica.

Funcionalidades que no forman parte del alcance

No se implementaron porque no son requeridas para esta prueba:

autenticación;

roles de usuario;

pagos en línea;

envío real de correos;

carga de archivos;

selección individual de butacas;

despliegue en un servidor.

Las imágenes de películas se manejan mediante URL.

Próximas comprobaciones antes de la entrega final

Antes de considerar el proyecto terminado se realizará una revisión final de:

creación de película;

creación de sala;

programación de función;

disponibilidad inicial;

reserva válida;

reducción de disponibilidad;

intento de sobrecupo;

rechazo correcto desde el backend;

cancelación;

recuperación de disponibilidad;

persistencia después de reiniciar;

responsive;

build del frontend;

estado del repositorio;

README y configuración.

Autor

Salomé Chicaiza

Prueba técnica de desarrollo web Full Stack.

ROBOTIC MINDS S.A.S. BIC.