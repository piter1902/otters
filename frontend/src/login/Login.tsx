import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

// Funcionalidad login: https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications
export interface LoginProps {

}


const Login: React.JSXElementConstructor<LoginProps> = () => {
    return (
        <div className="row fondo">
            <div className="col-md-4 col mx-md-5 mx-4 my-5 grupoInput">
                <form>
                    <div className="input-group mt-5 pt-5 px-sm-5">
                        <input type="text" className="form-control rounded-pill" placeholder="Correo"></input>
                    </div>
                    <div className="input-group py-1 mt-5 px-sm-5">
                        <input type="text" className="form-control rounded-pill" placeholder="Contraseña"></input>
                    </div>
                    <div className="text-center pt-5 mb-3">
                        <Link to="/" className="btn btn-lg btn-light rounded-pill">
                            Inicia sesión
                        </Link>
                    </div>
                    <div className="text-center mb-3">
                        <button type="button" className="btn btn-lg btn-light btn-labeled rounded-pill">
                            <span className="btn-label pe-1"><i className="fab fa-google"></i></span>
                            Iniciar sesión con Google
                        </button>
                    </div>

                    <div className="d-flex justify-content-between p-5 mx-5">
                        <div className="float-left">
                            <p className="font-weight-bold">¿No tienes cuenta?</p>
                        </div>
                        <div className="float-right">
                            <Link to="/register">Regístrate</Link>
                        </div>

                    </div>
                </form>
            </div>
            <div className="col px-md-3 mt-2">

            </div>
        </div>
    );
}

export default Login;