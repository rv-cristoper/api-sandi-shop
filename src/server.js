import app from "./config/app.js";
import { initSocket } from "./config/socket.js";

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
    console.log('Servidor ejecutandose en el puerto: ', PORT)
})
server.on('error', error => console.log('Error en el servidor', error))

initSocket(server)