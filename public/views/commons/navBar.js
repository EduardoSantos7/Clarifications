

function navBar(container_id){
    let container = document.getElementById(container_id)
    container.innerHTML = (
    `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <a class="navbar-brand" href="./homePage.html">
            <img src="https://trimaker.com/wp-content/uploads/2018/01/IBM-Logo.png" width="100" height="40" class="d-inline-block align-top" alt="">
        </a>
          
        <div class="collapse navbar-collapse" id="navbarText">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item active">
                    <a class="nav-link" href="./homePage.html">Home <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="./depurado.html">Depurado</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="./aclaracion.html">Aclaración</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="./replica.html">Réplica</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="./estadisticas.html">Estadísticas</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="./estadisticas.html">Subir</a>
                </li>
            </ul>
            <form class="form-inline m-2">
              <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
              <button class="btn btn-outline-primary my-2 my-sm-0" type="submit">Search</button>
            </form>
        </div>
    </nav>
    `
    )
}