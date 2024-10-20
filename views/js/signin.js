document.addEventListener('DOMContentLoaded', function() {
    var loginButton = document.getElementById('login');
    if(loginButton){
        loginButton.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }

    var registrarseButton = document.getElementById('registrarse');
    if(registrarseButton){
        registrarseButton.addEventListener('click', function() {
            var email = document.getElementById('input-mail').value;
            var name = document.getElementById('input-name').value;
            var password = document.getElementById('input-password').value;

            axios.post('/users', {
                user_name: name,
                user_mail: email,
                user_password: password
            })
            .then(function (response) {
                if (response.data.code === 201) {
                    alert('Usuario registrado correctamente');
                } else {
                    alert('Ocurrió un error al registrar el usuario');
                }
            })
            .catch(function (error) {
                console.error('There was an error!', error);
                alert('Ocurrió un error al registrar el usuario');
            });
        });
    }
})