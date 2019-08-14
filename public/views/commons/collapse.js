/* Enable collapse for table dynamics */
require('bootstrap');

/* Constants */
const HEADERS = ["#", 'INICIO', 'FIN', 'HORAS NETAS', 'SEMAFORO', 'ARCHIVO', 'ACCIÓN'];
const FIELDS = ['fecha_inicio', 'fecha_fin', 'horas_netas', 'semaforo', 'archivo'];

class CollapseCardBoard{
  constructor(id, plot_zone_id, options){
    /* Inicialize */
    this.board = document.createElement("div");
    this.board.id = id;
    this.board.className = 'mt-2';
    this.cards_count = 0;
    this.options = options;
    this.addTitle();

    /* Insert */
    document.getElementById(plot_zone_id).appendChild(this.board);
  }

  addTitle(){
    let title = document.createElement('h5');
    title.className = 'card';
    let icon = document.createElement('i');
    icon.className = "fa fa-warning mr-1 m-2";
    let underline = document.createElement('u');
    underline.appendChild(document.createTextNode(this.options['title']));
    title.appendChild(icon);
    title.appendChild(underline);
    
    let subTitle = document.createElement('h6');
    subTitle.appendChild(document.createTextNode(this.options['mainMenssage']));
    subTitle.className = 'card-subTitle text-muted m-1 p-1';
    title.appendChild(subTitle);
    
    this.board.appendChild(title);
  }

  insertCard(card){
    this.board.appendChild(card.card);
    this.cards_count++;
  }

  createCard(data){
    let card = new CollapseCard(data, this.cards_count, this.board.id, this.options);
    this.insertCard(card);
  }
}


class CollapseCard{
  constructor(data, id_number, parent_id, options){
    this.title = data._id || data.doc._id;
    this.message = data.message || "Revisar"
    this.options = options;
    this.tickets = data.tickets || data

    this.card = document.createElement('div');
    this.card.className = 'card';

    this.cardHeader = document.createElement('div');
    this.cardHeader.id = 'heading' + id_number;
    this.cardHeader.className = 'card-header';

    this.header = document.createElement('h5');
    this.header.className = 'mb-0';

    this.headerButton = document.createElement('button');
    this.headerButton.className = 'btn btn-link';
    this.headerButton.setAttribute('data-toggle', "collapse");
    this.headerButton.setAttribute('data-target', "#collapse" + id_number);
    this.headerButton.setAttribute('aria-expanded', (id_number == 0)? true : false);
    this.headerButton.setAttribute('aria-controls', "collapse" + id_number);
    this.headerButton.appendChild(document.createTextNode(this.title));

    this.body = document.createElement('div');
    this.body.id = "collapse" + id_number;
    this.body.className = 'collapse ' + ((id_number == 0)? 'show' : '');
    this.body.setAttribute('aria-labelledby', 'heading' + id_number);
    this.body.setAttribute('data-parent', '#' + parent_id);
    
    this.cardBody = document.createElement('div');
    this.cardBody.id = 'carBody' + id_number;
    this.cardBody.className = 'card-body';
    this.addSubTitle();
    this.createTable(this.tickets);

    this.header.appendChild(this.headerButton);
    this.cardHeader.appendChild(this.header);
    this.card.appendChild(this.cardHeader);
    this.body.appendChild(this.cardBody)
    this.card.appendChild(this.body);
  }

  addSubTitle(){
    let subTitle = document.createElement('h6');
    let icon = document.createElement('i');
    icon.className = "fa fa-warning mr-1";
    let underline = document.createElement('u');
    underline.appendChild(document.createTextNode(this.message));
    subTitle.className = 'card-subtitle';
    subTitle.appendChild(icon);
    subTitle.appendChild(underline);
    this.cardBody.appendChild(subTitle);
  }

  insertTable(table){
    this.cardBody.appendChild(table.table);
  }

  createTable(rows){
    let table = new CollapseTable(rows, this.options);
    this.insertTable(table);
  }
}

class CollapseTable{
  constructor(rows, options){
    this.table = document.createElement("table");
    this.table.className = 'table table-striped table-responsive table-bordered btn-table mt-2';
    this.header = document.createElement("thead");
    this.body = document.createElement("tbody");
    this.options = options;
    this.rows = rows;

    this.fill_headers();
    this.fill_body();
    this.table.appendChild(this.header);
    this.table.appendChild(this.body);
  }

  fill_headers(){
    let titleRow = document.createElement('TR');
    for(let i = 0; i < this.options['headers'].length; i++){
        let header = document.createElement("TH");
        let text = document.createTextNode(this.options['headers'][i]);
        header.className = 'text-center';
        header.appendChild(text);
        titleRow.appendChild(header);
    }
    this.header.appendChild(titleRow);
  }

  fill_body(){
    let len = this.rows.length || 1 
    console.log(len)
    for(let i = 0; i < len; i++){
        let titleRow = document.createElement('TR');
        console.log("rows:", this.rows)
        let obj = (len  == 1) ? this.rows.doc || this.rows : JSON.parse(this.rows[i]);
        titleRow.className = 'text-center';

        let num = document.createElement('td');
        num.appendChild(document.createTextNode(i+1));
        titleRow.appendChild(num);
        for(let j = 0; j < this.options['fields'].length; j++){
          let element = document.createElement('td');
          element.appendChild(document.createTextNode(obj[this.options['fields'][j]]));
          titleRow.appendChild(element);
        }

        let accion = document.createElement('td');
        let action = document.createElement('button');
        action.appendChild(document.createTextNode(this.options['actionButtonText']));
        action.className = 'btn btn-outline-primary btn-sm m-0 waves-effect';

        if(this.options['type'] === 'inconsistency'){
          action.setAttribute('onclick', "solveInconsistensy("+ this.rows[i] +")");
        }
        else if(this.options['type'] === 'clarification'){
          console.log("asigne aqui", obj)
          action.setAttribute('onclick', "searchTicket("+ obj._id +")");
        }
        else if(this.options['type'] === 'rejoinder'){
          console.log("asigne aqui", obj)
          action.setAttribute('onclick', "searchRejoinder("+ obj._id +")");
          let action2 = document.createElement('button');
          action2.appendChild(document.createTextNode(this.options['rejoinderButtonText']));
          action2.className = 'btn btn-outline-primary btn-sm m-0 waves-effect m-2';
          action2.setAttribute('onclick', "prepareExport("+ obj._id +")");
          accion.appendChild(action2);
          // Action 3
          let action3 = document.createElement('button');
          action3.appendChild(document.createTextNode(this.options['rejoinderButtonText2']));
          action3.className = 'btn btn-outline-primary btn-sm m-0 waves-effect m-2';
          action3.setAttribute('onclick', "closeRejoinderAlert("+ obj._id +")");
          accion.appendChild(action3);
        }

        accion.appendChild(action);

        titleRow.appendChild(accion); this.body.appendChild(titleRow);
    }
  }
}

module.exports.CollapseCardBoard = CollapseCardBoard;