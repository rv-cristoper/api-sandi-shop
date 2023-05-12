import { Server } from "socket.io"
import isEmpty from 'is-empty';
import MessageService from "../services/message.service.js";
import ProductService from "../services/product.service.js";

let socketServer;

let productList = [];

export const initSocket = (httpServer) => {
    socketServer = new Server(httpServer)

    socketServer.on('connection', async socketClient => {
        console.log('Nuevo cliente conectado', socketClient.id)

        if (isEmpty(productList)) {
            productList = await ProductService.get();
        }
        socketServer.emit('productList', productList)

        socketClient.on('addProduct', async data => {
            const { user, product: prod } = data;
            const productByCode = await ProductService.getOne({ code: prod.code })
            if (!isEmpty(productByCode)) {
                return socketServer.emit('notification', {
                    type: 'error',
                    user,
                    message: `El código ${prod.code} ya se encuentra regitrado`
                })
            }
            await ProductService.create(prod)
            productList = await ProductService.get();
            socketServer.emit('productList', productList)
            socketServer.emit('notification', {
                type: 'success',
                user,
                message: 'Producto agregado exitosamente'
            })
        })

        socketClient.on('deleteProduct', async data => {
            const { user, id } = data;
            await ProductService.deleteOne(id)
            productList = await ProductService.get();
            socketServer.emit('productList', productList);
            socketServer.emit('notification', {
                type: 'success',
                user,
                message: 'Producto eliminado exitosamente'
            })
        })

        socketClient.on('newMessage', async data => {
            await MessageService.create(data)
            socketServer.emit('newMessage', data)
        })

        socketClient.on('disconection', () => {
            console.log('Se desconecto el cliente con el id', socketClient.id)
        })
    })

}

export const emit = (name, data) => {
    socketServer.emit(name, data)
}