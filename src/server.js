import open from "open"
import app from "./config/app.js";
import { initSocket } from "./config/socket.js";
import config from './config/index.js'
import getLogger  from "./utils/logger.js";

const logger = getLogger();
const server = app.listen(config.port, () => {
    // console.log('Servidor ejecutandose en el puerto: ', config.port)
    logger.debug(`Servidor ejecutandose en http://localhost:${config.port} en ${config.nodeEnv}.`)
    open(`http://localhost:${config.port}/login`)
})
server.on('error', error => console.log('Error en el servidor', error))

initSocket(server)