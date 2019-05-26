/* This script create a TicketInfoTable */

class TicketInfoTable{
    constructor(plot_id, headers, rows){

        /* Validate the length of headers and cell in row */

        if(headers.length == 0 || rows.length == 0){
            console.log("Table cannot be created with empty Headers or empty rows");
            return;
        }

        for(let i = 0; i < rows.length; i++){
            if(headers.length != rows[i].length == 0){
                console.log("Table cannot be created with non equal cells and headers length");
                return;
            }
        }
        
        this.headers = headers;
        this.rows = rows;
        this.table = document.createElement('table');
        this.table.className = 'table table-striped table-responsive table-bordered btn-table mt-2 small';
        this.thead = document.createElement('thead');
        this.tbody = document.createElement('tbody');
        this.table.appendChild(this.thead);
        this.table.appendChild(this.tbody);

        this.fill_headers(); this.fill_rows();

        let plot_area = document.getElementById(plot_id);
        plot_area.innerHTML = ""; // Clean the space in case other table was there
        plot_area.appendChild(this.table)
    }

    fill_headers(){
        let title_row = document.createElement('tr');
        for(let i = 0; i < this.headers.length; i++){
            let th = document.createElement('th');
            th.className = 'text-center small font-weight-bold';
            th.appendChild(document.createTextNode(this.headers[i]))
            title_row.appendChild(th);
        }
        this.thead.appendChild(title_row);
    }

    fill_rows(){
        for(let i = 0; i < this.rows.length; i++){
            let row = document.createElement('tr');
            row.className = 'text-center small';

            let td = document.createElement('td');
            td.appendChild(document.createTextNode(this.rows[i]['_id']))
            row.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode(this.rows[i]['fecha_inicio']))
            row.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode(this.rows[i]['fecha_fin']))
            row.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode(this.rows[i]['dias_idc']))
            row.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode(this.rows[i]['hrs_idc']))
            row.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode(this.rows[i]['dia_ventana']))
            row.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode(this.rows[i]['horas_netas']))
            row.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode(this.rows[i]['atm']))
            row.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode(this.rows[i]['sitio']))
            row.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode(this.rows[i]['estado']))
            row.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode(this.rows[i]['n_s_idc']))
            row.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode("preguntar"))
            row.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode(this.rows[i]['marca_modelo']))
            row.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode(this.rows[i]['remedy']))
            row.appendChild(td);

            // Save the row
            this.tbody.appendChild(row);
        }
    }
}

module.exports.TicketInfoTable = TicketInfoTable;