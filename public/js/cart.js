const buy = async () => {
    try {
        const response = await fetch(`/api/carts/1/purchase`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status === 200) {
            toastr.success('Su compra se proceso de manera exitosa');
            location.reload();
        } else {
            throw new Error('Ocurrio un problema al procesar su compra');
        }
        return await response.json();
    } catch (error) {
        toastr.error('Ocurrio un problema al procesar su compra');
    }
}