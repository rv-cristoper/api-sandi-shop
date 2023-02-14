import isEmpty from 'is-empty';
import Product from '../class/Product.js';

const product = new Product('productList');

class ProductController {

    static async getProducts(req, res) {
        try {
            let response = {};
            let { limit } = req.query;
            const products = await product.getAllProducts();
            response = { products };
            if (!isEmpty(limit)) {
                limit = Number(limit);
                if (!isNaN(limit)) {
                    response = { products: products.slice(0, limit) };
                } else {
                    const description = 'El límite tiene que ser de tipo numérico';
                    throw new Error(JSON.stringify({ description }));
                }
            };
            return res.json(response);
        } catch (err) {
            return res.status(400).json({
                message: 'Error al listar productos',
                error: JSON.parse(err.message)
            });
        };
    }

    static async getProductById(req, res) {
        try {
            let response = {};
            let { pid } = req.params;
            pid = Number(pid);
            if (!isNaN(pid)) {
                const productById = await product.getProductById(pid);
                if (isEmpty(productById)) {
                    const description = `No se encontró un producto con el id ${pid}`;
                    throw new Error(JSON.stringify({ description }));
                }
                response = { product: productById };
            } else {
                const description = 'El id tiene que ser de tipo numérico';
                throw new Error(JSON.stringify({ description }));
            }
            return res.json(response);
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
            const requiredFields = ['title', 'description', 'code', 'price', 'status', 'stock', 'category'];
            requiredFields.forEach(field => {
                if (!productData.hasOwnProperty(field)) {
                    error[field] = 'El campo es obligatorio';
                }
            });
            const allowedFields = [...requiredFields, 'thumbnails'];
            Object.keys(productData).forEach(field => {
                if (allowedFields.includes(field) && isEmpty(productData[field])) {
                    error[field] = 'El campo no puede estar vacío';
                };
                if (!allowedFields.includes(field)) {
                    error[field] = 'El campo no esta permitido';
                };
            });
            if (!isEmpty(error)) {
                throw new Error(JSON.stringify(error));
            };
            const productByCode = await product.getProductByCode(productData.code);
            if (!isEmpty(productByCode)) {
                const description = `El código ${productData.code} ya se encuentra regitrado`;
                throw new Error(JSON.stringify({ description }));
            };
            await product.createProduct(productData);
            return res.json({
                message: 'El producto fue agregado exitosamente'
            });
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
            if (isEmpty(productData)) {
                const description = 'No se ha ingresado nungún elemento a actualizar';
                throw new Error(JSON.stringify({ description }));
            }
            if (!isNaN(pid)) {
                const productById = await product.getProductById(pid);
                if (isEmpty(productById)) {
                    const description = `No se encontró un producto con el id ${pid}`;
                    throw new Error(JSON.stringify({ description }));
                }
            } else {
                const description = 'El id tiene que ser de tipo numérico';
                throw new Error(JSON.stringify({ description }));
            }
            const allowedFields = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnails'];
            Object.keys(productData).forEach(field => {
                if (allowedFields.includes(field) && isEmpty(productData[field])) {
                    error[field] = 'El campo no puede estar vacío';
                };
                if (!allowedFields.includes(field)) {
                    error[field] = 'El campo no esta permitido';
                };
            });
            if (!isEmpty(error)) {
                throw new Error(JSON.stringify(error));
            };
            if (!isEmpty(productData.code)) {
                const productByCode = await product.getProductByCode(productData.code);
                if (!isEmpty(productByCode) && productByCode.id !== pid) {
                    const description = `El código ${productData.code} ya se encuentra regitrado`;
                    throw new Error(JSON.stringify({ description }));
                };
            }
            await product.updateProducts(pid, productData);
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
            if (!isNaN(pid)) {
                const productById = await product.getProductById(pid);
                if (isEmpty(productById)) {
                    const description = `No se encontró un producto con el id ${pid}`;
                    throw new Error(JSON.stringify({ description }));
                }
            } else {
                const description = 'El id tiene que ser de tipo numérico';
                throw new Error(JSON.stringify({ description }));
            }
            await product.deleteProductById(pid);
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

}

export default ProductController;