# Proyecto API-SANDI-SHOP

Servicio desarrollado para [Sandi's](https://api-sandi-shop-production.up.railway.app), tienda online de venta de accesorios.
Este proyecto esta enfocado en la consulta, creación, edición y eliminación de categorías, productos, pedidos y usuarios.

## Requisitos básicos para ejecutar el proyecto

* Node.js
* Procesador de 64 bits
* Al menos 4 GB de RAM
* Espacio en disco mínimo de 100 MB para instalar las dependencias del proyecto y almacenar los datos necesarios
* Sistema operativo compatible con Node.js (Windows, macOS, Linux, etc.)

En caso no cuentes con Node.js puedes descargar la última versión directamente [aquí](https://nodejs.org/)

## Para descargar el proyecto

Clona el repositorio 
```sh
git clone https://github.com/rv-cristoper/api-sandi-shop.git
```
Instala dependencias
```sh
npm install
```
## Configuración inicial

Primero debemos crear un archivo en la raíz del proyecto con el nombre `.env` y copiar todo el contenido del archivo `.env.example`.
En este archivo se estarán manejando todas nuestras variables de entorno para nuestro proyecto, las cuales se especifican a continuación:

| VARIABLE                  | DESCRIPCIÓN                                                                                   |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| `PORT`                    | Puerto en el que se ejecutará la aplicación, en este caso 8080.                               |
| `MONGODB_URI`             | URI de conexión a la base de datos MongoDB.                                                   |
| `GITHUB_CLIENT_ID`        | ID del cliente proporcionado por GitHub para autenticación OAuth.                             |
| `GITHUB_CLIENT_SECRET`    | SECRET del cliente proporcionado por GitHub para autenticación OAuth.                         |
| `GITHUB_CALLBACK`         | URL de devolución de llamada después de la autenticación con GitHub.                          |
| `SECRET_KEY`              | Clave secreta utilizada para la firma de tokens de autenticación.                             |
| `PERSISTENCE_TYPE`        | Tipo de persistencia de datos utilizado, en este caso "mongodb".                              |
| `ADMIN_EMAIL`             | Correo electrónico del administrador del sistema(para inicio de sesión).                      |
| `ADMIN_PASSWORD`          | Contraseña del administrador del sistema(para inicio de sesión).                              |
| `NODE_ENV`                | Entorno de ejecución de la aplicación, en este caso "desarrollo".                             |
| `EMAIL_USER`              | Correo electrónico utilizado para enviar correos electrónicos.                                |
| `EMAIL_PASS`              | Contraseña del correo electrónico utilizado para enviar correos electrónicos.                 |

## Para ejecutar el proyecto

Para ejecutar a nivel de desarrollo
```sh
npm run dev
```
Para ejecutar a nivel de producción
```sh
npm run start
```

Al inciar el proyecto por defecto se ejecutara en el puerto 8080

### Adicionales

* En la raíz del proyecto encontrarás el archivo `API-Sandi.postman_collection.json`, este te permitirá probar desde postman los endpoints del servicio.
* En caso de algún inconveniente al momento de ejecutar el proyecto, no olvides visualizar el video `ejemplo de como clonar, instalar y ejecutar el proyecto.mp4`.