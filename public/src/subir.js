/* Import helfer functions for interact with DB service */
var { uploadClarification } = require('../src/utils/DBhelperFunctions')
const Swal = require('sweetalert2')

function showFields(){
	let value_selected = document.getElementById('selectElement').value;
  	value_selected  = value_selected.toLowerCase()

	switch (value_selected) {
		case "atm":
            showATMFields();
            insertUploadButton();
            break;
		
		case "ticket":
            showTicketFields();
            insertUploadButton();
            break;
	}
}

function showTicketFields(){
    let title = "Agrega un ticket";
    let content = "Este ticket se agregará directamente a la base de aclaraciones sin pasar por el depurado ¡Verifica bien antes de cargarlo!"
    let form = document.createElement('form');
    let display_zone = document.getElementById('displayZone');
    
    insertTitle(title, content);

    form_group_1 = createFormGroup('TICKET KEY:', 'form_1', 'text', '126...', '_id');
    form_group_2 = createFormGroup('ATM ID:', 'form_2', 'text', '1013', 'atm');
    form_group_3 = createFormGroup('ESN:', 'form_3', 'text', 'IN00...', 'remedy');
    form_group_4 = createFormGroup('HORAS NETAS', 'form_4', 'time', '126...', 'horas_netas');
    form_group_5 = createFormGroup('FALLA:', 'form_5', 'text', 'El dispositivo...', 'falla');
    form_group_6 = createFormGroup('FECHA INICIO:', 'form_6', 'datetime-local', '', 'fecha_inicio');
    form_group_7 = createFormGroup('FECHA FIN:', 'form_7', 'datetime-local', '', 'fecha_fin');

    form.appendChild(form_group_1);
    form.appendChild(form_group_2);
    form.appendChild(form_group_3);
    form.appendChild(form_group_4);
    form.appendChild(form_group_5);
    form.appendChild(form_group_6);
    form.appendChild(form_group_7);
    display_zone.appendChild(form);


}

function showATMFields(){
    let title = "Agrega un ATM";
    let content = "Este ticket se agregará directamente a la base de cajeros sin pasar por algún filtro ¡Verifica bien antes de cargarlo!"
    insertTitle(title, content);
}

function insertTitle(title, content){
    let main_div = document.getElementById('TicketInfoTable');
    let header = document.createElement('h1');
    let small = document.createElement('small');

    main_div.innerHTML = ''; // Clean
    main_div.className = 'page-header';
    header.innerHTML = title;
    small.className = 'text-muted';
    small.innerHTML = content;
    main_div.appendChild(header);
    main_div.appendChild(small)
}

function createFormGroup(label_data, for_id, input_type, placeholder, label_value){
    let main_div = document.createElement('div');
    let label = document.createElement('label');
    let input = document.createElement('input');

    main_div.className = 'form-group';
    label.htmlFor = for_id;
    label.value = label_value;
    label.innerHTML = label_data;
    input.type = input_type;
    input.className = 'form-control';
    input.id = for_id;
    input.placeholder = placeholder;
    main_div.appendChild(label);
    main_div.appendChild(input);

    return main_div;
}

function insertUploadButton(){
    let main_div = document.createElement('div');
    let button = document.createElement('button');
    let sidebar = document.getElementById('sidebar');
    button.className = "btn btn-outline-primary"
    button.setAttribute('onclick', "upload()");
    main_div.className = 'pt-4';
    button.innerHTML = "Subir";
    main_div.appendChild(button);
    sidebar.appendChild(main_div);

}

function upload(){
    let data = verify();

    if(!data){
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'No se han podido subir los registros! Asegurate de haber llenado los campos',
          })
    }

    // Complete ticket
    data['solved'] = false;

    uploadClarification(data).then((res) => {
        if(!res){
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'No se han podido subir la información!',
              });
              return;
        }
        
        Swal.fire({
            title: 'Ticket subido!',
            text: 'Se ha creado un nuevo ticket!',
            type: 'success',
            confirmButtonText: 'Ok!'
        });

    })
}

function verify(){
    let forms = document.getElementsByClassName('form-group');
    let data = {};

    for(let i = 0; i < forms.length; i++){
        input = forms[i].getElementsByTagName('input')[0];
        label = forms[i].getElementsByTagName('label')[0].value;
        let value = input.value;
        if (value.includes('T', 10)){
            value = input.value.replace('T', ' ')
        }
        data[label] = value;
    }

    // Check if all the fields are filled.
    let all_true = Object.keys(data).every(function(k){ return data[k] });

    if(! all_true){
        return false;
    }

    return data;
}