/* import configuration of enviroment */
require('dotenv').config();
/* Import class for collapse card */
var {CollapseCardBoard} = require('../views/commons/collapse')
/* Import path for stablish the python scripts path */
var path = require('path');
/* Import Python shell for communication*/
var {PythonShell} = require('python-shell');
/* Load the Cloudant library. */
var Cloudant = require('@cloudant/cloudant');
// Initialize Cloudant with settings from .env
var username = process.env.USER;
var password = process.env.PASSWORD;
var url = process.env.URL
var cloudant = Cloudant({ account: username, password: password });

/* Variables and constants */
var IN_PATHS = []; // Array for save input paths
var OUT_PATH = ""; // String for save output paths

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
        alert("Ingrese documentos para su depurado!");
        return;
    }
    if(!OUT_PATH){
        alert("Ingrese un path de destino!");
        return;
    }

    send_paths();
}

/* Get all the documents in inconsistencies db */

function load_inconsistencies(){
    console.log("entre")
    
    var db = cloudant.db.use(process.env.INCONSISTENCY_DB);
    
    db.list({include_docs:true}, function (err, data) {
        if(err){
            alert("Have trouble connecting to DB: ", err);
        }
        let board = new CollapseCardBoard('collapseCardsContainer', 'content')
        for(let i = 0; i < data.total_rows; i++){
            board.createCard(data.rows[i]);
        }
    });
}

function proc(str){
    console.log(str)
}

function send_paths(){
    
    let options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: path.join(__dirname, process.env.PYTHON_SCRIPTS_PATH),
        args: [IN_PATHS, OUT_PATH]
      };
       
      PythonShell.run('depurado.py', options, function (err, results) {

        if (err) throw(err);
        /* results is an array consisting of messages collected during execution */
        console.log('results: %j', results);
      });
}
