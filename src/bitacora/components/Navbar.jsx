
const dateNow = new Date().toLocaleDateString('es-MX', {year: 'numeric', month: '2-digit', day: '2-digit'});

export const Navbar = () => {
  return (
    <nav className="navbar navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
            <a className="navbar-brand" href="#">MONITOREO DE MOVIMIENTOS</a>
            <span className="navbar-brand" >{dateNow}</span>
            <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="offcanvas offcanvas-end text-bg-dark" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel"></h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">Movimientos</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Panel de Administrador</a>
                </li>
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Usuario
                    </a>
                    <ul className="dropdown-menu dropdown-menu-dark">
                    <li><a className="dropdown-item" href="#">Cerrar Sesión</a></li>
                    <li><a className="dropdown-item" href="#">Another action</a></li>
                    <li>
                        <hr className="dropdown-divider" />
                    </li>
                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                </li>
                </ul>
            </div>
            </div>
        </div>
        </nav>
  )
}