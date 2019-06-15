/* This class represents a calculator for make clarifications */

var { rowTime, totalTime } = require('./dateTimeAlgorithms')

class Calculator{

    constructor(plot_id, title, ibm, ticket){

        this.table = document.createElement('table');
        this.table.className = 'table table-striped table-responsive table-bordered btn-table mt-2 small mx-auto text-center';
        this.table.style.width = '435px';
        this.thead = document.createElement('thead');
        this.tbody = document.createElement('tbody');
        this.tfoot = document.createElement('tfoot');
        this.title = title;
        this.ibm = ibm; // Indicates if the calculator is ibm or client calculator
        this.ticket = ticket;
        this.row_count = 5; // Default Value
        this.table.appendChild(this.thead);
        this.table.appendChild(this.tbody);
        this.table.appendChild(this.tfoot);

        this.buildHeaders();
        this.buildRows();
        this.buildFooter();

        let plot_area = document.getElementById(plot_id);
        plot_area.innerHTML = ""; // Clean the space in case other table was there
        plot_area.appendChild(this.table)
    }

    buildHeaders(){

        let title_tr = document.createElement('tr');

        title_tr.appendChild(document.createTextNode(this.title));
        title_tr.className = 'text-center font-weight-bold';

        let subtitle_tr = document.createElement('tr');
        let subtitle_from = document.createElement('th');
        let subtitle_to = document.createElement('th');
        let subtitle_total = document.createElement('th');
        let subtitle_comments = document.createElement('th');

        subtitle_from.appendChild(document.createTextNode('DE'));
        subtitle_to.appendChild(document.createTextNode('A'));
        subtitle_total.appendChild(document.createTextNode('TOTAL'));
        subtitle_comments.appendChild(document.createTextNode('COMENTARIOS'));
        subtitle_tr.appendChild(subtitle_from);
        subtitle_tr.appendChild(subtitle_to);
        subtitle_tr.appendChild(subtitle_total);
        subtitle_tr.appendChild(subtitle_comments);
        
        this.thead.appendChild(title_tr);
        this.thead.appendChild(subtitle_tr);

    }

    addRow(){

        let row = document.createElement('tr');
            
        let input = document.createElement('input');
        input.type = 'time';

        let input2 = document.createElement('input');
        input2.type = 'time';
        let calculator = this;
        input2.onchange = function(){ rowTime(row); totalTime(calculator);}

        let input3 = document.createElement('input');
        input3.type = 'time';
        input3.disabled = 'true';
        input3.className = 'totalTimeRow';

        let area = document.createElement('textarea');

        let cell_from = document.createElement('td');
        cell_from.appendChild(input);

        let cell_to = document.createElement('td');
        cell_to.appendChild(input2);

        let cell_total = document.createElement('td');
        cell_total.appendChild(input3);

        let cell_comments = document.createElement('td');
        cell_comments.appendChild(area);

        row.appendChild(cell_from); row.appendChild(cell_to);
        row.appendChild(cell_total); row.appendChild(cell_comments);
        this.tbody.appendChild(row);
    }

    buildRows(){

        for(let i = 0; i < this.row_count; i++){
            this.addRow();
        }
    }

    buildFooter(){

        let row = document.createElement('tr');
            
        let input = document.createElement('input');
        input.type = 'time';
        input.disabled = 'true';
        input.className = 'totalTimeCalculator';

        let cell_button = document.createElement('td');
        cell_button.className = 'p-2';
        let add_button = document.createElement('i');
        add_button.className = 'fa fa-plus m-2 btn btn-outline-primary my-2 my-sm-0';
        var calculator = this;
        add_button.onclick = function(){ calculator.addRow(); }
        cell_button.appendChild(add_button);

        let label = document.createElement('td');
        label.appendChild(document.createTextNode('Total:'));

        let cell_total = document.createElement('td');
        cell_total.appendChild(input);

        let space = document.createElement('td');

        row.appendChild(cell_button); row.appendChild(label);
        row.appendChild(cell_total); row.appendChild(space);
        this.tfoot.appendChild(row);
    }

    getCalculationComment(){
        
        let comment = 'DE\tA\tTOTAL\tCOMENTARIO\n';
        let rows = this.tbody.children;
        console.log("rows", rows);
        for(let i = 0; i < rows.length; i++){
            let cells = rows[i].children;
            console.log('cells', cells)
            let cells_len = cells.length;
            for(let j = 0; j < cells_len; j++){
                let value = cells[j].firstChild.value;
                comment += value;
                if(j < cells_len - 1){
                    comment += '\t';
                }
                else{
                    comment += '\n';
                }
            }
        }
        return comment;
    }

    setCalculationComment(comment_list){

        let rows = this.tbody.children;

        if(rows.length < comment_list.length){
            let missing_rows = comment_list.length - rows.length;
            for(let i = 0 ; i < missing_rows; i++){
                this.addRow();
            }
        }

        // Read again the amount of rows
        rows = this.tbody.children;

        for(let i = 0; i < comment_list.length; i++){

            let cells = rows[i].children;
            let cells_len = cells.length;
            let values = comment_list[i].split('\t');
            for(let j = 0; j < cells_len; j++){
                cells[j].firstChild.value = values[j];
            }
        }

        // If something was loaded, refresh the output

        if(comment_list.length > 1){
            totalTime(this);
        }
    }
}

module.exports.Calculator = Calculator;