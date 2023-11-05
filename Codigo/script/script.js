let id = (id) => document.getElementById(id);

let classes = (classes) => document.getElementsByClassName(classes);

let Nombre = id("Nombre"),
    Email = id("Email"),
    Asunto = id("Asunto"),
    Comentario = id("Comentario"),
    Formulario = id("form"),
    mensajeError = classes("error"),
    iconoSuccess = classes("iconoSuccess"),
    iconoFailure = classes("iconoFailure");

Formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    validacion(Nombre, 0, "Debe completar con su nombre");
    validacion(Email, 1, "Debe completar con su email");
    validacion(Asunto, 2, "Debe completar el asunto");
    validacion(Comentario, 3, "Debe completar el comentario");

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

