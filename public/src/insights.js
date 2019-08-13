/* This script render the insights */

var Chart = require('chart.js');

/* Import helfer functions for interact with DB service */
var { getAllRecords, getAllRecordDbs  } = require('../src/utils/DBhelperFunctions')
/* Import Python shell for communication*/
var {PythonShell} = require('python-shell');
/* Import path for stablish the python scripts path */
var path = require('path');
const Swal = require('sweetalert2');
const flatpickr = require("flatpickr");


var low_date_range = null;
var high_date_range = null;
var barChart = null;
var myDoughnutChart = null;
var barChartSem = null;
var barChartSem2 = null;
var semState = null;
var semState2 = null;
var myDoughnutChartReasonYellow = null;
var myDoughnutChartReasonRed = null;
var partByState = null;


/* Display all the charts */

function loadCharts(){

    getAllRecords(process.env.CLARIFICATION_DB).then( (documents) => {
        
        let clarification_document_backup = filter_date_range(documents);

        getAllRecords(process.env.BDI_DB_ROW).then( (bdi_docs) => {
            
            getFailuresPerModels(clarification_document_backup, bdi_docs);
            
            getSemaphoresPerState(clarification_document_backup, bdi_docs);
            
            getAcceptedByPartByState(clarification_document_backup, bdi_docs);
        });
        
        getBBVAServiceReport(clarification_document_backup);
        
        
        getSemaphoreWithoutClarifications(clarification_document_backup);
        

        getAcceptedReasons(clarification_document_backup);

    });
    
    getAllRecords(process.env.REJOINDER_DB).then( (documents) => {

        let replication_document_backup = filter_date_range(documents);
        
        getSemaphoreClarifications(replication_document_backup);
    });

    documentsDbs();
}

function create_date_range(){

    let range_selector = document.getElementById('rangeSelector');

    flatpickr(range_selector, {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        maxDate: "today",
        mode: "range",
        time_24hr: true,
        onClose: function(selectedDates) {
            low_date_range = selectedDates[0];
            high_date_range = selectedDates[1];
            loadCharts();
        }
    });
}

function filter_date_range(documents){

    if(!low_date_range || !high_date_range) return documents;

    documents = documents.filter(function(document){
        let start = new Date ( document.doc['fecha_inicio']);
        return start >= low_date_range && start <= high_date_range;
    });
    return documents;
}

