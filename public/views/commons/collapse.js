/* Enable collapse for table dynamics */
require('bootstrap');

/* Constants */
const HEADERS = ["#", 'INICIO', 'FIN', 'HORAS NETAS', 'SEMAFORO', 'ARCHIVO', 'ACCIÓN'];
const FIELDS = ['fecha_inicio', 'fecha_fin', 'horas_netas', 'semaforo', 'archivo'];

class CollapseCardBoard{
  constructor(id, plot_zone_id){
    /* Inicialize */
    this.board = document.createElement("div");
    this.board.id = id;
    this.board.className = 'mt-2';
    this.cards_count = 0;

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
    underline.appendChild(document.createTextNode("INCONSISTENCIAS"));
    title.appendChild(icon);
    title.appendChild(underline);
    
    let subTitle = document.createElement('h6');
    subTitle.appendChild(document.createTextNode(`Los siguientes tickets no pueden 
                                                    ser agregados a la BD de Aclaraciones 
                                                      hasta que se resuelvan los confictos`));
    subTitle.className = 'card-subTitle text-muted m-1 p-1';
    title.appendChild(subTitle);
    
    this.board.appendChild(title);
  }

  insertCard(card){
    this.board.appendChild(card.card);
    this.cards_count++;
  }

  createCard(data){
    let card = new CollapseCard(data, this.cards_count, this.board.id);
    this.insertCard(card);
  }
}


class CollapseCard{
  constructor(data, id_number, parent_id){
    this.title = data.doc._id;
    this.message = data.doc.message
    this.tickets = data.doc.tickets

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
    let table = new CollapseTable(rows);
    this.insertTable(table);
  }
}

class CollapseTable{
  constructor(rows){
    this.table = document.createElement("table");
    this.table.className = 'table table-striped table-responsive table-bordered btn-table mt-2';
    this.header = document.createElement("thead");
    this.body = document.createElement("tbody");
    this.rows = rows;

    this.fill_headers();
    this.fill_body();
    this.table.appendChild(this.header);
    this.table.appendChild(this.body);
  }

  fill_headers(){
    let titleRow = document.createElement('TR');
    for(let i = 0; i < HEADERS.length; i++){
        let header = document.createElement("TH");
        let text = document.createTextNode(HEADERS[i]);
        header.className = 'text-center';
        header.appendChild(text);
        titleRow.appendChild(header);
    }
    this.header.appendChild(titleRow);
  }

  fill_body(){
    for(let i = 0; i < this.rows.length; i++){
        let titleRow = document.createElement('TR');
        let obj = JSON.parse(this.rows[i]);
        titleRow.className = 'text-center';

        let num = document.createElement('td');
        num.appendChild(document.createTextNode(i+1));
        titleRow.appendChild(num);
        for(let j = 0; j < FIELDS.length; j++){
          let element = document.createElement('td');
          element.appendChild(document.createTextNode(obj[FIELDS[j]]));
          titleRow.appendChild(element);
        }

        let accion = document.createElement('td');
        let action = document.createElement('button');
        action.appendChild(document.createTextNode('Agregar'));
        action.className = 'btn btn-outline-primary btn-sm m-0 waves-effect';
        action.setAttribute('onclick', "proc("+ this.rows[i] +")");

        accion.appendChild(action);

        titleRow.appendChild(accion); this.body.appendChild(titleRow);
    }
  }
}

module.exports.CollapseCardBoard = CollapseCardBoard;