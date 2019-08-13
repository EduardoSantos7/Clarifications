/* This script implement the functions for interact with DB service */

/* import configuration of enviroment */
require('dotenv').config();
var { ATMMissingAlert } = require('../alerts')
/* Load the Cloudant library. */
var Cloudant = require('@cloudant/cloudant');
// Initialize Cloudant with settings from .env
var username = process.env.USER;
var password = process.env.PASSWORD;
var url = process.env.URL
var cloudant = Cloudant({ account: username, password: password });


/* Get all the documents in inconsistencies db that are not solved */

function loadInconsistencies(){

    var db = cloudant.db.use(process.env.INCONSISTENCY_DB);
    
    db.find({selector:{solved:false}}, function (err, data) {
        if(err){
            alert("Have trouble connecting to DB: ", err);
        }
        console.log("soy la data", data)
        let options = {
            'headers':["#", 'INICIO', 'FIN', 'HORAS NETAS', 'SEMAFORO', 'ARCHIVO', 'ACCIÓN'],
            'fields':['fecha_inicio', 'fecha_fin', 'horas_netas', 'semaforo', 'archivo'],
            'actionButtonText':'Agregar',
            'type':'inconsistency',
            'title':'INCONSISTENCIAS',
            'mainMenssage':`Los siguientes tickets no pueden 
                                ser agregados a la BD de Aclaraciones 
                                    hasta que se resuelvan los confictos`
        }
        let board = new CollapseCardBoard('collapseCardsContainer', 'content', options)
        for(let i = 0; i < data.docs.length; i++){
            board.createCard(data.docs[i]);
        }
    });
}

/* Get all the documents in clarification */

function loadClarifications(){

    var db = cloudant.db.use(process.env.CLARIFICATION_DB);
    
    db.find({ selector: { solved:false } }, function(err, result) {
        data = result.docs
        if(err){
            alert("Have trouble connecting to DB: ", err);
        }

        let amount = (typeof data.rows !== 'undefined') ? String(data.length) : '0'

        let options = {
            'headers':["#", 'ATM', 'INICIO', 'FIN', 'HORAS NETAS', 'SEMAFORO', 'REMEDY' ,'ACCIÓN'],
            'fields':['atm', 'fecha_inicio', 'fecha_fin', 'horas_netas', 'semaforo' ,'remedy'],
            'actionButtonText':'Aclarar',
            'type':'clarification',
            'mainMenssage':"Tienes pendientes " + String(amount) + " aclaraciones",
            title:'ACLARACIONES'
        }
        let board = new CollapseCardBoard('collapseCardsContainer', 'displayZone', options)

        for(let i = 0; i < data.length; i++){
            board.createCard(data[i]);
        }
    });
}

/* Get all the documents in clarification */

function loadRejoinders(){

    var db = cloudant.db.use(process.env.REJOINDER_DB);
    
    db.list({include_docs:true}, function (err, data) {
        if(err){
            alert("Have trouble connecting to DB: ", err);
        }
        let options = {
            'headers':["#", 'ATM', 'INICIO', 'FIN', 'NUEVA FECHA FIN', 'TIPO', 'REMEDY' ,'ACCIÓN'],
            'fields':['atm', 'fecha_inicio', 'fecha_fin', 'nueva_fecha_fin', 'tipo' ,'tarea_remedy'],
            'actionButtonText':'Replicar',
            'type':'rejoinder',
            'mainMenssage':"Tienes pendientes " + String(data.rows.length) + " replicas",
            'title':'REPLICAS',
            'rejoinderButtonText':'Guardar'
        }
        let board = new CollapseCardBoard('collapseCardsContainer', 'displayZone', options)
        for(let i = 0; i < data.rows.length; i++){
            board.createCard(data.rows[i]);
        }
    });
}

/* Search in DB the ticket with input value as ID */

function searchTicket(clarification_id){

    let ticket_id = '';

    if(clarification_id){
        ticket_id = String(clarification_id);
    }
    else{
        ticket_id = document.getElementById('ticketInput').value;
    }
    if(!ticket_id){
        Swal.fire({
            title: '¡Seleccione un ID valido!',
            text: 'Debe seleccionar un ticket ID valido',
            type: 'warning',
            confirmButtonText: 'Ok!'
        });
        return;
    }
    
    cls()

	if(ticket_id){
        getTicket(ticket_id, (clarification) =>{
            acceptClarification(clarification);
			getATM(clarification.atm , clarification, (clarification, atm) => {
                displayTicketInfo(clarification, atm);
            });
        });
    }
}

/* Search in DB the rejoinder with input value as ID */

function searchRejoinder(clarification_id){

    let ticket_id = document.getElementById('ticketInput').value || String(clarification_id);
    var db = cloudant.db.use(process.env.REJOINDER_DB);
    cls()

	if(ticket_id){

        getTicket(ticket_id, (clarification) => 
			getATM(clarification.atm , clarification, (clarification, atm) => {
				displayTicketInfo(clarification, atm);
        }));
        
        db.get(ticket_id, (err, res) => {
            if(err) alert(err);

            loadRejoinderData(res);
        })
    }
	else{
		alert("Inserta un ID valido");
	}
}

