const buy = async (cid) => {
    try {
        const response = await fetch(`/api/carts/${cid}/purchase`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status === 200) {
            toastr.success('Su compra se proceso de manera exitosa');
            setTimeout(() => {
                location.reload();
            }, 3000);
        } else {
            throw new Error('Ocurrió un problema al procesar su compra');
        }
        return await response.json();
    } catch (error) {
        toastr.error('Ocurrio un problema al procesar su compra');
    }
}
const deleteProduct = async (cid, pid) => {
    try {
        const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status === 200) {
            location.reload();
        } else {
            throw new Error('Ocurrió un problema al eliminar el producto del carrito');
        }
        return await response.json();
    } catch (error) {
        toastr.error('Ocurrió un problema al eliminar el producto del carrito');
    }
}