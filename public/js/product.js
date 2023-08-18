
const addProduct = async (pid, cid) => {
    try {
        const response = await fetch(`/api/carts/${cid}/product/${pid}`,
            {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
            });
        if (response.status === 200) {
            Swal.fire({
                icon: "success",
                title: '¡Producto agregado al carrito!',
                text: '',
                showConfirmButton: false
            });
            setTimeout(() => {
                window.location.reload();
            }, 1200);
        }else {
            toastr.error('Error al agregar producto al carrito');
        }
        return await response.json();
    } catch (error) {
        toastr.error('Error al agregar producto al carrito');
        console.error(error);
    }
};