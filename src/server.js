import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from "socket.io"
import __dirname from "./utils.js";
import RoutesController from './routes/index.js';

import isEmpty from 'is-empty';
import Product from './class/Product.js';
const product = new Product('productList');

const app = express();

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

RoutesController.createRoutes(app);

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log('Servidor ejecutandose en el puerto: ', PORT)
})
server.on('error', error => console.log('Error en el servidor', error))

const socketServer = new Server(server);

let productList = [];
socketServer.on('connection', async socket => {
    console.log("Cliente conectado")
    if (isEmpty(productList)) {
        productList = await product.getAllProducts();
    }
    socketServer.emit('productList', productList)

    socket.on('addProduct', async data => {
        const { user, product: prod } = data;
        const productByCode = await product.getProductByCode(prod.code);
        if (!isEmpty(productByCode)) {
            return socketServer.emit('notification', {
                type: 'error',
                user,
                message: `El código ${prod.code} ya se encuentra regitrado`
            })
        }
        await product.createProduct(prod);
        productList = await product.getAllProducts();
        socketServer.emit('productList', productList)
        socketServer.emit('notification', {
            type: 'success',
            user,
            message: 'Producto agregado exitosamente'
        })
    })
    
    socket.on('deleteProduct', async data => {
        const { user, id } = data;
        await product.deleteProductById(id);
        productList = await product.getAllProducts();
        socketServer.emit('productList', productList);
        socketServer.emit('notification', {
            type: 'success',
            user,
            message: 'Producto eliminado exitosamente'
        })
    })
})