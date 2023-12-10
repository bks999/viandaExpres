let id = (id) => document.getElementById(id);

let classes = (classes) => document.getElementsByClassName(classes);

let Nombre = id("nombre"),
    Email = id("email"),
    // Asunto = id("Asunto"),
    Comentario = id("comentario"),
    Formulario = id("form"),
    mensajeError = classes("error"),
    iconoSuccess = classes("iconoSuccess"),
    iconoFailure = classes("iconoFailure");

Formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    validacion(Nombre, 0, "Debe completar con su nombre");
    validacion(Email, 1, "Debe completar con su email");
    //validacion(Asunto, 2, "Debe completar el asunto");
    validacion(Comentario, 3, "Debe completar el comentario");

    const formData = new FormData(document.getElementById('form'));

    // Realizar el envío utilizando fetch
    fetch('http://127.0.0.1:5000/subscripcion', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                // Ocultar formulario
                document.getElementById('form').style.display = 'none';
                // Mostrar el mensaje de "Datos enviados"
                document.getElementById('mensajeEnviado').style.display = 'block';

                // Reiniciar el formulario después de 2 segundos (puedes ajustar el tiempo)
                setTimeout(function () {
                    // Ocultar formulario
                    document.getElementById('form').reset();
                    document.getElementById('form').style.display = 'block';
                    document.getElementById('mensajeEnviado').style.display = 'none';
                }, 2000);
            } else {
                throw new Error('Error al enviar los datos');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

});


let validacion = (id, num, mensaje) => {
    if (id.value.trim() === "") {
        mensajeError[num].innerHTML = mensaje;
        mensajeError[num].style.opacity = '1';
        id.style.border = "2px solid red";
        iconoFailure[num].style.opacity = '1';
        iconoSuccess[num].style.opacity = '0';

    } else {
        mensajeError[num].innerHTML = "";
        mensajeError[num].style.opacity = '0';
        id.style.border = "2px solid green";
        iconoFailure[num].style.opacity = "0";
        iconoSuccess[num].style.opacity = "1";
    }
};
