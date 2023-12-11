document.getElementById('form-subscribe').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById('form-subscribe'));

    // Realizar el envío utilizando fetch
    fetch('http://bks999.pythonanywhere.com/subscripcion', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                // Ocultar formulario
                document.getElementById('form-subscribe').style.display = 'none';
                // Mostrar el mensaje de "Datos enviados"
                document.getElementById('mensajeEnviado').style.display = 'block';

                // Reiniciar el formulario después de 2 segundos (puedes ajustar el tiempo)
                setTimeout(function () {
                    // Ocultar formulario
                    document.getElementById('form-subscribe').reset();
                    document.getElementById('form-subscribe').style.display = 'block';
                    document.getElementById('mensajeEnviado').style.display = 'none';
                }, 10000);
            } else {
                throw new Error('Error al enviar los datos');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
