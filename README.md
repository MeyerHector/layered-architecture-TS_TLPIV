# To-Do App

Este proyecto es una aplicación de tareas pendientes (To-Do App) que permite a los usuarios gestionar sus tareas mediante operaciones CRUD (Crear, Leer, Actualizar, Eliminar). La aplicación está desarrollada siguiendo la arquitectura de capas y utiliza Docker para la gestión de la base de datos, lo que facilita su despliegue y portabilidad.

## Características

- CRUD completo para gestionar tareas (crear, leer, actualizar, eliminar).
- Arquitectura de capas que facilita el mantenimiento y la escalabilidad.
- Base de datos dockerizada para una fácil configuración y despliegue.
- Uso de buenas prácticas de desarrollo, como el uso de controladores, servicios y repositorios.
- Interfaz de usuario sencilla e intuitiva.

## Arquitectura

El proyecto está organizado en una estructura de capas, como se describe a continuación:

- **Controladores**: Gestionan las solicitudes HTTP y responden con los datos o el estado adecuado.
- **Servicios**: Contienen la lógica de negocio de la aplicación.
- **Repositorios**: Interactúan directamente con la base de datos para realizar operaciones CRUD.
- **Modelos**: Representan la estructura de los datos y mapean la base de datos.

Esta separación de responsabilidades facilita la escalabilidad y el mantenimiento del código.

## Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Frontend**: React.js
- **Base de Datos**: PostgreSQL (dockerizada)
- **Containerización**: Docker
- **Otros**: Sequelize (ORM para PostgreSQL)

## Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/MeyerHector/layered-architecture-TS_TLPIV.git
   cd nombre-proyecto
