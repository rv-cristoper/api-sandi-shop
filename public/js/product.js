
const addProduct = async (pid, cid) => {
    try {
        const response = await fetch(`/api/carts/${cid}/product/${pid}`,
            {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
            });
        if (response.status === 200) {
            toastr.success('Producto agregado al carrito');
        }else {
            toastr.error('Error al agregar producto al carrito');
        }
        return await response.json();
    } catch (error) {
        toastr.error('Error al agregar producto al carrito');
        console.error(error);
    }
};