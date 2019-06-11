/* This script render the insights */

var Chart = require('chart.js');

/* Import helfer functions for interact with DB service */
var { getAllRecords  } = require('../src/utils/DBhelperFunctions')
/* Import Python shell for communication*/
var {PythonShell} = require('python-shell');
/* Import path for stablish the python scripts path */
var path = require('path');
const Swal = require('sweetalert2')

/* Display all the charts */

function loadCharts(){
    
    getBBVAServiceReport();

    getSemaphoreClarifications();

    getSemaphoreWithoutClarifications();
}

function getBBVAServiceReport(){

    getAllRecords(process.env.CLARIFICATION_DB).then( (documents) => {
        countByDate(documents).then((count) => {
            var popCanvas = document.getElementById("canvas1");
            var popCanvas = document.getElementById("canvas1").getContext("2d");

            var barChart = new Chart(popCanvas, {
                type: 'bar',
                data: {
                  labels: count[0],
                  datasets: [{
                    label: 'Promedio',
                    data: getAverageList(count[1]),
                    fill: false,
                    borderColor: 'red',
                    type: 'line',
                  },{
                    label: 'Registros en BDs',
                    data: count[1],
                    backgroundColor: getRandomColor(count[1].length)
                  }]
                },
                options : {
                    scales: {
                        yAxes: [{
                            display: true,
                            ticks: {
                                suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                                // OR //
                                beginAtZero: true   // minimum value will be 0.
                            }
                        }]
                    },
                },
                
              });
        });
    });
}

function getSemaphoreClarifications(){

    getAllRecords(process.env.REJOINDER_DB).then( (documents) => {
        countSemaphoresByDate(documents).then((result) => {
            var popCanvas = document.getElementById("canvas3");
            var popCanvas = document.getElementById("canvas3").getContext("2d");

            var barChart = new Chart(popCanvas, {
                type: 'bar',
                data: {
                  labels: result['labels'],
                  datasets: [
                    {
                      label: 'No cuenta',
                      data: result['not_count'],
                      backgroundColor: 'lightgrey'
                    },
                    {
                      label: 'Rojo',
                      data: result['red'],
                      backgroundColor: 'rgba(255, 10, 10, 0.7)'
                    },
                    {
                      label: 'Amarillo',
                      data: result['yellow'],
                      backgroundColor: 'rgba(255, 186, 36, 0.7)'
                    },
                    {
                        label: 'Verde',
                        data: result['green'],
                        backgroundColor: 'lightgreen'
                    },
                    {
                        label: 'Abierto',
                        data: result['open'],
                        backgroundColor: 'pink'
                    }
                  ]
                },
                options : {
                    scales: {
                        xAxes: [{ stacked: true }],
                        yAxes: [{
                            stacked: true,
                            display: true,
                            ticks: {
                                suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                                // OR //
                                beginAtZero: true   // minimum value will be 0.
                            }
                        }]
                    },
                },
                
              });
        });
    });
}

function getSemaphoreWithoutClarifications(){
    
    getAllRecords(process.env.CLARIFICATION_DB).then( (documents) => {
        countSemaphoresByDate(documents).then((result) => {
            var popCanvas = document.getElementById("canvas4");
            var popCanvas = document.getElementById("canvas4").getContext("2d");

            var barChart = new Chart(popCanvas, {
                type: 'bar',
                data: {
                  labels: result['labels'],
                  datasets: [
                    {
                      label: 'No cuenta',
                      data: result['not_count'],
                      backgroundColor: 'lightgrey'
                    },
                    {
                      label: 'Rojo',
                      data: result['red'],
                      backgroundColor: 'rgba(255, 10, 10, 0.7)'
                    },
                    {
                      label: 'Amarillo',
                      data: result['yellow'],
                      backgroundColor: 'rgba(255, 186, 36, 0.7)'
                    },
                    {
                        label: 'Verde',
                        data: result['green'],
                        backgroundColor: 'lightgreen'
                      }
                  ]
                },
                options : {
                    scales: {
                        xAxes: [{ stacked: true }],
                        yAxes: [{
                            stacked: true,
                            display: true,
                            ticks: {
                                suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                                // OR //
                                beginAtZero: true   // minimum value will be 0.
                            }
                        }]
                    },
                },
                
              });
        });
    });
}

/* Returns an object with dates as key and count as value */

function countByDate(documents){
    return new Promise(resolve => {
        
        let dates  ={};
        
        for(let i = 0; i < documents.length; i++){
            console.log(documents[i])
            start_date = documents[i].doc['fecha_inicio'].substring(0,10);
            if(dates[start_date]){
                dates[start_date] += 1;
            }
            else{
                dates[start_date] = 1;
            }
        }
        dates = orderObject(dates)
        console.log(Object.keys(dates), Object.values(dates))
        resolve([Object.keys(dates), Object.values(dates)])
    });
}

/* Returns an object with dates as key and array for each semaphore with correspond value per day
    [no cuenta, rojo, amarillo, verde, abierto]
*/

function countSemaphoresByDate(documents){
    return new Promise(resolve => {
        
        let dates  ={};
        let not_count = [];
        let red = [];
        let yellow = [];
        let green = [];
        let open = [];
        
        for(let i = 0; i < documents.length; i++){
            start_date = documents[i].doc['fecha_inicio'].substring(0,10);
            if(dates[start_date]){

                let semaphore = documents[i].doc['semaforo'].toLowerCase();
                if(semaphore.includes('no cuenta')){
                    dates[start_date][0]++;
                }
                else if(semaphore.includes('rojo')){
                    dates[start_date][1]++;
                }
                else if(semaphore.includes('amarillo')){
                    dates[start_date][2]++;
                }
                else if(semaphore.includes('verde')){
                    dates[start_date][3]++;
                }
                else if(semaphore.includes('abierto')){
                    dates[start_date][4]++;
                }
            }
            else{
                dates[start_date] = [0,0,0,0,0];

                let semaphore = documents[i].doc['semaforo'].toLowerCase();
                if(semaphore.includes('no cuenta')){
                    dates[start_date][0]++;
                }
                else if(semaphore.includes('rojo')){
                    dates[start_date][1]++;
                }
                else if(semaphore.includes('amarillo')){
                    dates[start_date][2]++;
                }
                else if(semaphore.includes('verde')){
                    dates[start_date][3]++;
                }
                else if(semaphore.includes('abierto')){
                    dates[start_date][4]++;
                }
            }
        }
        dates = orderObject(dates);
        let keys = Object.keys(dates);
        for(let i = 0; i < keys.length; i++){
            not_count.push(dates[keys[i]][0]);
            red.push(dates[keys[i]][1]);
            yellow.push(dates[keys[i]][2]);
            green.push(dates[keys[i]][3]);
            open.push(dates[keys[i]][4]);
        }
        let result = {
            'labels': Object.keys(dates),
            'not_count': not_count,
            'red': red,
            'yellow': yellow,
            'green': green,
            'open': open
        }
        resolve(result)
    });
}

function orderObject(unordered){

    const ordered = {};
    Object.keys(unordered).sort().forEach(function(key) {
        ordered[key] = unordered[key];
    });
    return ordered
}

function getRandomColor(n) {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    var colors = [];
    for(var j = 0; j < n; j++){
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        colors.push(color);
        console.log(colors);
        color = '#';
    }
    return colors;
}

/* Return a list with the average of the input */

function getAverageList(data_list){
    let sum = data_list.reduce((previous, current) => current += previous);
    let avg = sum / data_list.length;
    return Array(data_list.length).fill(avg)
}