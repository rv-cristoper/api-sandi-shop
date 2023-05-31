export const generatorUserError = (user) => {
  return `One or more of the following fields are invalid or incomplete.
    List of required fields:
      - firstName : ${user.firstName}
      - lastName  : ${user.lastName}
      - email     : ${user.email}
      - phone     : ${user.phone}
      - age       : ${user.age}
      `
}

export const generatorProductError = (product) => {
  return `Uno o más de los siguientes campos no son válidos o están incompletos.
  Lista de campos obligatorios:
    - title       : ${!product.title ? 'campo requerido ' : product.title}
    - description : ${!product.description ? 'campo requerido ' : product.description}
    - code        : ${!product.code ? 'campo requerido ' : product.code}
    - price       : ${!product.price ? 'campo requerido ' : product.price}
    - stock       : ${!product.stock ? 'campo requerido ' : product.stock}
    - category    : ${!product.category ? 'campo requerido ' : product.category}
    `
}