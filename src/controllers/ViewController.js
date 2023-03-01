import Product from '../class/Product.js';

const product = new Product('productList');

class ViewController {

    static async home(req, res) {
        try {
            const response = await product.getAllProducts();
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

};

export default ViewController;