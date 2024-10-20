document.addEventListener('DOMContentLoaded', function() {
    var registrarseButton = document.getElementById('registrarse');
    if (registrarseButton) {
        registrarseButton.addEventListener('click', function() {
            window.location.href = 'signin.html';
        });
    }

    var loginButton = document.getElementById('login');
    if (registrarseButton) {
        registrarseButton.addEventListener('click', function() {
            var email = document.getElementById('input-mail').value;
            var password = document.getElementById('input-password').value;

            axios.post('/user/login', {
                user_mail: email,
                user_password: password
            })
            .then(function (response) {
                if (response.data.code === 200) {
                alert('Login successful');
                } else {
                alert('Login failed: ' + response.data.message);
                }
            })
            .catch(function (error) {
                console.error('There was an error!', error);
            });
        });
    }
});