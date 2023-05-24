import isEmpty from 'is-empty';
import ProductService from '../services/product.service.js';
import CartService from '../services/cart.service.js';
import ProductController from './ProductController.js';

class CartController {

    static async getCartById(req, res) {
        try {
            let { cid } = req.params;
            cid = Number(cid);
            if (isNaN(cid)) throw new Error(JSON.stringify({ detail: 'El id tiene que ser de tipo numérico' }));

            let cartById = await CartService.getOne({ id: cid }).populate('products._id')
            if (!cartById) return res.status(404).json({ message: 'Carrito no encontrado' })

            const newProducts = cartById.products.map((product) => {
                return {
                    ...product._id._doc,
                    quantity: product._doc.quantity
                }
            })
            cartById = {
                ...cartById._doc,
                products: newProducts
            }
            return res.json({
                message: "Carrito encontrado",
                data: cartById
            });
        } catch (err) {
            return res.status(400).json({
                message: 'Error al buscar el carrito',
                error: JSON.parse(err.message)
            });
        };
    }

    static async createCart(req, res) {
        try {
            await CartService.create({});
            return res.json({
                message: 'El carrito fue agregado exitosamente'
            });
        } catch (err) { }
    }

    static async addProductsToCartById(req, res) {
        try {
            let { cid, pid } = req.params;
            cid = Number(cid);
            if (isNaN(cid)) throw new Error(JSON.stringify({ detail: 'El id del carrito tiene que ser de tipo numérico' }));

            let cartById = await CartService.getOne({ id: cid })
            if (!cartById) return res.status(404).json({ message: `No se encontró un carrito con el id ${cid}` })

            const productById = await ProductService.getById(pid).catch(err => {
                throw new Error(JSON.stringify({ detail: `No se encontró un producto con el id ${pid}` }))
            })
            if (isEmpty(productById)) return res.status(404).json({ message: `No se encontró un producto con el id ${pid}` })

            let listProduct = cartById.products;
            const searchProductByIdInCart = listProduct.find(data => data._id.toString() === pid);
            if (!isEmpty(searchProductByIdInCart)) {
                listProduct = listProduct.map((item) => {
                    if (item._id.toString() !== pid) return item;
                    return {
                        _id: item._id,
                        quantity: ++item.quantity
                    }
                })
            }
            else {
                listProduct.push({
                    _id: pid,
                    quantity: 1
                })
            }
            await CartService.updateOne(cid, { $set: { products: listProduct } })
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

    static async deleteProductById(req, res) {
        try {
            let { cid, pid } = req.params;
            cid = Number(cid);
            if (isNaN(cid)) throw new Error(JSON.stringify({ detail: 'El id del carrito tiene que ser de tipo numérico' }));

            let cartById = await CartService.getOne({ id: cid })
            if (!cartById) return res.status(404).json({ detail: `No se encontró un carrito con el id ${cid}` })

            const existProduct = cartById.products.find((product) => product._id.toString() === pid);
            if (!existProduct) return res.status(404).json({ detail: `No se encontró un producto en el carrito con el id ${pid}` })

            await CartService.updateOne(cid, { $pull: { products: { _id: pid } } });

            return res.json({ message: "El producto fue eliminado exitosamente", });
        } catch (err) {
            return res.status(400).json({
                message: 'Error al insertar un producto en el carrito',
                error: JSON.parse(err.message)
            });
        }
    }

    static async updateAllProductsToCartById(req, res) {
        try {
            let { cid } = req.params;
            let { products } = req.body;

            cid = Number(cid);
            if (isNaN(cid)) throw new Error(JSON.stringify({ detail: 'El id del carrito tiene que ser de tipo numérico' }));

            let cartById = await CartService.getOne({ id: cid })
            if (!cartById) return res.status(404).json({ detail: `No se encontró un carrito con el id ${cid}` })

            if (isEmpty(products)) throw new Error(JSON.stringify({ detail: 'No se ha ingresado nungún elemento a actualizar' }));

            await CartService.updateOne(cid, { $set: { products } }).catch(error => {
                throw new Error(JSON.stringify({ detail: 'Ha ocurrido un error en el envio de los productos' }));
            });

            return res.json({ message: "Los productos fueron actualizados del carrito exitosamente", });
        } catch (err) {
            return res.status(400).json({
                message: 'Error al actualizar los productos del carrito',
                error: JSON.parse(err.message)
            });
        }
    }

    static async updateQuantityProductToCartById(req, res) {
        try {
            let { cid, pid } = req.params;
            let { quantity } = req.body;

            cid = Number(cid);
            if (isNaN(cid)) throw new Error(JSON.stringify({ detail: 'El id del carrito tiene que ser de tipo numérico' }));

            let cartById = await CartService.getOne({ id: cid })
            if (!cartById) return res.status(404).json({ detail: `No se encontró un carrito con el id ${cid}` })

            const existProduct = cartById.products.find((product) => product._id.toString() === pid);
            if (!existProduct) return res.status(404).json({ detail: `No se encontró un producto en el carrito con el id ${pid}` })

            if (isEmpty(quantity)) throw new Error(JSON.stringify({ detail: 'No se ha ingresado nungún elemento a actualizar' }));

            await CartService.updateOne(cid, { $set: { "products.$.quantity": quantity } }, { "products._id": pid }).catch(error => {
                throw new Error(JSON.stringify({ detail: 'Ha ocurrido un error al intentar actualizar la cantidad del producto' }));
            });

            return res.json({ message: "Los productos fueron actualizados del carrito exitosamente", });
        } catch (err) {
            return res.status(400).json({
                message: 'Error al actualizar los productos del carrito',
                error: JSON.parse(err.message)
            });
        }
    }

    static async deleteAllProductByCartId(req, res) {
        try {
            let { cid } = req.params;
            cid = Number(cid);
            if (isNaN(cid)) throw new Error(JSON.stringify({ detail: 'El id del carrito tiene que ser de tipo numérico' }));

            let cartById = await CartService.getOne({ id: cid })
            if (!cartById) return res.status(404).json({ detail: `No se encontró un carrito con el id ${cid}` })

            await CartService.updateOne(cid, { $set: { products: [] } });

            return res.json({ message: "Los productos fueron eliminados del carrito exitosamente", });
        } catch (err) {
            return res.status(400).json({
                message: 'Error al eliminar los productos del carrito',
                error: JSON.parse(err.message)
            });
        }
    }

    static async createOrder(req, res) {
        try {
            const { cid } = req.params;
            const response = await CartService.getOne({ id: cid }).populate('products._id');
            const products = JSON.parse(JSON.stringify(response.products));
            const newProducts = products.map((product) => {
                return {
                    _id: product._id._id,
                    quantity: product.quantity,
                    available: product._id.stock >= product.quantity,
                };
            });
            const available = newProducts.filter((product) => product.available);
            const notAvailable = newProducts.filter((product) => !product.available);

            if (available) {
                available.map(async (e) => {
                    await ProductController.updateProductStock(e._id, e.quantity);
                });
            }

            let carrito = [];
            
            if (notAvailable) {
                notAvailable.map((e) => {
                    carrito.push({
                        _id: e._id,
                        quantity: e.quantity,
                    });
                });
            }
            await CartService.updateOne(cid, { $set: { products: carrito } });
            return res.status(200).json({
                message: "Su compra se proceso de manera exitosa",
                noProcedProducts: notAvailable,
            });
        } catch (error) {
            return res.status(400).json({
                message: "Ocurrio un problema al procesar su compra",
                error: JSON.parse(err.message),
            });
        }
    }

}

export default CartController;