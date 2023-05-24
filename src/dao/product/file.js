
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

  // create(data) {
  //   const contact = { ...data, id: this.contacts.length + 1 }
  //   this.contacts.push(contact)
  //   return contact
  // }


  // getById(id) {
  //   return this.contacts.find(contact => String(contact.id) === id)
  // }

  // updateById(id, data) {
  //   const index = this.contacts.findIndex(contact => String(contact.id) === id)
  //   this.contacts[index] = { ...data, id }
  //   return this.contacts[index]
  // }

  // deleteById(id) {
  //   const index = this.contacts.findIndex(contact => String(contact.id) === id)
  //   const result = this.contacts.splice(index, 1)
  //   return result
  // }

}