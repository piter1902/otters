import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

// Funcionalidad login: https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications
export interface LoginProps {
}

// Realiza el login del usuario
async function login(credentials: any) {
    const result = await fetch(`${process.env.REACT_APP_BASEURL}/auth/login`,
        {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                password: credentials.userPassword,
                email: credentials.userMail,
            })
        });
    console.log("Result: " + await result.text());
    // TODO: Faltan las redirecciones
};

const Login: React.JSXElementConstructor<LoginProps> = () => {
    const [userMail, setUserMail] = useState("");
    const [userPassword, setUserPassword] = useState("");

    const handleSubmit = (e: any) => {
        e.preventDefault();
        login({
            userMail,
            userPassword
        });
    }
    return (
        <div className="row fondo d-flex justify-content-center" style={{ marginLeft: "0" }}>
            <form onSubmit={handleSubmit}>
                <div className="d-flex flex-column justify-content-center align-items-center col-sm-4 col-11 mx-sm-5 my-sm-4 mx-3 my-3 grupoInput">
                    <div className="form-group">
                        <div className="d-grid gap-2 gap-md-3 mt-sm-6 mt-3 px-3">
                            <div className="input-group pt-2">
                                <input type="text" className="form-control p-md-2 p-xl-4 rounded-pill"
                                    placeholder="Correo" onChange={e => setUserMail(e.target.value)} required></input>
                            </div>
                            <div className="input-group">
                                <input type="password" className="form-control p-md-2 p-xl-4 rounded-pill"
                                    placeholder="Contraseña" onChange={e => setUserPassword(e.target.value)} required></input>
                            </div>
                        </div>
                        <div className="d-grid gap-2 gap-md-3 mt-2 mt-xl-6 p-4">
                            <div className="text-center mb-3">

                                <button type="submit" className="btn btn-md-lg btn-light rounded-pill">Inicia Sesión</button>

                            </div>
                            <div className="text-center mb-3">
                                <button type="button" className="btn btn-md-lg btn-light btn-labeled rounded-pill">
                                    <span className="btn-label pe-1"><i className="fab fa-google"></i></span>
                            Iniciar sesión con Google
                        </button>
                            </div>

                            <div className="d-flex align-self-center mt-2 mt-xl-6">
                                <p className="font-weight-bold">¿No tienes cuenta? </p>
                                <Link to="/register">Regístrate</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div className="col px-md-3 mt-2">

            </div>
        </div>
    );
}

export default Login;