import { Server } from "socket.io"
import isEmpty from 'is-empty';
import ProductModel from '../dao/models/products.js'
import MessageModel from '../dao/models/message.js'

let socketServer;

let productList = [];

export const initSocket = (httpServer) => {
    socketServer = new Server(httpServer)

    socketServer.on('connection', async socketClient => {
        console.log('Nuevo cliente conectado', socketClient.id)

        if (isEmpty(productList)) {
            productList = await ProductModel.find();
        }
        socketServer.emit('productList', productList)

        socketClient.on('addProduct', async data => {
            const { user, product: prod } = data;
            const productByCode = await ProductModel.findOne({ code: prod.code })
            if (!isEmpty(productByCode)) {
                return socketServer.emit('notification', {
                    type: 'error',
                    user,
                    message: `El código ${prod.code} ya se encuentra regitrado`
                })
            }
            await ProductModel.create(prod)
            productList = await ProductModel.find();
            socketServer.emit('productList', productList)
            socketServer.emit('notification', {
                type: 'success',
                user,
                message: 'Producto agregado exitosamente'
            })
        })

        socketClient.on('deleteProduct', async data => {
            const { user, id } = data;
            await ProductModel.deleteOne({ id })
            productList = await ProductModel.find();
            socketServer.emit('productList', productList);
            socketServer.emit('notification', {
                type: 'success',
                user,
                message: 'Producto eliminado exitosamente'
            })
        })

        socketClient.on('newMessage', async data => {
            await MessageModel.create(data)
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