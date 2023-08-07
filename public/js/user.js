
const changeRole = async (id) => {
    try {
        const response = await fetch(`/api/users/premium/${id}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
        if (response.status === 200) {
            toastr.success('Cambio de rol exitoso');
            return await response.json();
        } else {
            const errorResponse = await response.json();
            const errorMessage = errorResponse.error?.detail || errorResponse.message || "Error en la solicitud";
            toastr.error(errorMessage);
        }
    } catch (error) {
        toastr.error('Error al actualizar el rol del usuario');
    }
};