document.getElementById('btnTraerMensajes').addEventListener('click', () => {
    fetch('http://127.0.0.1:5000/subscripcion') // Actualizar la ruta según tu API en Flask
      .then(response => response.json())
      .then(datos => {
        console.log("datos", datos)
        const tablaBody = document.querySelector('#tablaMensajes tbody');
        tablaBody.innerHTML = ''; // Limpiar tabla antes de agregar nuevos datos

        // Iterar sobre los datos y agregar filas a la tabla
        datos.forEach(dato => {
          const fila = document.createElement('tr');
          fila.innerHTML = `
            <td>${dato.id}</td>
            <td>${dato.apellido}</td>
            <td>${dato.nombre}</td>
            <td>${dato.email}</td>
            <td>${dato.fecha_solicitud}</td>
            <td>${dato.comentario}</td>
            <td>${dato.leido}</td>
          `;
          tablaBody.appendChild(fila);
        });
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
    });
});

document.getElementById('form-subscribe').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto
    
    // Obtener los valores de los campos
    const id = document.getElementById('idInput').value;
    const gestion = document.getElementById('detalleInput').value;

    const formData = new FormData();
    formData.append('gestion', gestion); // Agregar el detalle a los datos del formulario

    fetch(`http://127.0.0.1:5000/subscripcion/${id}`, { // Actualizar la ruta según tu API en Flask
      method: 'PUT',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log('Respuesta del servidor:', data);
      // Aquí podrías mostrar una confirmación al usuario o hacer algo con la respuesta del servidor
      document.getElementById('mensajeEnviado').style.display = 'block'; // Mostrar mensaje de confirmación
      setTimeout(function () {
        document.getElementById('mensajeEnviado').style.display = 'none'; // Ocultar mensaje después de cierto tiempo
      }, 2000); // Tiempo de visualización del mensaje (2 segundos en este caso)
    })
    .catch(error => {
      console.error('Error al enviar los datos:', error);
    });
});
