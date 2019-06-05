/* This script implement the functions for interact with DB service */

/* import configuration of enviroment */
require('dotenv').config();
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
        let board = new CollapseCardBoard('collapseCardsContainer', 'content')
        for(let i = 0; i < data.docs.length; i++){
            board.createCard(data.docs[i]);
        }
    });
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
        callback(clarification, atm);
    });
}

/*  Export functions */
module.exports.loadInconsistencies = loadInconsistencies;
module.exports.solveInconsistensy = solveInconsistensy;
module.exports.returnToInconsistency = returnToInconsistency;

module.exports.getTicket = getTicket;
module.exports.getATM = getATM;