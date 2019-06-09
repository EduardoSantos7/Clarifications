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
        this.tarea_remedy = ticket['remedy'] || ticket['tarea_remedy'];
        this.nueva_fecha_inicio = ticket['fecha_inicio'];
        this.nueva_fecha_fin = ticket['nueva_fecha_fin'];
        this.contribuyente = ticket['contribuyente'] || '';
        this.codigo = ticket['codigo'] || '';
        this.tipo = ticket['tipo'];
        this.cierre = '';
        this.aplica = '';
        this.comentario = '';
        this.comentario_aclaracion = ticket['comentario'];
        this.banca = ticket['banca'];
        this.archivo = ticket['archivo'];
        this.ciudad = ticket['ciudad'];
        this.cp = ticket['cp'];
        this.cr = ticket['cr'];
        this.dia_ventana = ticket['dia_ventana'];
        this.dias_idc = ticket['dias_idc'];
        this.direccion = ticket['direccion'];
        this.division = ticket['division'];
        this.estado = ticket['estado'];
        this.falla = ticket['falla'];
        this.fecha_1_ra_instalacion = ticket['fecha_1_ra_instalacion'];
        this.fecha_adquisicion = ticket['fecha_adquisicion']; 
        this.garantia_buc = ticket['garantia_buc'];
        this.grupo = ticket['grupo'];
        this.horas_netas = ticket['horas_netas'];
        this.hrs_idc = ticket['hrs_idc'];
        this.idc = ticket['idc'];
        this.local = ticket['local'];
        this.marca_modelo = ticket['marca_modelo'];
        this.n_s_idc = ticket['n_s_idc'];
        this.nueva_fecha_fin = ticket['nueva_fecha_fin'];
        this.semaforo = ticket['semaforo'];
        this.serie = ticket['serie'];
        this.sitio = ticket['sitio'];
        this.tipo = ticket['tipo'];
        this.tipodeautoservicio = ticket['tipodeautoservicio'];
        if(ticket['replicas']){
            ticket['replicas'].push(ticket['comentario'])
        }
        this.replicas = ticket['replicas'] || []; // Each element in the array is a column in the file
    }

    upload(){

        return uploadRejoinder(this);
    }
}

module.exports.Rejoinder = Rejoinder;