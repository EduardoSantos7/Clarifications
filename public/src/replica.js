/* This script handle rejoinder proccess*/

var { loadRejoinders, searchRejoinder } = require('../src/utils/DBhelperFunctions');
/* Import path for stablish the python scripts path */
var path = require('path');
/* Import Python shell for communication*/
var {PythonShell} = require('python-shell');

var export_ids = []; // Save the IDs
var OUT_PATH = ""; // String for save output paths
var current_rejoinder = {};

function prepareExport(rejoinder_id){

    // Avoid duplicate values in export array
    if(export_ids.indexOf(rejoinder_id) === -1){
        export_ids.push(rejoinder_id);
        Swal.fire({
			title: '¡Guardado!',
			text: '¡Esta replica ahora esta lista para ser exportada!',
			type: 'success',
			confirmButtonText: 'Entendido!'
		});
    }
    else{
        Swal.fire({
			title: '¡Ya has seleccionado esta replica!',
			text: '¡Esta replica había sido seleccionada previamente!',
			type: 'warning',
			confirmButtonText: 'Entendido!'
		});
    }
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

/* Control the flow of export */

function exportRejoinders(){

    if(!OUT_PATH){
        Swal.fire({
            title: '¡Falta ruta!',
            text: "¡Debe agregar una ruta de destino!",
            type: 'warning',
            confirmButtonText: 'Ok!'
        });
        return;
    }
    if(!export_ids){
        Swal.fire({
            title: '¡No hay replicas!',
            text: "¡Debes agregar al menos una replica para exportar!",
            type: 'warning',
            confirmButtonText: 'Ok!'
        });
        return;
    }
    send();
    
}

/* Display the last rejoinder */

function loadRejoinderData(rejoinder){

    console.log(rejoinder)
    current_rejoinder = rejoinder
    ticket = rejoinder;
    chooseClarification(rejoinder.tipo);
    switch(rejoinder.tipo.toLowerCase()){
        case 'time':
            restoreCalculation(rejoinder);
            break;
        case 'contribuyente':
            document.getElementById('contribuyenteSelect').selectedIndex = codes.indexOf(rejoinder.codigo);
            document.getElementById('commentBoxContribuyente').value = rejoinder.comentario_aclaracion;
            break;
        case 'both':
            document.getElementById('contribuyenteSelect').selectedIndex = codes.indexOf(rejoinder.codigo);
            document.getElementById('commentBoxContribuyente').value = rejoinder.comentario_aclaracion.split('\n')[0];
            restoreCalculation(rejoinder);
            break;
    }

}

/* Write again the values for each calculator */

function restoreCalculation(rejoinder){
    
    try{
        let calculation = rejoinder.comentario_aclaracion.split('\n');
        let index_ibm = calculation.indexOf('IBM');
        let index_client = calculation.indexOf('CLIENTE');
        let index_client_end = calculation.indexOf('', index_client);

        let ibm_lines = calculation.slice(index_ibm + 2, index_client - 1);
        let client_lines = calculation.slice(index_client + 2, index_client_end);

        ibm_calculator.setCalculationComment(ibm_lines);
        client_calculator.setCalculationComment(client_lines);

    }
    catch (err){
        Swal.fire({
            title: '¡No se pudieron cargar los cálculos!',
            text: err,
            type: 'error',
            confirmButtonText: 'Ok!'
        });
        return;
    }

}

/* Call the python script for export */

function send(){

    let options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: path.join(__dirname, process.env.PYTHON_SCRIPTS_PATH),
        args: [OUT_PATH, export_ids]
      };
       
      PythonShell.run('rejoinder.py', options, function (err, results) {

        if (err) {
            Swal.fire({
                title: '¡No se pudieron crear los archivos!',
                text: err,
                type: 'error',
                confirmButtonText: 'Ok!'
            });
            return;
        }
        /* results is an array consisting of messages collected during execution */
        Swal.fire({
            title: '¡Archivo(s) Creados!',
            text: 'Se ha(n) creado los archivos en la ruta indicada!',
            type: 'success',
            confirmButtonText: 'Ok!'
        });
        console.log(results)
      });
}

function update_rejoinder(){

    console.log(current_rejoinder)
	let type = current_rejoinder.tipo.toLowerCase();

	if(type === 'time'){
		current_rejoinder['comentario'] = get_calculation_comment();
	}
	else if(type === 'contribuyente'){
		let selector = document.getElementById('contribuyenteSelect');
		let code =  selector.value;
		let contribuyente = selector.options[selector.selectedIndex].text
		current_rejoinder['contribuyente'] = contribuyente;
		current_rejoinder['codigo'] = code;
		current_rejoinder['comentario'] = document.getElementById('commentBoxContribuyente').value;
	}
	else if(type === 'both'){
		let selector = document.getElementById('contribuyenteSelect');
		let code =  selector.value;
		let contribuyente = selector.options[selector.selectedIndex].text
		current_rejoinder['contribuyente'] = contribuyente;
		current_rejoinder['codigo'] = code;
		current_rejoinder['comentario'] = document.getElementById('commentBoxContribuyente').value + '\n' + get_calculation_comment();;
	}
	current_rejoinder['nueva_fecha_fin'] = document.getElementById('resultDatetime').value;
	
	let rejoinder = new Rejoinder(current_rejoinder);

	if(!rejoinder){
		Swal.fire({
			title: '¡No se pudo crear la replica!',
			text: err,
			type: 'danger',
			confirmButtonText: 'Ok!'
		});
	}

	rejoinder.upload().then((resolve, reject) => {
		if(resolve){
			Swal.fire({
				title: '¡Replica guardada!',
				text: 'Se ha creado la replica!',
				type: 'success',
				confirmButtonText: 'Ok!'
			});
		}
		else if(reject){
			Swal.fire({
                title: '¡No se pudo crear la replica!',
                text: err,
                type: 'error',
                confirmButtonText: 'Ok!'
            });
		}
		cls();
		loadRejoinders();
	});

}