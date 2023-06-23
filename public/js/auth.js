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

const handleForgotPassword = async () => {
    let reset = document.getElementById("recuperar");
    reset.style.opacity = ".5";
    reset.style.pointerEvents = "none";
    try {
        const email = document.forms["forgotPassword"]["email"].value;
        const payload = {
            email
        };
        const response = await fetch(`/api/sessions/forgot-password`,
            {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

        if (response.status === 400) {
            const res = await response.json()
            return Swal.fire({
                icon: "error",
                title: res.message,
                confirmButtonText: "OK",
            });
        }
        return Swal.fire({
            icon: "success",
            title: 'Recuperación exitosa!',
            text: 'Revise su email para continuar con el proceso de recuperación de contraseña',
            confirmButtonText: "OK",
        });

    } catch (error) {
        console.log(error)
    } finally {
        reset.style.opacity = "1";
        reset.style.pointerEvents = "initial";
    }

}

const handleResetPass = async () => {
    let email = document.forms["resetPass"]["email"].value;
    try {
        const pass1 = document.forms["resetPass"]["password"].value;
        const pass2 = document.forms["resetPass"]["password2"].value;
        if (pass1 !== pass2) {
            return Swal.fire({
                icon: "error",
                title: 'Las contraseñas no coinciden',
                confirmButtonText: "OK",
            });
        }
        const payload = {
            email,
            password: pass1
        };
        const response = await fetch(`/api/sessions/reset-password`,
            {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

        if (response.status === 400) {
            const res = await response.json()
            return Swal.fire({
                icon: "error",
                title: res.message,
                confirmButtonText: "OK",
            });
        }
        return Swal.fire({
            icon: "success",
            title: 'Cambio de contraseña exitosa!',
            text: '',
            confirmButtonText: "OK",
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

