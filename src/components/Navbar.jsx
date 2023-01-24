
import { Tooltip } from '@mui/material';
import { useAuthStore } from '../hooks';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import logo from '../assets/logo-rex.png';


export const Navbar = () => {
    
    const navigate = useNavigate();
    const { startLogout, user } = useAuthStore();

    const toUpper = (str = "") => {
        return str.toUpperCase() || "";
    }

    const customPermisoStr = (value) => {
        if(value == 1 ) return 'Capturista';
        if(value == 2 ) return 'Ejecutivo';
        if(value == 3 ) return 'Gerencial';
        if(value == 9 ) return 'Administrador';
    }

    const showPanel = () => {
        if(user.permiso == 9)
        return(
            <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/panel")} style={{cursor: "pointer"}}>Panel de Administrador</a>
            </li>
        );
    }
    
  return (
    <nav className="navbar navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
            <a className="navbar-brand hideOverFlow w-75" onClick={() => navigate("/")} style={{cursor: "pointer"}}>
                <img src={logo} width="70" height="56"  className='bg-white rounded rounded-3'/> &nbsp;
                 BITACORA DE MONITOREO DE UNIDADES
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="offcanvas offcanvas-end text-bg-dark" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
            <div className="offcanvas-header">
                <h4 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
                    <FontAwesomeIcon icon={faUserCircle} /> &nbsp;
                    {toUpper(user.name)}
                </h4>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                    <div className='d-flex m-2'>
                        <h5 className="dropdown-item">
                            <span className=''>
                                {customPermisoStr(user.permiso)}
                            </span>
                        </h5>
                        <Tooltip title="Cerrar Sesión">
                            <button className='btn btn-secondary' onClick={startLogout}>
                                <FontAwesomeIcon icon={faRightFromBracket} /> 
                            </button>
                        </Tooltip>
                    </div>

                    <li className="nav-item">
                        <a className="nav-link" aria-current="page" onClick={() => navigate("/")} style={{cursor: "pointer"}}>Movimientos</a>
                    </li>
                    {
                        showPanel()
                    }
                </ul>
            </div>
            </div>
        </div>
    </nav>
  )
}
