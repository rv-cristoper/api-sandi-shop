
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import isEmpty from 'is-empty';

export default class Product {

  constructor(filename = 'productList') {
    this.fileName = `./${filename}.json`;
  }

  async get() {
    let products = [];
    if (fs.existsSync(this.fileName)) {
      const productList = await fsPromises.readFile(this.fileName, 'utf-8');
      if (!isEmpty(productList)) products = JSON.parse(productList);
    };
    return products;
  }

}