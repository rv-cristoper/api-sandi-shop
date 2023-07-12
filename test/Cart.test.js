import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const request = supertest('http://localhost:8080');

describe('Cart Test', function () {
    it('Validamos que al buscar un carrito con un id no numerico devuelve un estado 400', async function () {
        const response = await request.get('/api/carts/a');
        const message = "El id tiene que ser de tipo numérico"
        expect(response.statusCode).to.equal(400)
        expect(response._body.error).to.be.have.property('detail');
        expect(response._body.error.detail).to.be.equal(message)
    })
    it('Validamos que se actualizen todos los productos de un carrito mediante su cartID', async function () {
        const payload = {
            "products": [
                {
                    "_id": "642274a99b66957cd45e26d1",
                    "quantity": 3
                }
            ]
        }
        const response = await request.put('/api/carts/1').send(payload);
        expect(response.statusCode).to.equal(200)
        expect(response._body).to.be.an('object');
        expect(response._body).to.not.have.property('error');
    })
    it('Validamos que se actualize la cantidad de un producto de un carrito mediante su cartID y productID', async function () {
        const payload = {
            "quantity": 3
        }
        const response = await request.put('/api/carts/1/product/642274a99b66957cd45e26d1').send(payload);
        expect(response.statusCode).to.equal(200)
        expect(response._body).to.not.be.null;
        expect(response._body).to.have.key('message');
    })
});