import fs from 'fs';
import { promises as fsPromises } from 'fs';
import isEmpty from 'is-empty';

class Cart {

    constructor(filename = 'cart') {
        this.fileName = `./${filename}.json`;
    }

    async getAllCarts() {
        let carts = [];
        if (fs.existsSync(this.fileName)) {
            const cartList = await fsPromises.readFile(this.fileName, 'utf-8');
            if (!isEmpty(cartList)) carts = JSON.parse(cartList);
        };
        return carts;
    }

    async getCartById(id) {
        let carts = [];
        const cartList = await this.getAllCarts();
        if (!isEmpty(cartList)) carts = cartList;
        const cart = carts.find(element => element.id === id);
        return !isEmpty(cart) ? cart : {};
    }

    async createCart() {
        let carts = [];
        const cartList = await this.getAllCarts();
        if (!isEmpty(cartList)) carts = cartList;
        const cart = {
            id: carts.length + 1,
            products: []
        }
        carts.push(cart)
        await fsPromises.writeFile(this.fileName, JSON.stringify(carts));
        return;
    }

    async addProductsToCartById(cid, pid) {
        let carts = [];
        const cartList = await this.getAllCarts();
        if (!isEmpty(cartList)) carts = cartList;
        carts = carts.map((element) => {
            if (element.id !== cid) return element;
            let products = element.products;
            const productById = products.find(data => data.product === pid);
            if (!isEmpty(productById)) {
                products = products.map((item) => {
                    if (item.product !== pid) return item;
                    return {
                        ...item,
                        quantity: ++item.quantity
                    }
                })
            } else {
                products.push({
                    product: pid,
                    quantity: 1
                })
            }
            return {
                ...element,
                products
            }
        })
        await fsPromises.writeFile(this.fileName, JSON.stringify(carts));
        return;
    }

}

export default Cart;