const changeRole = async (id) => {
    try {
        const response = await fetch(`/api/users/premium/${id}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
        if (response.status === 200) {
            toastr.success('Cambio de rol exitoso');
            setTimeout(() => {
                window.location.reload();
            }, 3000);
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

const deleteUser = async (id) => {
    try {
        const response = await fetch(`/api/users/${id}`,
            {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
        if (response.status === 200) {
            toastr.success('Se eliminó el usuario exitosamente');
            setTimeout(() => {
                window.location.reload();
            }, 3000);
            return await response.json();
        } else {
           throw new Error('Error al eliminar usuario');
        }
    } catch (error) {
        toastr.error('Error al eliminar usuario');
    }
};