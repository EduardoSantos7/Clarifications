/* This script handle clarification proccess*/

var { searchTicket } = require('../src/utils/DBhelperFunctions')
var { TicketInfoTable } = require('../src/utils/TicketInfoTable')
var { Calculator } = require('../src/utils/Calculator')
var { Rejoinder } = require('../src/utils/Rejoinder')
var { createWindow, isDayInWindow } = require('../src/utils/dateTimeAlgorithms')
/* Import helfer functions for interact with DB service */
var {loadClarifications} = require('../src/utils/DBhelperFunctions')
/* Import class for collapse card */
var {CollapseCardBoard} = require('../views/commons/collapse')

const Swal = require('sweetalert2')

/* Constants and Global variables */
var ticket; // Save the merged info about clarification and atm.
var ibm_calculator; // Save the IBM calculator object
var client_calculator; // Save the client calculator object

/* Recives 2 dictionaries and display their data */

function displayTicketInfo(clarification, atm) {

	const HEADERS = ['TICKET KEY', 'INICIO', 'FIN', 'VENTANA', 'HORARIO', 'DÍA EN VENTANA' , 
						'HORAS NETAS', 'ATM', 'SITE', 'ESTADO', 'SLA', 'MAQUINA', 'MODELO', 'TAS']
	
	// Merge clarification and atm dicts in only one.
	let union = extend(clarification, atm);
	ticket = union;
	let start_date = new Date(ticket.fecha_inicio).getDay();
	let is_day_window = isDayInWindow(start_date, createWindow(ticket.dias_idc, ticket.hrs_idc));
	union['dia_ventana'] = is_day_window ? 'SI':'NO';

	// Save the ticket for handle it without repetitive DB calls.

	/* Display Table */
	new TicketInfoTable('TicketInfoTable', HEADERS, [union]);

}

/* Helper function used to merge 2 objects */

function extend(obj, src) {
    Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
    return obj;
}

/* Choose type of clarification */

function chooseClarification(){

  let value_selected = document.getElementById('selectClarification').value;

  switch (value_selected) {
    case "time":
      timeClarification();
      break;
    
    case "contribuyente":
      contribuyenteClarification();
      break;

    case "both":
      bothClarification();
      break;
  
    default:
      break;
  }
}

/* Time clarification*/

function timeClarification(){

	/* Validate if there is a ticket */

	if(!ticket){
		
		Swal.fire({
			title: '¡Busca un ticket!',
			text: '¡Debes buscar un ticket antes de hacer cualquier tipo de aclaración!',
			type: 'warning',
			confirmButtonText: 'Entendido!'
		});

		return;
	}

	let plot_zone = document.getElementById('displayZone');
	let id_col_1 = 'calculatorColumn1';
	let id_col_2 = 'calculatorColumn2';

	let container_row = document.createElement('div');
	container_row.className = 'row p-2';

	let column_1 = document.createElement('div');
	column_1.id = id_col_1;
	column_1.className = 'm-2';

	let column_2 = document.createElement('div');
	column_2.id = id_col_2;
	column_2.className = "m-2";
	
	container_row.appendChild(column_1);
	container_row.appendChild(column_2);
	plot_zone.appendChild(container_row);

	/* Insert IBM Calculator */
	ibm_calculator = new Calculator(id_col_1, 'IBM', true, ticket);

	/* Insert Client Calculator */
	client_calculator = new Calculator(id_col_2, 'BBVA', false, null);
}

/* Contribuyente clarification*/

function contribuyenteClarification(){
  
	/* Validate if there is a ticket */

	if(!ticket){
		
		Swal.fire({
			title: '¡Busca un ticket!',
			text: '¡Debes buscar un ticket antes de hacer cualquier tipo de aclaración!',
			type: 'warning',
			confirmButtonText: 'Entendido!'
		});
		return;
	}

	let plot_zone = document.getElementById('displayZone');

	let container_row = document.createElement('div');
	container_row.className = 'row p-2';

	let column_1 = document.createElement('div');
	let subRow1 = document.createElement('div');
	let subRow2 = document.createElement('div');
	let commentBox = document.createElement('textarea');

	commentBox.id = "commentBoxContribuyente"
	commentBox.className = 'mt-3';
	column_1.className = 'col-centered';
	subRow1.className = 'row';
	subRow2.className = 'row';

	create_catalogue_select(subRow1);

	subRow2.appendChild(commentBox);
	column_1.appendChild(subRow1);
	column_1.appendChild(subRow2);
	container_row.appendChild(column_1);
	plot_zone.appendChild(container_row);
}

/* Both clarification*/

function bothClarification(){
  
	/* Validate if there is a ticket */

	if(!ticket){

		Swal.fire({
			title: '¡Busca un ticket!',
			text: '¡Debes buscar un ticket antes de hacer cualquier tipo de aclaración!',
			type: 'warning',
			confirmButtonText: 'Entendido!'
		});
		return;
	}
	contribuyenteClarification();
	timeClarification();
}

