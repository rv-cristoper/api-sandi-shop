import ProductModel from '../dao/models/products.js'
import MessageModel from '../dao/models/message.js'

class ViewController {

    static async home(req, res) {
        try {
            const response = await ProductModel.find().lean();
            return res.render('home', {
                style: 'home.css',
                products: response
            })
        } catch (err) {
            return res.status(400).json({
                message: 'Error al listar productos',
                error: JSON.parse(err.message)
            });
        };
    }

    static realtimeproducts(req, res) {
        return res.render('realtimeproducts', {
            style: 'home.css',
        })
    }

    static async chat(req, res) {
        try {
            const response = await MessageModel.find().lean();
            return res.render('chat', {
                style: 'home.css',
                messages: response
            })
        } catch (err) {
            return res.status(400).json({
                message: 'Error al listar los mensajes',
                error: JSON.parse(err.message)
            });
        }
    }

};

export default ViewController;