const handleCreateUser = async () => {
    try {
        const name = document.forms["createUser"]["name"].value;
        const lastname = document.forms["createUser"]["lastName"].value;
        const age = document.forms["createUser"]["age"].value;
        const email = document.forms["createUser"]["email"].value;
        const password = document.forms["createUser"]["password"].value;
        const payload = {
            first_name: name,
            last_name: lastname,
            email,
            age,
            password
        };
        const response = await fetch(`/api/sessions/register`,
            {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
        if (response.status === 400) {
            const res = await response.json()
            return Swal.fire({
                icon: "error",
                title: res.message,
                text: res.error.detail,
                confirmButtonText: "OK",
            });
        }
        setTimeout(() => {
            window.location.replace('/login')
        }, 3000);
        return Swal.fire({
            icon: "success",
            title: '¡Registro exitoso!',
            text: 'Redirigiendo al inico de sesión...',
            showConfirmButton: false
        });

    } catch (error) {
        console.log(error)
    }
}

const handleLoginUser = async () => {
    try {
        const email = document.forms["loginUser"]["email"].value;
        const password = document.forms["loginUser"]["password"].value;
        const payload = {
            email,
            password
        };
        const response = await fetch(`/api/sessions/login`,
            {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
        if (response.status === 400) {
            const res = await response.json()
            return Swal.fire({
                icon: "error",
                title: res.message,
                text: res.error.detail,
                confirmButtonText: "OK",
            });
        }
        setTimeout(() => {
            window.location.replace('/products')
        }, 3000);
        return Swal.fire({
            icon: "success",
            title: '¡Inicio de sesión exitoso!',
            text: 'Redirigiendo al listado de los productos...',
            showConfirmButton: false
        });

    } catch (error) {
        console.log(error)
    }

}

const handleLoginGitHub = () => {
    window.location.replace("/api/sessions/auth/github");
}

const logoutUser = async () => {
    try {
        await fetch(`/api/sessions/logout`,
            {
                method: 'GET', headers: { 'Content-Type': 'application/json' }
            })
        window.location.replace('/login')
    } catch (error) {
        console.log(error)
    }
}

