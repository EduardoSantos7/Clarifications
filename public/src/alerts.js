/* This script include many functions that handle alerts */

const Swal = require('sweetalert2');

function ATMMissingAlert(){
    Swal.fire({
        title: 'El ATM no esta registrado',
        text: "Al no estar registrado no se puede mostrar la información respectiva en la tabla de datos",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Registrarlo!',
        cancelButtonText: 'Ignorar!',
      })
}

module.exports.ATMMissingAlert = ATMMissingAlert;