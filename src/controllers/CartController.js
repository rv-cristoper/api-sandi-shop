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


}

export default CartController;