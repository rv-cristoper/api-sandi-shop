import isEmpty from 'is-empty';
import CartModel from '../dao/models/carts.js';
import ProductModel from '../dao/models/products.js'

class CartController {

    static async getCartById(req, res) {
        try {
            let { cid } = req.params;
            cid = Number(cid);
            if (isNaN(cid)) throw new Error(JSON.stringify({ detail: 'El id tiene que ser de tipo numérico' }));

            let cartById = await CartModel.findOne({ id: cid }).populate('products._id')
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
            await CartModel.create({});
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

            let cartById = await CartModel.findOne({ id: cid })
            if (!cartById) return res.status(404).json({ message: `No se encontró un carrito con el id ${cid}` })

            const productById = await ProductModel.findById(pid).catch(err => {
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
            await CartModel.updateOne({ id: cid }, { $set: { products: listProduct } })
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

            let cartById = await CartModel.findOne({ id: cid })
            if (!cartById) return res.status(404).json({ detail: `No se encontró un carrito con el id ${cid}` })

            const existProduct = cartById.products.find((product) => product._id.toString() === pid);
            if (!existProduct) return res.status(404).json({ detail: `No se encontró un producto en el carrito con el id ${pid}` })

            await CartModel.updateOne({ id: cid }, { $pull: { products: { _id: pid } } });

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

            let cartById = await CartModel.findOne({ id: cid })
            if (!cartById) return res.status(404).json({ detail: `No se encontró un carrito con el id ${cid}` })

            if (isEmpty(products)) throw new Error(JSON.stringify({ detail: 'No se ha ingresado nungún elemento a actualizar' }));

            await CartModel.updateOne({ id: cid }, { $set: { products } }).catch(error => {
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

            let cartById = await CartModel.findOne({ id: cid })
            if (!cartById) return res.status(404).json({ detail: `No se encontró un carrito con el id ${cid}` })

            const existProduct = cartById.products.find((product) => product._id.toString() === pid);
            if (!existProduct) return res.status(404).json({ detail: `No se encontró un producto en el carrito con el id ${pid}` })

            if (isEmpty(quantity)) throw new Error(JSON.stringify({ detail: 'No se ha ingresado nungún elemento a actualizar' }));

            await CartModel.updateOne({ id: cid, "products._id": pid }, { $set: { "products.$.quantity": quantity } }).catch(error => {
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

            let cartById = await CartModel.findOne({ id: cid })
            if (!cartById) return res.status(404).json({ detail: `No se encontró un carrito con el id ${cid}` })

            await CartModel.updateOne({ id: cid }, { $set: { products: [] } });

            return res.json({ message: "Los productos fueron eliminados del carrito exitosamente", });
        } catch (err) {
            return res.status(400).json({
                message: 'Error al eliminar los productos del carrito',
                error: JSON.parse(err.message)
            });
        }
    }


}

export default CartController;