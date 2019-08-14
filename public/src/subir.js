

function showFields(){
	let value_selected = document.getElementById('selectElement').value;
  	value_selected  = value_selected.toLowerCase()

	switch (value_selected) {
		case "atm":
            showATMFields();
            break;
		
		case "ticket":
            showTicketFields();
            break;
	}
}

function showTicketFields(){
    let title = "Agrega un ticket";
    let content = "Este ticket se agregará directamente a la base de aclaraciones sin pasar por el depurado ¡Verifica bien antes de cargarlo!"
    let form = document.createElement('form');
    let display_zone = document.getElementById('displayZone');
    
    insertTitle(title, content);

    form_group_1 = createFormGroup('TICKET KEY:', 'form_1', 'text', '126...');

    form.appendChild(form_group_1);
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

function createFormGroup(label_data, for_id, input_type, placeholder){
    let main_div = document.createElement('div');
    let label = document.createElement('label');
    let input = document.createElement('input');

    main_div.className = 'form-group';
    label.htmlFor = for_id;
    label.innerHTML = label_data;
    input.type = input_type;
    input.className = 'form-control';
    input.id = for_id;
    input.placeholder = placeholder;
    main_div.appendChild(label);
    main_div.appendChild(input);

    return main_div;
}