import express from 'express';
import RoutesController from './routes/index.js';

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

RoutesController.createRoutes(app);

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log('Servidor ejecutandose en el puerto: ', PORT)
})
server.on('error', error => console.log('Error en el servidor', error))