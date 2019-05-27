/* Helper functions for process releated to time and dates */

var { add, sub, str } = require('timelite/time');
var { normalize } = require('timelite/date');

/* Calculate the time for a row */

function rowTime(row){

    let times = row.getElementsByTagName('input');
    let start_time = (times[0].value);
    let end_time = (times[1].value);
    let result_time = times[2];
    result_time.value = str(sub([end_time, start_time]))
}

/*  Calculate the total time: sum of each cell in total row */
function totalTime(calculator){

    let inputs = calculator.tbody.getElementsByClassName('totalTimeRow');
    let total = calculator.tfoot.getElementsByClassName('totalTimeCalculator');
    let time_acum = [];

    for(let i = 0; i < inputs.length; i++){
        let time = inputs[i].value;
        if(time) time_acum.push(time);
    }
    total[0].value = str(add(time_acum));
    if(calculator.ibm){
        let nuevas_horas_netas = document.getElementById('nuevasHorasNetas');
        nuevas_horas_netas.value = total[0].value;
    }
    else{
        let ajuste_tiempo = document.getElementById('ajusteTiempo');
        ajuste_tiempo.value = total[0].value;
    }

}

module.exports.rowTime = rowTime;
module.exports.totalTime = totalTime;