import isEmpty from 'is-empty';
import CommonsUtils from '../utils/commons.js';
import ProductService from '../services/product.service.js';
import requiredFieldsIdentifier from '../lib/requiredFieldsIdentifier.js';
import allowedFieldsIdentifier from '../lib/allowedFieldsIdentifier.js';
import generateProduct from '../lib/generateProduct.js';

class ProductController {

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
            return res.json(result);
        } catch (err) {
            return res.status(400).json({
                message: 'Error al listar productos',
                error: JSON.parse(err.message)
            });
        };
    }

    static async getProductById(req, res) {
        try {
            let { pid } = req.params;
            pid = Number(pid);
            if (isNaN(pid)) { throw new Error(JSON.stringify({ id: 'El id tiene que ser de tipo numérico' })) }
            const productById = await ProductService.getOne({ id: pid })
            if (!productById) return res.status(404).json({ message: 'Producto no encontrado' })
            return res.json({
                message: "Producto encontrado",
                data: productById
            });
        } catch (err) {
            return res.status(400).json({
                message: 'Error al buscar el producto',
                error: JSON.parse(err.message)
            });
        };
    }

    static async createProduct(req, res) {
        try {
            let error = {};
            const productData = req.body;
            const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
            error = requiredFieldsIdentifier(requiredFields, productData);
            const allowedFields = [...requiredFields, 'thumbnails'];
            const allowed = allowedFieldsIdentifier(allowedFields, productData);
            error = { ...error, ...allowed };
            if (!isEmpty(error)) throw new Error(JSON.stringify(error));
            await ProductService.create(productData).catch(() => {
                throw new Error(JSON.stringify({ detail: 'El tipo de dato no es correcto o el código ya existe' }))
            })
            return res.json({ message: 'El producto fue agregado exitosamente' });
        } catch (err) {
            return res.status(400).json({
                message: 'Error al agregar el producto',
                error: JSON.parse(err.message)
            });
        };
    }

    static async updateProductById(req, res) {
        try {
            let error = {};
            let { pid } = req.params;
            const productData = req.body;
            pid = Number(pid);
            if (isNaN(pid)) throw new Error(JSON.stringify({ id: 'El id tiene que ser de tipo numérico' }))

            if (isEmpty(productData)) throw new Error(JSON.stringify({ detail: 'No se ha ingresado nungún elemento a actualizar' }));

            let productById = await ProductService.getOne({ id: pid })
            if (isEmpty(productById)) return res.status(404).json({ message: 'El producto a editar no existe' })

            const allowedFields = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnails'];
            error = allowedFieldsIdentifier(allowedFields, productData);
            if (!isEmpty(error)) throw new Error(JSON.stringify(error));

            if (!isEmpty(productData.code)) {
                const productByCode = await ProductService.getOne({ code: productData.code })
                if (!isEmpty(productByCode) && productByCode.id !== pid) {
                    throw new Error(JSON.stringify({ detail: `El código ${productData.code} ya se encuentra regitrado` }));
                };
            }
            await ProductService.updateOne(pid, { $set: productData }).catch(() => {
                throw new Error(JSON.stringify({ detail: 'El tipo de dato no es correcto' }))
            })
            return res.json({
                message: 'El producto fue actualizado exitosamente'
            });
        } catch (err) {
            return res.status(400).json({
                message: 'Error al actualizar el producto',
                error: JSON.parse(err.message)
            });
        };
    }

    static async deleteProductById(req, res) {
        try {
            let { pid } = req.params;
            pid = Number(pid);
            if (isNaN(pid)) throw new Error(JSON.stringify({ detail: 'El id tiene que ser de tipo numérico' }));

            const productById = await ProductService.getOne({ id: pid })
            if (isEmpty(productById)) return res.status(404).json({ message: 'El producto a eliminar no existe' })

            await ProductService.deleteOne(pid)
            return res.json({
                message: 'El producto fue eliminado exitosamente'
            });
        } catch (err) {
            return res.status(400).json({
                message: 'Error al buscar el producto',
                error: JSON.parse(err.message)
            });
        };
    }

    static async updateProductStock(pid, qty) {
        try {
            const product = await ProductService.getById(pid)
            let stock = product.stock
            stock -= qty
            await ProductService.updateOne(product.id, { $set: { stock } })
            return true
        } catch (error) {
            return false
        }

    }

    static getMockingproducts(req, res) {
        try {
            const { count = 50 } = req.query;
            let products = []
            for (let i = 0; i < count; i++) {
                products.push(generateProduct(i))
            }
            res.status(200).json({
                status: "success",
                payload: products
            })
        } catch (error) {

        }
    }

}

export default ProductController;