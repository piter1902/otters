import React from 'react';
import './Navbar.css'
import logo from './otter2.png';
import { Link } from 'react-router-dom';
import useToken from './auth/Token/useToken';

export interface NavbarProps {

}

const Navbar: React.JSXElementConstructor<NavbarProps> = () => {

    // Title
    const title = "OTTERS";

    // Token para mantener el estado del usuario
    const { token, saveToken } = useToken();
    // Admin property
    const isAdmin = true;

    return (
        <div className="mb-3">
            <nav className="navbar navbar-expand-md navbar-light bg-light">
                <div className="container-fluid ms-2">
                    <h1 className="navbar-brand text-dark mx-5 my-0">
                        <Link to="/" className="text-decoration-none text-dark">{title}
                            <img src={logo} className="logo" alt="Logo" />
                        </Link>
                    </h1>
                    {token != null && <div>
                        <button className="navbar-toggler me-2" type="button" data-toggle="collapse"
                            data-target="#navbarTop" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse me-3" id="navbarTop">
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item mx-2">
                                    <Link to="/cuenta" className="text-muted text-decoration-none">
                                        <i className="fas fa-user mx-1"></i>
                                    Cuenta
                                </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    }
                </div>
            </nav>
            <nav className="navbar navbar-expand-md navbar-dark navbar-azul">
                <div className="container-fluid">
                    <button className="navbar-toggler me-2" type="button" data-toggle="collapse"
                        data-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse ms-3 me-3" id="navbar">
                        {/* Para hacer que funcionen con las rutas no usar <a> */}
                        <ul className="navbar-nav py-3 container d-flex justify-content-between">
                            <li className="nav-item mx-2">
                                <Link to="/estadisticas" className="text-light text-decoration-none">Estadísticas COVID</Link>
                            </li>
                            <li className="nav-item text-light mx-2">
                                <Link to="/foro" className="text-light text-decoration-none">Foro</Link>
                            </li>
                            <li className="nav-item text-light mx-2">
                                <Link to="/peticionesayuda" className="text-light text-decoration-none">Ayuda</Link>
                            </li>
                            {isAdmin &&
                                <li className="nav-item text-light mx-2">
                                    <Link to="/admin" className="text-light text-decoration-none">Admin</Link>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </nav >
        </div>
    );
}

export default Navbar;
