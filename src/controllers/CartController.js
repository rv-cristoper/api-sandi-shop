import isEmpty from 'is-empty';
import Cart from '../class/Cart.js';
import Product from '../class/Product.js';

const cart = new Cart('cartList');
const product = new Product('productList');

class CartController {

    static async getCartById(req, res) {
        try {
            let response = {};
            let { cid } = req.params;
            cid = Number(cid);
            if (!isNaN(cid)) {
                const cartById = await cart.getCartById(cid);
                if (isEmpty(cartById)) {
                    const description = `No se encontró un carrito con el id ${cid}`;
                    throw new Error(JSON.stringify({ description }));
                }
                response = { cart: cartById };
            } else {
                const description = 'El id tiene que ser de tipo numérico';
                throw new Error(JSON.stringify({ description }));
            }
            return res.json(response);
        } catch (err) {
            return res.status(400).json({
                message: 'Error al buscar el carrito',
                error: JSON.parse(err.message)
            });
        };
    }

    static async createCart(req, res) {
        try {
            await cart.createCart();
            return res.json({
                message: 'El carrito fue agregado exitosamente'
            });
        } catch (err) { }
    }

    static async addProductsToCartById(req, res) {
        try {
            let { cid, pid } = req.params;
            cid = Number(cid);
            if (!isNaN(cid)) {
                const cartById = await cart.getCartById(cid);
                if (isEmpty(cartById)) {
                    const description = `No se encontró un carrito con el id ${cid}`;
                    throw new Error(JSON.stringify({ description }));
                }
            } else {
                const description = 'El id del carrito tiene que ser de tipo numérico';
                throw new Error(JSON.stringify({ description }));
            }
            pid = Number(pid);
            if (!isNaN(pid)) {
                const productById = await product.getProductById(pid);
                if (isEmpty(productById)) {
                    const description = `No se encontró un producto con el id ${pid}`;
                    throw new Error(JSON.stringify({ description }));
                }
            } else {
                const description = 'El id del producto tiene que ser de tipo numérico';
                throw new Error(JSON.stringify({ description }));
            }
            await cart.addProductsToCartById(cid, pid);
            return res.json({
                message: 'El producto fue agregado al carrito exitosamente'
            });
        } catch (err) {
            return res.status(400).json({
                message: 'Error al insertar un producto en el carrito',
                error: JSON.parse(err.message)
            });
        }
    }


}

export default CartController;