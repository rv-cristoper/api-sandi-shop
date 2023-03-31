
const addProduct = async (id) => {
    try {
        const cartId = 1;
        const response = await fetch(`/api/carts/${cartId}/product/${id}`,
            {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
            });
        toastr.success('Producto agregado al carrito');
        return await response.json();
    } catch (error) {
        toastr.error('Error al agregar producto al carrito');
        console.error(error);
    }
};