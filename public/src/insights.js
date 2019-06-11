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
                    label: 'Registros en BDs',
                    data: count[1],
                    backgroundColor: [
                        'rgba(255, 186, 36, 0.7)',
                        'rgba(10, 100, 235, 0.7)',
                        'rgba(255, 10, 10, 0.7)'
                    ]
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
                    }
                }
              });
        });
    });
}

/* Returns an object with dates as key and count as value */

function countByDate(documents){
    return new Promise(resolve => {
        let dates  ={
            '25-01-2019' : 23,
            '26-01-2019' : 33,
            '27-01-2019' : 28,
            '28-01-2019' : 23,
            '29-01-2019' : 33,
            '30-01-2019' : 28,
            '31-01-2019' : 23,
            '32-01-2019' : 33,
            '33-01-2019' : 28,
        };
        console.log(Object.keys(dates), Object.values(dates))
        resolve([Object.keys(dates), Object.values(dates)])
    });
}