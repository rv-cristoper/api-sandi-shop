import fs from 'fs';
import { promises as fsPromises } from 'fs';
import isEmpty from 'is-empty';

class Product {

    constructor(filename = 'product') {
        this.fileName = `./${filename}.json`;
    }

    async getAllProducts() {
        let products = [];
        if (fs.existsSync(this.fileName)) {
            const productList = await fsPromises.readFile(this.fileName, 'utf-8');
            if (!isEmpty(productList)) products = JSON.parse(productList);
        };
        return products;
    }

    async getProductById(id) {
        let products = [];
        const productList = await this.getAllProducts();
        if (!isEmpty(productList)) products = productList;
        const product = productList.find(element => element.id === id);
        return !isEmpty(product) ? product : {};
    }

    async createProduct(product) {
        let products = [];
        const productList = await this.getAllProducts();
        if (!isEmpty(productList)) products = productList;
        product.id = products.length + 1;
        products.push(product);
        await fsPromises.writeFile(this.fileName, JSON.stringify(products));
        return;
    }

    async updateProducts(id, data) {
        let products = [];
        const productList = await this.getAllProducts();
        if (!isEmpty(productList)) products = productList;
        products = products.map((element) => {
            if (element.id !== id) return element;
            return {
                ...element,
                ...data,
                id
            }
        })
        await fsPromises.writeFile(this.fileName, JSON.stringify(products));
        return;
    }

    async deleteProductById(id) {
        let products = [];
        const productList = await this.getAllProducts();
        if (!isEmpty(productList)) products = productList;
        products = products.filter(element => element.id !== id);
        await fsPromises.writeFile(this.fileName, JSON.stringify(products));
        return;
    }

    async getProductByCode(code) {
        let products = [];
        const productList = await this.getAllProducts();
        if (!isEmpty(productList)) products = productList;
        const product = productList.find(element => element.code === code);
        return !isEmpty(product) ? product : {};
    }
}

export default Product;