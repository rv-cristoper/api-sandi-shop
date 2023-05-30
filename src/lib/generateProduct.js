import { fakerES as faker } from '@faker-js/faker';

const generateProduct = (id) => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        code: faker.string.alphanumeric({ length: 20, casing: 'upper' }),
        price: parseFloat(faker.commerce.price()),
        status: faker.helpers.arrayElement([true, false]),
        stock: parseInt(faker.string.numeric()),
        category: faker.commerce.department(),
        thumbnails: [faker.image.url()],
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
        __v: 0,
        id,
    }
}
export default generateProduct;