/* Erase the content in the 3 main containers and I/O fields */

function cls(){

	var ticketInfoTable = document.getElementById("TicketInfoTable");
	while (ticketInfoTable.firstChild) {
		ticketInfoTable.removeChild(ticketInfoTable.firstChild);
	}
	
	var displayZone = document.getElementById("displayZone");
	while (displayZone.firstChild) {
		displayZone.removeChild(displayZone.firstChild);
	}

	var searchInput = document.getElementById('ticketInput');
	searchInput.value = '';

	var ajusteTiempo = document.getElementById('ajusteTiempo');
	ajusteTiempo.value = '';

	var nuevasHorasNetas = document.getElementById('nuevasHorasNetas');
	nuevasHorasNetas.value = '';

	var resultDatetime = document.getElementById('resultDatetime');
	resultDatetime.value = '';

	var selectClarification = document.getElementById('selectClarification');
	selectClarification.selectedIndex  = '0';
}

/* Create a select with catalogue options */
function create_catalogue_select(display_zone){

	const descriptions = ['Cajero sin sesionar', 'Problema Multivendor', 'Custodia no llego FS', 'Recoordina cita', 'Adecuaciones fisicas fuera de servicio banco',
		'Adecuaciones fisicas fuera de servicio empresa', 'Comunicaciones medio', 'Comunicaciones nodo', 'Comunicaciones RED local', 'Comunicaciones Router', 'Equipo de comunicaciones',
		'Cita no exitosa cliente/ IDC', 'Cita en tramite Protocolo / IDC', 'Recoordina cita', 'Vandalizmo Dispensador / TFS', 'Vandalizmo Lectora / TFS', 'Vandalizmo teclado /TFS',
		'Vandalizmo fascia/ PLA', 'Vandalizmo monitor/ TFS', 'Mantenimiento cancelado', 'Energia Electrica (Local)', 'Energia Electrica (Zonal)', 'Prob. EE local suc','Prob. EE local empresa',
		'Prob. EE CFE', 'Error Operativo Suc/Cia Tras', 'Error por Calidad de Billete', 'Riesgo Operativo'
	];
	const codes = ['HOST1', 'HOST2', 'FM0070', 'ETVRECO', 'ADFIS', 'ADFIS1', 'COMED', 'CONODO', 'COMREDL', 'COROU', 'EQCOM', 'CNECIDC', 'CTPRIDC', 'ETVRECO', 'OC0017', 'OC0018', 'OC0001',
		'VAFASPL', 'VAFASFS', 'VAMONFS', 'FM0071', 'LOCAL', 'ZONA', 'EELOCS', 'ENEMP', 'EECFE', 'FM0074', 'FM0075', 'ROAFG'
	];

	let select = document.createElement('select');
	select.className = 'custom-select';
	select.id = 'contribuyenteSelect';

	for(let i = 0; i < descriptions.length; i++){
		let option = document.createElement('option');
		option.appendChild(document.createTextNode(descriptions[i]));
		option.value = codes[i];
		select.appendChild(option);
	}
	select.selectedIndex = "0";

	display_zone.appendChild(select);

}

/* Return the calculation as string (ordered)*/

function get_calculation_comment(){

	let comment = 'IBM\n';
	comment += ibm_calculator.getCalculationComment() + '\n';
	comment += 'CLIENTE\n'
	comment += ibm_calculator.getCalculationComment() + '\n';
	comment += "AJUSTE DE TIEMPO: " + document.getElementById('ajusteTiempo').value + '\n';
	comment += "NUEVAS HORAS NETAS: " + document.getElementById('nuevasHorasNetas').value + '\n';
	comment += "NUEVA FECHA FIN: " + document.getElementById('resultDatetime').value + '\n';
	return comment;
}

function update_clarification(){

	let type = document.getElementById('selectClarification').value;
	ticket['tipo'] = type.toUpperCase();

	if(type === 'time'){
		ticket['comentario'] = get_calculation_comment();
	}
	else if(type === 'contribuyente'){
		let selector = document.getElementById('contribuyenteSelect');
		let code =  selector.value;
		let contribuyente = selector.options[selector.selectedIndex].text
		ticket['contribuyente'] = contribuyente;
		ticket['codigo'] = code;
		ticket['comentario'] = document.getElementById('commentBoxContribuyente').value;
	}
	else if(type === 'both'){
		let selector = document.getElementById('contribuyenteSelect');
		let code =  selector.value;
		let contribuyente = selector.options[selector.selectedIndex].text
		ticket['contribuyente'] = contribuyente;
		ticket['codigo'] = code;
		ticket['comentario'] = document.getElementById('commentBoxContribuyente').value + '\n' + get_calculation_comment();;
	}
	ticket['nueva_fecha_fin'] = document.getElementById('resultDatetime').value;
	
	let rejoinder = new Rejoinder(ticket);

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
                type: 'danger',
                confirmButtonText: 'Ok!'
            });
		}
		cls();
	});

}