function getBBVAServiceReport(documents){

    countByDate(documents).then((count) => {

        var popCanvas = document.getElementById("canvas1").getContext("2d");

        if(barChart){
            barChart.destroy();
        }

        barChart = new Chart(popCanvas, {
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
}

function getFailuresPerModels(documents, bdi_docs){

    countSemaphoresByModels(documents, bdi_docs).then( (result) => {
        var popCanvas = document.getElementById("canvas2");
        var popCanvas = document.getElementById("canvas2").getContext("2d");

        if(myDoughnutChart){
            myDoughnutChart.destroy();
        }

        myDoughnutChart = new Chart(popCanvas, {
            type: 'doughnut',
            data: {
                labels: result['labels'],
                datasets: [{
                    label: 'Registros en BDs',
                    data: result['data'],
                    backgroundColor: getRandomColor(result['data'].length)
                }]
                }
        });
    });
}

function getSemaphoreClarifications(documents){

    countSemaphoresByDate(documents).then((result) => {

        var popCanvas = document.getElementById("canvas3").getContext("2d");

        if(barChartSem){
            barChartSem.destroy()
        }
        
        barChartSem = new Chart(popCanvas, {
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
}

function getSemaphoreWithoutClarifications(documents){

    countSemaphoresByDate(documents).then((result) => {
        var popCanvas = document.getElementById("canvas4");
        var popCanvas = document.getElementById("canvas4").getContext("2d");

        if(barChartSem2){
            barChartSem2.destroy();
        }
        
        barChartSem2 = new Chart(popCanvas, {
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
}

function getSemaphoresPerState(documents, bdi_docs){

    countSemaphoresByState(documents, bdi_docs).then( (result) => {
        var popCanvas = document.getElementById("canvas5").getContext("2d");
        var popCanvas2 = document.getElementById("canvas6").getContext("2d");
        
        if(semState){
            semState.destroy();
        }

        if(semState2){
            semState2.destroy();
        }
        
        semState = new Chart(popCanvas, {
            type: 'horizontalBar',
            data: {
                labels: result['labels'],
                datasets: [{
                    label: result['labels'],
                    data: result['yellow'],
                    backgroundColor: getRandomColor(result['yellow'].length)
                }]
                },
            options: {
                scales: {
                    xAxes: [{
                        ticks: {
                            min: 0 // Edit the value according to what you need
                        }
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                }
            }
        });
        semState2 = new Chart(popCanvas2, {
            type: 'horizontalBar',
            data: {
                labels: result['labels'],
                datasets: [{
                    label: result['labels'],
                    data: result['red'],
                    backgroundColor: getRandomColor(result['red'].length)
                }]
                },
            options: {
                scales: {
                    xAxes: [{
                        ticks: {
                            min: 0 // Edit the value according to what you need
                        }
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                }
            }
        });
    });    

}

function countSemaphoresByModels(documents, bdi_docs){
    return new Promise(resolve => {
        
        let models  ={};
        
        for(let i = 0; i < documents.length; i++){
            let data = bdi_docs.find((atm) => {
                if(atm.doc._id === documents[i].doc.atm)  return (atm) }
            );
            
            if(!data) continue;
            
            let model = data.doc.modelo
            
            if(models[model]){
                models[model]++;
            }
            else{
                models[model] = 1;
            }
        }
        models = orderObject(models);
        console.log(models);
        let result = {
            'labels': Object.keys(models),
            'data': Object.values(models)
        }
        resolve(result)
    });
}

/* Returns an object with dates as key and count as value */

function countByDate(documents){
    return new Promise(resolve => {
        
        let dates  ={};
        
        for(let i = 0; i < documents.length; i++){
            // Skip elements without start date (index)
            if(!documents[i].doc['fecha_inicio']) continue;
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
            // Skip elements without start date (index)
            if(!documents[i].doc['fecha_inicio']) continue;
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

function countSemaphoresByState(documents, bdi_docs){
    return new Promise(resolve => {
        
        let doc  ={};
        let not_count = [];
        let red = [];
        let yellow = [];
        let green = [];
        let open = [];
        
        for(let i = 0; i < documents.length; i++){
            let data = bdi_docs.find((atm) => {
                if(atm.doc._id === documents[i].doc.atm)  return (atm) }
            );
            
            if(!data) continue;

            let state = data.doc.estado;

            if(doc[state]){

                let semaphore = documents[i].doc['semaforo'].toLowerCase();
                if(semaphore.includes('no cuenta')){
                    doc[state][0]++;
                }
                else if(semaphore.includes('rojo')){
                    doc[state][1]++;
                }
                else if(semaphore.includes('amarillo')){
                    doc[state][2]++;
                }
                else if(semaphore.includes('verde')){
                    doc[state][3]++;
                }
                else if(semaphore.includes('abierto')){
                    doc[state][4]++;
                }
            }
            else{
                doc[state] = [0,0,0,0,0];

                let semaphore = documents[i].doc['semaforo'].toLowerCase();
                if(semaphore.includes('no cuenta')){
                    doc[state][0]++;
                }
                else if(semaphore.includes('rojo')){
                    doc[state][1]++;
                }
                else if(semaphore.includes('amarillo')){
                    doc[state][2]++;
                }
                else if(semaphore.includes('verde')){
                    doc[state][3]++;
                }
                else if(semaphore.includes('abierto')){
                    doc[state][4]++;
                }
            }
        }
        doc = orderObject(doc);
        let keys = Object.keys(doc);
        for(let i = 0; i < keys.length; i++){
            not_count.push(doc[keys[i]][0]);
            red.push(doc[keys[i]][1]);
            yellow.push(doc[keys[i]][2]);
            green.push(doc[keys[i]][3]);
            open.push(doc[keys[i]][4]);
        }
        let result = {
            'labels': Object.keys(doc),
            'not_count': not_count,
            'red': red,
            'yellow': yellow,
            'green': green,
            'open': open
        }
        resolve(result)
    });
}

function getAcceptedReasons(documents){

    countSemaphoresByAcceptedReason(documents).then( (result) => {
        var popCanvas = document.getElementById("canvas7");
        var popCanvas = document.getElementById("canvas7").getContext("2d");
        var popCanvas2 = document.getElementById("canvas8");
        var popCanvas2 = document.getElementById("canvas8").getContext("2d");

        if(myDoughnutChartReasonYellow){
            myDoughnutChartReasonYellow.destroy();
        }
        if(myDoughnutChartReasonRed){
            myDoughnutChartReasonRed.destroy();
        }

        myDoughnutChartReasonYellow = new Chart(popCanvas, {
            type: 'doughnut',
            data: {
                labels: result['labels'],
                datasets: [{
                    label: 'Registros en BDs',
                    data: result['yellow'],
                    backgroundColor: getRandomColor(result['yellow'].length)
                }]
            }
        });
        myDoughnutChartReasonRed = new Chart(popCanvas2, {
            type: 'doughnut',
            data: {
                labels: result['labels'],
                datasets: [{
                    label: 'Registros en BDs',
                    data: result['red'],
                    backgroundColor: getRandomColor(result['red'].length)
                }]
            }
        });
    });
}
function getAcceptedByPartByState(documents, bdi_docs){

    countAcceptedByPartByState(documents, bdi_docs).then( (result) => {
        var popCanvas = document.getElementById("canvas9");
        var popCanvas = document.getElementById("canvas9").getContext("2d");
        
        if(partByState){
            partByState.destroy();
        }
        
        partByState = new Chart(popCanvas, {
            type: 'horizontalBar',
            data: {
                labels: result['labels'],
                datasets: [{
                    label: result['labels'],
                    data: result['data'],
                    backgroundColor: getRandomColor(result['data'].length)
                }]
                },
            options: {
                scales: {
                    xAxes: [{
                        ticks: {
                            min: 0 // Edit the value according to what you need
                        }
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                }
            }
        });
    }); 
}

function documentsDbs(){
    
    var popCanvas = document.getElementById("canvas10").getContext("2d");

    getAllRecordDbs().then((lengths) => {
        
        var barChart = new Chart(popCanvas, {
            type: 'bar',
            data: {
              labels: ["Aclaraciones", "Inconsistencias", "Replicas"],
              datasets: [{
                label: 'Registros en BDs',
                data: lengths,
                backgroundColor: [
                    'rgba(255, 186, 36, 0.7)',
                    'rgba(10, 100, 235, 0.7)',
                    'rgba(255, 10, 10, 0.7)'
                ]
              }]
            }
          });
    });
    
}

function countSemaphoresByAcceptedReason(documents){

    return new Promise(resolve => {
        
        let doc  ={};
        let red = [];
        let yellow = [];
        
        for(let i = 0; i < documents.length; i++){
            accepted_by = documents[i].doc['accepted_by'];
            if(doc[accepted_by]){

                let semaphore = documents[i].doc['semaforo'].toLowerCase();
                
                if(semaphore.includes('rojo')){
                    doc[accepted_by][0]++;
                }
                else if(semaphore.includes('amarillo')){
                    doc[accepted_by][1]++;
                }
            }
            else{
                doc[accepted_by] = [0,0];

                // Skip elements without semaphore (index)
                if(!documents[i].doc['semaforo']) continue;
                let semaphore = documents[i].doc['semaforo'].toLowerCase();
                
                if(semaphore.includes('rojo')){
                    doc[accepted_by][0]++;
                }
                else if(semaphore.includes('amarillo')){
                    doc[accepted_by][1]++;
                }
            }
        }
        doc = orderObject(doc);
        let keys = Object.keys(doc);
        for(let i = 0; i < keys.length; i++){
            red.push(doc[keys[i]][0]);
            yellow.push(doc[keys[i]][1]);
        }
        let result = {
            'labels': Object.keys(doc),
            'red': red,
            'yellow': yellow
        }
        console.log(result)
        resolve(result)
    });
}


function countAcceptedByPartByState(documents, bdi_docs){
    return new Promise(resolve => {
        
        // Filter doc including yellow and red semaphores and accepted by part
        documents = documents.filter((document) => {
            if(document.doc['semaforo'] && document.doc['accepted_by']){
                return ['amarillo', 'rojo'].includes(document.doc['semaforo'].toLowerCase()) && 
                    document.doc['accepted_by'].toLowerCase().includes('parte');
            }
        });

        let doc = {};
        
        for(let i = 0; i < documents.length; i++){
            let state = bdi_docs.find((atm) => {
                if(atm.doc._id === documents[i].doc.atm)  return (atm) }
            ).doc.estado
                
            if(doc[state]){
                doc[state]++;
            }
            else{
                doc[state] = 1;
            }
        }
        doc = orderObject(doc);
        let result = {
            'labels': Object.keys(doc),
            'data': Object.values(doc)
        }
        console.log(result)
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
    if(!data_list.length) return;
    let sum = data_list.reduce((previous, current) => current += previous);
    let avg = sum / data_list.length;
    return Array(data_list.length).fill(avg)
}