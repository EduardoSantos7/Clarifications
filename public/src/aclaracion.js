/* This script handle clarification proccess*/

var { getTicket, getATM } = require('../src/utils/DBhelperFunctions')
var { TicketInfoTable } = require('../src/utils/TicketInfoTable')
var { Calculator } = require('../src/utils/Calculator')
var { createWindow, isDayInWindow } = require('../src/utils/dateTimeAlgorithms')

const Swal = require('sweetalert2')

/* Constants and Global variables */
var ticket; // Save the merged info about clarification and atm.

/* Search in DB the ticket with input value as ID */

function search_ticket(){

	let ticket_id = document.getElementById('ticketInput').value;
	console.log("buscando...")
	if(ticket_id){
		getTicket(ticket_id, (clarification) => 
			getATM(clarification.atm , clarification, (clarification, atm) => {
				displayTicketInfo(clarification, atm);
		}));
	}
	else{
		alert("Inserta un ID valido");
	}
}

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
	new Calculator(id_col_1, 'IBM', true, ticket);

	/* Insert Client Calculator */
	new Calculator(id_col_2, 'BBVA', false, null);
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
	}
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
	}
}

