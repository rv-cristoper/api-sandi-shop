import ProductModel from '../dao/models/products.js'
import MessageModel from '../dao/models/message.js'
import CartModel from '../dao/models/carts.js';
import CommonsUtils from '../utils/commons.js';
import isEmpty from 'is-empty';

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

    static async getProducts(req, res) {
        const { query } = req
        const { limit = 10, page = 1, sort } = query
        const opts = { limit, page }
        if (sort === 'asc' || sort === 'desc') opts.sort = { price: sort }
        try {
            const response = await ProductModel.paginate(CommonsUtils.getFilter(query), opts)
            let result = CommonsUtils.buildResult({ ...response, sort })
            let pagination = [];
            if (result.prevPage) pagination.push({ page: result.prevPage, active: false, link: result.paginationLink.replace('numberPage', result.prevPage) })
            pagination.push({ page: result.page, active: true, link: result.paginationLink.replace('numberPage', result.page) })
            if (result.nextPage) pagination.push({ page: result.nextPage, active: false, link: result.paginationLink.replace('numberPage', result.nextPage) })
            result.pagination = pagination
            const newPayload = JSON.stringify(result)
            result = JSON.parse(newPayload)
            return res.render('products', {
                style: 'home.css',
                products: result
            })
        } catch (err) {
            return res.status(400).json({
                message: 'Error al listar productos',
                error: JSON.parse(err.message)
            });
        };
    }

    static async getCart(req, res) {
        try {
            let { cid } = req.params;
            cid = Number(cid);
            if (isNaN(cid)) throw new Error(JSON.stringify({ detail: 'El id tiene que ser de tipo numérico' }));

            const cartById = await CartModel.findOne({ id: cid }).populate('products._id')
            if (isEmpty(cartById)) return res.status(404).json({ message: 'Carrito no encontrado' })

            const newProducts = cartById.products.map((product) => {
                return {
                    ...product._id._doc,
                    quantity: product._doc.quantity,
                    totalPrice: (product._doc.quantity * product._id.price).toFixed(2)
                }
            })
            const total = (newProducts.reduce((accumulator, current) => accumulator + Number(current.totalPrice), 0)).toFixed(2);
            return res.render('cart', {
                style: 'home.css',
                products: newProducts,
                total
            })
        } catch (err) {
            return res.status(400).json({
                message: 'Error al mostrar Carrito',
                error: JSON.parse(err.message)
            });
        }

    }

    static async login(req, res) {
        return res.render('login', {})
    }

    static async register(req, res) {
        return res.render('register', {})
    }

    static async profile(req, res) {
        const user = req.session.user
        return res.render('profile', {
            style: 'home.css',
            user
        })
    }

};

export default ViewController;