/* Update the solved property of inconsistency and create a new clarification */

function solveInconsistensy(inconsistency){

    var db = cloudant.db.use(process.env.INCONSISTENCY_DB);

    db.find({ selector: { _id:inconsistency._id } }, function(err, result) {
        if (err)  alert(err);
        result.docs[0].solved = true;
        db.insert(result.docs[0])
        let clarificationDB = cloudant.db.use(process.env.CLARIFICATION_DB);
        clarificationDB.insert(inconsistency).then((result, err) => {
            if(err) {
                alert("No se ha podido registrar la corrección!");
                return;
            }
            location.reload();
        })
    })
}

/* Delete a Clarification and update the solved property in inconsistency DB*/

function returnToInconsistency(inconsistency){

    var db = cloudant.db.use(process.env.INCONSISTENCY_DB);

    db.find({ selector: { _id:inconsistency._id } }, function(err, result) {
        if (err)  alert(err);
        result.docs[0].solved = false;
        db.insert(result.docs[0])
    });

    var clarificationDB = cloudant.db.use(process.env.CLARIFICATION_DB);

    clarificationDB.get(inconsistency._id, function(err, result){
        clarificationDB.destroy(result._id, result._rev, function(err, body, header){
            if(err) alert(err);
            else console.log("destruido");
        });
    });
}

/* Get a document that represents a ticket */

function getTicket(ticket_id, callback){

    var clarificationDB = cloudant.db.use(process.env.CLARIFICATION_DB);

    clarificationDB.get(ticket_id, function(err, result){
        if(err) alert(err);
        callback(result);
    });
}

/* Get a document that represents a ticket */

function getATM(atm_id, clarification, callback){

    var bdi_DB = cloudant.db.use(process.env.BDI_DB);

    bdi_DB.get('bdi:bbva', function(err, result){
        if(err) alert(err);
        let atm;
        for(let i = 0; i < result.cajeros.length ; i++){
            if(result.cajeros[i].atm == atm_id){
                atm = result.cajeros[i];
                break;
            }
        }
        if(!atm){
            ATMMissingAlert();
        }
        callback(clarification, atm);
    });
}

function uploadClarification(clarification){
    
    return new Promise((resolve, reject) => {
        let db_clarification = cloudant.db.use(process.env.CLARIFICATION_DB);
        db_clarification.get(clarification._id, (err, res) => {
            if(res){
                clarification['_rev'] = res._rev;
            }
            db_clarification.insert(clarification, clarification._id , (err, res) => {
                if (err){console.log(err); reject(err)};
                resolve(res);
            });
        });
    });
}

function uploadRejoinder(rejoinder){
    
    return new Promise((resolve, reject) => {
        let db_rejoinder = cloudant.db.use(process.env.REJOINDER_DB);
        db_rejoinder.get(rejoinder.ticket, (err, res) => {
            if(res){
                rejoinder['_rev'] = res._rev;
            }
            db_rejoinder.insert(rejoinder, rejoinder.ticket , (err, res) => {
                if (err){console.log(err); reject(err)};
                resolve(res);
            });
        });
    });
}

/* Return an array in which element is the length of each DB */

function getAllRecordDbs(){

    return new Promise((resolve, reject) => {
        var inconsistency_db = cloudant.db.use(process.env.INCONSISTENCY_DB);
        var rejoinder_db = cloudant.db.use(process.env.REJOINDER_DB);
        var clarification_db = cloudant.db.use(process.env.CLARIFICATION_DB);
    
        inconsistency_db.list(function (err, inconsistencies) {
            console.log(err, inconsistencies);
            clarification_db.list(function (err, clarifications) {
                console.log(err, clarifications);
                rejoinder_db.list(function (err, rejoinders) {
                    console.log(err, rejoinders);

                    resolve([clarifications.total_rows, inconsistencies.total_rows, rejoinders.total_rows]);
                });
            }); 
        });
    });
}

/* Get all docs in indicated DB */

function getAllRecords(db_name){
    return new Promise((resolve, rejected) => {
        var target_db = cloudant.db.use(db_name);

        target_db.list({include_docs:true}, (err, data) => {
            if(err) {
                console.log(err);
                return;
            };

            resolve(data.rows);
        });
    });
}

/*  Export functions */
module.exports.loadInconsistencies = loadInconsistencies;
module.exports.solveInconsistensy = solveInconsistensy;
module.exports.returnToInconsistency = returnToInconsistency;

module.exports.getTicket = getTicket;
module.exports.getATM = getATM;

module.exports.searchTicket = searchTicket;
module.exports.loadClarifications = loadClarifications;
module.exports.uploadClarification = uploadClarification;

module.exports.uploadRejoinder = uploadRejoinder;
module.exports.searchRejoinder = searchRejoinder;
module.exports.loadRejoinders = loadRejoinders;

module.exports.getAllRecordDbs = getAllRecordDbs;

module.exports.getAllRecords = getAllRecords;