/* import configuration of enviroment */
require('dotenv').config();
/* Import class for collapse card */
var {CollapseCardBoard} = require('../views/commons/collapse')
/* Import path for stablish the python scripts path */
var path = require('path');
/* Import Python shell for communication*/
var {PythonShell} = require('python-shell');
/* Import helfer functions for interact with DB service */
var {loadInconsistencies, solveInconsistensy, returnToInconsistency} = require('../src/utils/DBhelperFunctions')
/* Variables and constants */
var IN_PATHS = []; // Array for save input paths
var OUT_PATH = ""; // String for save output paths
const Swal = require('sweetalert2')

/* Read and display the input files */

function get_input_paths(){
    let input = document.getElementById('input_files');
    let file_names = []; // Content the names of selected files.
    files = input.files;
    
    /* Clean Input array */
    IN_PATHS = [];


    for(let i = 0; i < files.length; i++){
        file_names.push(files[i].name);
        IN_PATHS.push(files[i].path);
    }

    // Add the corresponing label in holder field.
    add_name_badged("input_names", file_names);
}

/* Read and display the output files */

function get_output_path(){
    let input = document.getElementById('output_files');
    let file_names = []; // Content the names of selected files.
    file = input.files[0];

    OUT_PATH = file.path;

    // Add the corresponing label in holder field.
    add_name_badged("output_name" , [file.name]);
}

/* Put a label inside a badged class and write it in the indicated field */

function add_name_badged(area_id, names){
    
    let area = document.getElementById(area_id);
    let len = names.length;
    area.innerHTML = "" ; // Clean
    if(len > 1){
        area.innerHTML += "<span class=\" p-2 badge badge-warning\"> Seleccionaste " + len + " archivos </span>";
    }
    else{
        area.innerHTML = "<span class=\" p-2 badge badge-warning\">" + names[0] + "</span>";
    }
}

/* Control the process of valide inputs and communication */

function pipeline(){

    /* Avoid empty paths */
    if(!IN_PATHS.length > 0){
        Swal.fire({
			title: '¡Ingrese documentos!',
			text: '¡Debes ingresar documentos para que sean depurados!',
			type: 'warning',
			confirmButtonText: 'Entendido!'
		});
        return;
    }
    if(!OUT_PATH){
        Swal.fire({
			title: '¡Ingrese Path!',
			text: '¡Debes ingresar el path en el que se guardaran los documentos depurados!',
			type: 'warning',
			confirmButtonText: 'Entendido!'
		});

		return;
    }

    send_paths();
}

function send_paths(){
    
    let options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: path.join(__dirname, process.env.PYTHON_SCRIPTS_PATH),
        args: [IN_PATHS, OUT_PATH]
      };
       
      PythonShell.run('depurado.py', options, function (err, results) {

        if (err) {
            Swal.fire({
                title: '¡Ocurrió un problema!',
                text: err,
                type: 'error',
                confirmButtonText: 'Entendido!'
            });
    
            return;
        }
        /* results is an array consisting of messages collected during execution */
        console.log('results: %j', results);
        Swal.fire({
			title: '¡Documentos listos!',
			text: '¡Documentos creados en la carpeta indicada!',
			type: 'success',
			confirmButtonText: '¡Que bueno!'
		});

		return;
      });
}
