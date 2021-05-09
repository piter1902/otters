import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Login.css';
import Token from './Token/Token';
import useToken from './Token/useToken';

// Funcionalidad login: https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications
export interface LoginProps {
}

interface ErrorMessage {
    error: boolean;
    message: string;
}

const Login: React.JSXElementConstructor<LoginProps> = () => {

    // Datos del usuario
    const [userMail, setUserMail] = useState<string>("");
    const [userPassword, setUserPassword] = useState<string>("");

    // Error
    const [error, setError] = useState<ErrorMessage>({ error: false, message: "" });

    // Navegation
    const history = useHistory();

    // Almacenamiento y modificación del token
    const { saveToken } = useToken();

    // Realiza el login del usuario
    const login = async (credentials: any) => {
        const result = await fetch(`${process.env.REACT_APP_BASEURL}/auth/login`,
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    password: credentials.userPassword,
                    email: credentials.userMail,
                })
            });
        const tokenJson = (await result.json())
        console.log("Result: " + tokenJson);
        // TODO: Faltan las redirecciones
        if (result.ok) {
            // Todo correcto
            const token: Token = {
                userId: tokenJson.data.userId,
                token: tokenJson.data.token,
                type: "Bearer"
            }
            saveToken(token);
            setError({
                error: false,
                message: ""
            });
            // Recargamos la página
            history.push("/");
            window.location.reload();
        } else {
            // Error -> Mostrar un alert
            setError({
                error: true,
                message: "Usuario o contraseña incorrecto(s)"
            });
        }
    };


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
            {/* <div className="col px-md-3 mt-2">
            </div> */}
            {/* Error de autenticación */}
            {error && error.error &&
                <div className="alert alert-danger w-50 h-25 d-flex justify-content-center align-middle" role="alert">
                    {error.message}
                </div>
            }
        </div>
    );
}

export default Login;