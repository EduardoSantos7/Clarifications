

function footer(container_id){
    let container = document.getElementById(container_id)
    container.innerHTML = (
        `
        <footer class="page-footer font-small mdb-color py-2 bg-dark">
            <!-- Copyright -->
            <div class="footer-copyright text-center py-4 text-white">© 2019 Copyright:
                <span class="">
                    <span class="col">
                        <a href="https://mdbootstrap.com/education/bootstrap/"> Eduardo Santos</a>
                    </span>
            
                    <!-- Add font awesome icons for social contact -->
                    <span class="col">
                        <ul class="social-network social-circle">
                            <li><a href="https://www.instagram.com/eduardosantosd7/" class="icoInstagram" title="Instagram"><i class="fa fa-instagram"></i></a></li>
                            <li><a href="https://www.facebook.com/eduardosantos7" class="icoFacebook" title="Facebook"><i class="fa fa-facebook"></i></a></li>
                            <li><a href="https://twitter.com/EduardoLSantos" class="icoTwitter" title="Twitter"><i class="fa fa-twitter"></i></a></li>
                            <li><a href="https://www.linkedin.com/in/eduardosantosdelgado/" class="icoLinkedin" title="Linkedin"><i class="fa fa-linkedin"></i></a></li>
                        </ul>
                    </span>
                </span>
            </div>
        </footer>
        `
    )
}