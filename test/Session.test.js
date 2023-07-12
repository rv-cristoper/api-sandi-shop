import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const request = supertest('http://localhost:8080');

describe('Cart Test', function () {
    let email;
    const password = '1234'
    before(async function () {
        email = `usuarioPrueba_${Date.now()}@gmail.com`;
    });
    it('Validamos que al iniciar sesion con credenciales incompletas nos retorna un mensaje de error', async function () {
        const payload = {
            "email": "adminCoder@coder.com"
        }
        const response = await request.post('/api/sessions/login').send(payload);
        expect(response.statusCode).to.equal(400)
        expect(response.ok).to.be.false;
        expect(response._body.message).to.be.a('string').and.to.be.equal('Error al iniciar sesión');
    })
    it("Validamos el registro de un usuario de manera exitosa.", async function () {
        const payload = {
            "first_name": "Cristoper",
            "last_name": "Runco",
            "age": 26,
            email,
            password,
        };

        const response = await request.post("/api/sessions/register").send(payload);
        expect(response.statusCode).to.equal(200)
        expect(response._body).to.be.ok;
        expect(response._body).to.be.have.property('_id');
    });
    it("Validamos el inicio de sesión del usuario previamente registrado", async function () {
        const payload = {
            email,
            password
        };
        const response = await request.post("/api/sessions/login").send(payload);
        const cookiesResult = response.headers["set-cookie"][0];
        expect(cookiesResult).to.be.ok;

        const cookie = {
            name: cookiesResult.split("=")[0],
            value: cookiesResult.split("=")[1],
        };
        expect(cookie.name).to.be.ok.and.to.equal("token");
        expect(cookie.value).to.be.ok;
    });
});