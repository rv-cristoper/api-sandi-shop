import { Server } from "socket.io"
import isEmpty from 'is-empty';

import Product from "../class/Product.js";
const product = new Product('productList');

let socketServer;

let productList = [];

export const init = (httpServer) => {
    socketServer = new Server(httpServer)

    socketServer.on('connection', async socketClient => {
        console.log('Nuevo cliente conectado', socketClient.id)

        if (isEmpty(productList)) {
            productList = await product.getAllProducts();
        }
        socketServer.emit('productList', productList)

        socketClient.on('addProduct', async data => {
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

        socketClient.on('deleteProduct', async data => {
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

        socketClient.on('disconection', () => {
            console.log('Se desconecto el cliente con el id', socketClient.id)
        })
    })

}

export const emit = (name, data) => {
    socketServer.emit(name, data)
}