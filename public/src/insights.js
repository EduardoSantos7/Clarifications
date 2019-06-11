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
                    type: 'line'
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