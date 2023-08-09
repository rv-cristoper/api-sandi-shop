import CommonsUtils from '../utils/commons.js';
import isEmpty from 'is-empty';
import ProductService from '../services/product.service.js';
import CartService from '../services/cart.service.js';
import MessageService from '../services/message.service.js';
import { ProductDao } from '../dao/factory.js';
import config from '../config/index.js'
import UserService from '../services/user.service.js';
import User from '../models/User.js';
import Exception from '../utils/errors/exception.js';

let newProductDao
const isFile = config.presistanceType === 'file'
if (isFile) {
    newProductDao = new ProductDao()
}

class ViewController {

    static async home(req, res) {
        try {
            const response = isFile ? await newProductDao.get() : await ProductDao.get().lean();
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
            const response = await MessageService.get().lean();
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
            const response = await ProductService.paginate(CommonsUtils.getFilter(query), opts)
            let result = CommonsUtils.buildResult({ ...response, sort })
            let pagination = [];
            if (result.prevPage) pagination.push({ page: result.prevPage, active: false, link: result.paginationLink.replace('numberPage', result.prevPage) })
            pagination.push({ page: result.page, active: true, link: result.paginationLink.replace('numberPage', result.page) })
            if (result.nextPage) pagination.push({ page: result.nextPage, active: false, link: result.paginationLink.replace('numberPage', result.nextPage) })
            result.pagination = pagination
            const newPayload = JSON.stringify(result)
            result = JSON.parse(newPayload)
            // const user = req.session.user
            const user = res.locals.user
            return res.render('products', {
                style: 'home.css',
                success: true,
                products: result,
                user
            })
        } catch (err) {
            return res.status(400).json({
                message: 'Error al listar productos',
                error: JSON.parse(err.message)
            });
        };
    }

    static async getCart(req, res, next) {
        try {
            let { cid } = req.params;
            cid = Number(cid);
            const userInfo = res.locals.user
            
            if (isNaN(cid)) throw new Error(JSON.stringify({ detail: 'El id tiene que ser de tipo numérico' }));
            const cartById = await CartService.getOne({ id: cid }).populate('products._id')
            if (isEmpty(cartById)) return res.status(404).json({ message: 'Carrito no encontrado' })
            if(cartById._id.toString() !== userInfo.cart) throw new Error(JSON.stringify({ detail: 'No tienes permisos para ver este carrito' }))
            const newProducts = cartById.products.map((product) => {
                return {
                    ...product._id._doc,
                    quantity: product._doc.quantity,
                    totalPrice: (product._doc.quantity * product._id.price).toFixed(2)
                }
            })
            const total = (newProducts.reduce((accumulator, current) => accumulator + Number(current.totalPrice), 0)).toFixed(2);
            const user = res.locals.user
            return res.render('cart', {
                style: 'home.css',
                success: true,
                products: newProducts,
                user,
                total
            })
        } catch (err) {
            return next(new Exception(`Unauthorized`, 401, 'users'))
        }

    }

    static async login(req, res) {
        return res.render('login', { style: 'home.css' })
    }

    static async register(req, res) {
        return res.render('register', { style: 'home.css' })
    }

    static async forgotPassword(req, res) {
        return res.render('forgotPassword', { style: 'home.css' })
    }

    static async resetPassword(req, res) {
        const user = res.locals.user
        console.log(user)
        return res.render('resetPassword', { style: 'home.css', email: user.email })
    }

    static async profile(req, res) {
        // const user = req.session.user
        const user = res.locals.user
        return res.render('profile', {
            style: 'home.css',
            success: true,
            user
        })
    }

    static async users(req, res) {
        const user = res.locals.user
        let users = await UserService.get();
        users = users.map((e, index) => {
            return {
                ...User.detailInfo(e),
                index: index + 1
            }
        })
        return res.render('users', {
            style: 'home.css',
            success: true,
            user,
            users
        })
    }

};

export default ViewController;