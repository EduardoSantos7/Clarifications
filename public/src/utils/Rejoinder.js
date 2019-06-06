/* This class represent a Rejoinder*/

var { uploadRejoinder } = require('./DBhelperFunctions')

class Rejoinder{
    constructor(ticket){
        this.ticket = ticket['_id'];
        this.atm = ticket['atm'];
        this.sitio = ticket['sitio'];
        this.fecha_inicio = ticket['fecha_inicio'];
        this.fecha_fin = ticket['fecha_fin'];
        this.falla = ticket['falla'];
        this.tarea_remedy = ticket['remedy'];
        this.nueva_fecha_inicio = ticket['fecha_inicio'];
        this.nueva_fecha_fin = ticket['nueva_fecha_fin'];
        this.contribuyente = ticket['contribuyente'] || '';
        this.codigo = ticket['codigo'] || '';
        this.tipo = ticket['tipo'];
        this.cierre = '';
        this.aplica = '';
        this.comentario = ticket['comentario'];
        this.comentario_aclaración = '';
        this.replicas = []; // Each element in the array is a column in the file
    }

    upload(){

        return uploadRejoinder(this);
    }
}

module.exports.Rejoinder = Rejoinder;