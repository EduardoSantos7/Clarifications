/* Helper functions for process releated to time and dates */

var { add, sub, str } = require('timelite/time');
var { normalize } = require('timelite/date');

console.log(str([10, 2,0]))
/**
 * Calculate the time for a row
 * 
 * @param {HTMLElement} row A row inside the calculator object
 */
function rowTime(row){

    let times = row.getElementsByTagName('input');
    let start_time = (times[0].value);
    let end_time = (times[1].value);
    let result_time = times[2];
    result_time.value = str(sub([end_time, start_time]));
}

/**
 * Calculate the total time: sum of each cell in total row
 * 
 * @param {Object} calculator Calculator Object
 */
function totalTime(calculator){

    let inputs = calculator.tbody.getElementsByClassName('totalTimeRow');
    let total = calculator.tfoot.getElementsByClassName('totalTimeCalculator');
    let time_acum = [];

    for(let i = 0; i < inputs.length; i++){
        let time = inputs[i].value;
        if(time) time_acum.push(time);
    }
    time_acum = add(time_acum);
    total[0].value = str(time_acum);
    if(calculator.ibm){
        let nuevas_horas_netas = document.getElementById('nuevasHorasNetas');
        nuevas_horas_netas.value = total[0].value;
        newEndDate(calculator.ticket, time_acum);
    }
    else{
        let ajuste_tiempo = document.getElementById('ajusteTiempo');
        ajuste_tiempo.value = total[0].value;
    }

}

/**
 * Calcualte the new end date based in a quantity of hours to move between a window time
 * 
 * @param {Object} ticket Info about the ticket
 */
function newEndDate(ticket, total_hours){

    let window = createWindow(ticket.dias_idc, ticket.hrs_idc);
    let start_date = new Date(ticket.fecha_inicio);
    let final_date = new Date(start_date);

    // If the day is not in window move to the 
    // start of the next day in window
    if(!isDayInWindow(start_date.getDay(), window)){
        final_date = moveNextDay(start_date, window);
    }

    while(summAll(total_hours) > 0){

        // At this point the new date is in window
        // So, create ranges and decrease hours
        var [start_range, end_range] = createRanges(final_date, window);
    
        // If the new date is out of the start range move to the start of the day
        if( final_date < start_range){
            final_date = new Date(start_range);
        }
        // If out of the end range move to the next day start
        if( final_date >= end_range){
            final_date = moveNextDay(final_date, window);
        }
        console.log("total:", total_hours, "start range:", start_range, "end r", end_range, "final", final_date)
        // If is inside the range take the hours between the current date
        // and the end of the range, if this amount is bigger that the hours
        // missing for add then add it and bustract if not only add.
        if(start_range <= final_date && final_date < end_range){
            let hours_range = [end_range.getHours(), end_range.getMinutes()];
            let hours_left = [final_date.getHours(), final_date.getMinutes()];
            let time_left = str(sub([str(hours_range), str(hours_left)]));
            let total_hours_str = str(total_hours);
            
            if(time_left < total_hours_str){
                final_date = moveNextDay(final_date, window);
                total_hours = sub([str(total_hours), time_left]);
            }
            else{
                console.log(final_date)
                final_date.setHours(final_date.getHours() + total_hours[0]);
                final_date.setMinutes(final_date.getMinutes() + total_hours[1]);
                total_hours = [0,0,0] // Finish
                console.log("alert", time_left ,total_hours)
            }
        }
    }
    // Write the new date in the screen
    console.log(final_date)
    document.getElementById('resultDatetime').value = getFormatDate(final_date);
}

/**
 * Receives the day and hours and create and array indicating the window
 * 
 * @param {String} window_days Contains day ranges divided by '/'
 * @param {String} window_hours Contains hours ranges divided by '/'
 */
