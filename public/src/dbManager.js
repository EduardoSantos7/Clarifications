/* This script handle the manager actions on DBs */

var Chart = require('chart.js');

/* Import helfer functions for interact with DB service */
var { getAllRecordDbs, cleanDb  } = require('../src/utils/DBhelperFunctions')
/* Import Python shell for communication*/
var {PythonShell} = require('python-shell');
/* Import path for stablish the python scripts path */
var path = require('path');
const Swal = require('sweetalert2')

function loadCharts(){
    
    var popCanvas = document.getElementById("plots");
    var popCanvas = document.getElementById("plots").getContext("2d");

    getAllRecordDbs().then((lengths) => {
        
        var barChart = new Chart(popCanvas, {
            type: 'bar',
            data: {
              labels: ["Aclaraciones", "Inconsistencias", "Replicas"],
              datasets: [{
                label: 'Registros en BDs',
                data: lengths,
                backgroundColor: [
                    'rgba(255, 186, 36, 0.7)',
                    'rgba(10, 100, 235, 0.7)',
                    'rgba(255, 10, 10, 0.7)'
                ]
              }]
            }
          });
    });
    
}

function performTask(){

    let selectorDb = document.getElementById('selectDB');
    let selected_db = selectorDb.options[selectorDb.selectedIndex].text;
    let task = document.getElementById('selectAction').value;
    let message = "<div>Realizarás una acción sobre la base de datos: <span class=\"text-danger\">" + selected_db + "</span> ingresa el nombre de la BD para confirmar </div>";
	var target_db = '';
	console.log(selected_db)
	switch(selected_db){
		case "Inconsistencias": 
			target_db = process.env.INCONSISTENCY_DB;
			break;
		case "Aclaraciones":
			target_db = process.env.CLARIFICATION_DB;
			break;
		case "Replicas":
			target_db = process.env.REJOINDER_DB;
			break;
	}

    // Confirmation
    Swal.fire({
        title: message,
        input: 'text',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'Necesitas escribir el nombre de la BD para confirmar!'
          }
          if(value !== selected_db){
              return "Los nombres deben coincidir";
		  }
          switch(task){
              case 'download':
				break;
			  case 'clean':
				  console.log("target", target_db)
				  sendTask(target_db, 'clean');
          }
        }
    });
}

function sendTask(target_db, task){
	
	let options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: path.join(__dirname, process.env.PYTHON_SCRIPTS_PATH),
        args: [target_db, task]
	  };
       
      PythonShell.run('dbManager.py', options, function (err, results) {

        if (err) throw(err);
		
		Swal.fire({
			title: 'Tarea Finalizada!',
			text: '¡La operación ha concluido con éxito!',
			type: 'success',
			confirmButtonText: 'Entendido!'
		});
		// Reload charts
		loadCharts();
      });
}
