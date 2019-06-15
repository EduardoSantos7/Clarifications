

function footer(container_id){
    let container = document.getElementById(container_id)
    container.innerHTML = (
        `
        <footer class="page-footer font-small mdb-color py-2 bg-dark">
            <!-- Copyright -->
            <div class="footer-copyright text-center py-4 text-white">© 2019 Copyright:
                <span class="">
                    <span class="col">
                        <a href="./creditos.html"> Eduardo Santos & Israel Pérez</a>
                    </span>
            
                    <!-- Add font awesome icons for social contact -->
                    <span class="col">
                        <ul class="social-network social-circle">
                            <li><a href="https://www.instagram.com/eduardosantosd7/" class="icoInstagram" title="Instagram"><i class="fa fa-instagram"></i></a></li>
                            <li><a href="https://www.facebook.com/eduardosantos7" class="icoFacebook" title="Facebook"><i class="fa fa-facebook"></i></a></li>
                            <li><a href="https://twitter.com/EduardoLSantos" class="icoTwitter" title="Twitter"><i class="fa fa-twitter"></i></a></li>
                            <li><a href="https://www.linkedin.com/in/eduardosantosdelgado/" class="icoLinkedin" title="Linkedin"><i class="fa fa-linkedin"></i></a></li>
                            <li><a href="https://github.com/EduardoSantos7" class="icoGithub" title="Github"><i class="fa fa-github"></i></a></li>
                            <li><a href="https://stackoverflow.com/users/8073155/eduardo-luis-santos" class="icoStackOverFlow" title="Github"><i class="fa fa-stack-overflow"></i></a></li>
                            <li><a href="./dbmanager.html" class="icoFacebook" title="DB Manager"><i class="fa fa-database"></i></a></li>
                        </ul>
                    </span>
                </span>
            </div>
        </footer>
        `
    )
}