function createWindow(window_days , window_hours){

    if (!window_days || !window_hours) return [];

    let window = [];
    let ordered_days = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];

    // Divide the different day ranges and erase spaces.
    let day_ranges = window_days.split('/');
    day_ranges.map((day_range, index) => {day_ranges[index] = day_range.toUpperCase().trim()});

    // Divide the different hours ranges and erase spaces.
    let hour_ranges = window_hours.split('/');
    hour_ranges.map((hour_range, index) => {hour_ranges[index] = hour_range.trim()});

    day_ranges.forEach((day_range, index) => {
        var [start_day, end_day] = day_range.split(' A ');
        var [start_hour, end_hour] = hour_ranges[index].split(' A ');

        // In case the range only apply to a single day avoid undefined.
        end_day = end_day || start_day;

        let start_day_index = ordered_days.indexOf(start_day);
        let end_day_index = (start_day != end_day) ? ( ordered_days.indexOf(end_day) || 7)+1 : start_day_index+1 ;

        for(let i = start_day_index; i < end_day_index; i++){
            if (i != 7)
                window[i] = [start_hour, end_hour];
            else
                window[0] = [start_hour, end_hour];
        }
    });
    
    return window;
}

/**
 * Evaluate if a index day is the window 
 * 
 * @param {Number} day day to be evaluted
 * @param {Array} window used for evaluated the day
 */
function isDayInWindow(day, window){
    
    if (window && day < window.length && window[day]) return true;

    return false;
}

/**
 * Moves a start date to the start of the next valid window day
 * 
 * @param {Date} start_date Start point 
 * @param {Array} window Use for find the next day
 */
function moveNextDay(start_date, window){

    let moved_date = start_date;
    let current_day = start_date.getDay();
    let next_day_index = getNextDayIndex(current_day, window);

    // Move
    let qty_days = next_day_index - current_day;
    let move_days = (qty_days > 0) ? qty_days : 7 + qty_days
    
    moved_date.setDate(moved_date.getDate() + move_days);
    
    let start_hours = add([window[next_day_index][0], '00:00:00']);
    moved_date.setHours(start_hours[0]);
    moved_date.setMinutes(start_hours[1]);
    
    return moved_date;
}

/**
 * Return the index of the next valid day in window
 * 
 * @param {Number} current_day Index of the day in windows array
 * @param {Array} window Contains and array for each valid day
 */
function getNextDayIndex(current_day, window){

    for(let i = 0; i < window.length;i++){
        // If the days is after each day in window
        // return the first not null element in window
        if( window[i] && current_day >= window.length){
            return i
        }
        else if(window[i] && i > current_day){
            return i
        }
    }
}

function createRanges(date, window){

    let current_day = date.getDay();
    let start_range = new Date(date); 
    let end_range = new Date(date);

    let start_hours = add([window[current_day][0], '00:00:00']);
    let end_hours = add([window[current_day][1], '00:00:00']);
    
    start_range.setHours(start_hours[0]);
    start_range.setMinutes(start_hours[1]);

    end_range.setHours(end_hours[0]);
    end_range.setMinutes(end_hours[1]); 

    return [start_range, end_range];
}

/**
 * Sum all the elements in the array
 * 
 * @param {Array} array 
 */
function summAll(array){
    return array.reduce((total, num) => {return total + num});
}

function getFormatDate(date){
    let year = String(date.getFullYear());
    let month = (date.getMonth()+1 < 10) ? '0' + String(date.getMonth()+1) : String(date.getMonth()+1);
    let day = (date.getDate() < 10) ? '0' + String(date.getDate()) : String(date.getDate());
    let hours = (date.getHours() < 10) ? '0' + String(date.getHours()) : String(date.getHours());
    let minutes = (date.getMinutes() < 10) ? '0' + String(date.getMinutes()) : String(date.getMinutes());

    return year+'-'+month+'-'+day+'T'+hours+':'+minutes

}

function getLocalDate(value){
    const offset = new Date().getTimezoneOffset() * 1000 * 60
    const offsetDate = new Date(new Date(value).valueOf() - 2*offset);
    const date = new Date(offsetDate).toISOString()
    return date.substring(0, 16)
}

module.exports.rowTime = rowTime;
module.exports.totalTime = totalTime;
module.exports.newEndDate = newEndDate;
module.exports.createWindow = createWindow;
module.exports.isDayInWindow = isDayInWindow;