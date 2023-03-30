import ProductModel from '../dao/models/products.js'
import MessageModel from '../dao/models/message.js'
import CommonsUtils from '../utils/commons.js';

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

};

export default ViewController;