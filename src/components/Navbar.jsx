
import { useAuthStore } from '../hooks';
import { useNavigate } from "react-router-dom";


//const dateNow = new Date().toLocaleDateString('es-MX', {year: 'numeric', month: '2-digit', day: '2-digit'});

export const Navbar = () => {
    
    const navigate = useNavigate();
    const { startLogout, user } = useAuthStore();

  return (
    <nav className="navbar navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
            <a className="navbar-brand" href="#">MONITOREO DE MOVIMIENTOS</a>
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
                    <div>
                        <h2 className="dropdown-item">{user.name}</h2>
                        <button onClick={startLogout}>Cerrar Sesión</button>
                    </div>

                    <li className="nav-item">
                        <a className="nav-link active" aria-current="page" onClick={() => navigate("/")}>Movimientos</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" onClick={() => navigate("/panel")}>Panel de Administrador</a>
                    </li>
                </ul>
            </div>
            </div>
        </div>
        </nav>
  )
}
