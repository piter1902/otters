import React, { useState } from 'react';
import GoogleButton from 'react-google-button';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import FacebookLogin, { ReactFacebookLoginInfo, ReactFacebookFailureResponse } from 'react-facebook-login';
import { Link, useHistory } from 'react-router-dom';
import './Login.css';
import Token from './Token/Token';
import useToken from './Token/useToken';
import SelectZoneGoogleUser from './SelectZoneGoogleUser';
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
    const { token, saveToken } = useToken();

    // Para mostrar el popup
    const [show, setShow] = useState<boolean>(false);
    const [userId, setUserId] = useState<String>();
    const [userName, setUserName] = useState<String>("");
    // Procesa la respuesta de los proveedores externos (Google, Facebook)
    const _processProviderResponse = async (result: Response) => {

        if (result.ok) {
            //Obtención de los resultados del loggin
            const resultJson = (await result.json())
            const resToken = result.headers.get("x-auth-token");
            console.log("Respuesta:  " + resultJson.userId + " " + resToken)
            // Todo correcto
            const token: Token = {
                userId: resultJson.userId,
                token: resToken!,
                type: "Bearer"
            }
            saveToken(token);
            setUserId(resultJson.userId);
            setError({
                error: false,
                message: ""
            });
            // Para comprobar si el usuario ya existía o acaba de crearse
            const userExists = resultJson.userExists;
            if (userExists) {
                // Recargamos la página
                history.push("/");
                // window.location.reload();
            } else {
                // Si se acaba de crear el user, se debe mostrar el popup para seleccionar si zona básica
                setShow(true);
            }

        } else {
            // Error -> Mostrar un alert
            setError({
                error: true,
                message: "Usuario o contraseña incorrecto(s)"
            });
        }
    }
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
        const responseJson = (await result.json())
        console.log("Result: " + responseJson);
        // TODO: Faltan las redirecciones
        if (result.ok) {
            // Todo correcto
            const token: Token = {
                userId: responseJson.data.userId,
                token: responseJson.data.token,
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
            // Error -> Mostrar una alerta
            const message = responseJson.error;
            setError({
                error: true,
                message: message ?? "Usuario o contraseña incorrecto(s)"
            });
        }
    };

    const responseFacebook = async (response: ReactFacebookLoginInfo | ReactFacebookFailureResponse) => {
        console.log("Facebook response: " + (response as ReactFacebookLoginInfo).accessToken)
        setUserName((response as ReactFacebookLoginInfo).name!);
        const result = await fetch(`${process.env.REACT_APP_BASEURL}/auth/facebook`,
            {
                method: "POST",
                body: JSON.stringify({
                    accessToken: (response as ReactFacebookLoginInfo).accessToken,
                    userId: (response as ReactFacebookLoginInfo).userID
                }),
                mode: 'cors',
                cache: 'default',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "Content-Type": "application/json"
                }
            });
        _processProviderResponse(result);
    }

    // Respuesta de google login
    // Source: https://medium.com/@alexanderleon/implement-social-authentication-with-react-restful-api-9b44f4714fa
    const googleResponse = async (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {

        console.log("Google Reponse token: " + (response as GoogleLoginResponse).accessToken)
        setUserName((response as GoogleLoginResponse).profileObj.name);
        const result = await fetch(`${process.env.REACT_APP_BASEURL}/auth/google`,
            {
                method: "POST",
                body: JSON.stringify({
                    token: (response as GoogleLoginResponse).tokenId
                }),
                mode: 'cors',
                cache: 'default',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "Content-Type": "application/json"
                }
            });

        _processProviderResponse(result);
    }


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
                            <div className="text-center mb-3 d-grid gap-2">
                                <GoogleLogin
                                    clientId="488176144101-nksd69ithfpreq0qqefa51btkkc9d9cb.apps.googleusercontent.com"
                                    buttonText="Login"
                                    onSuccess={googleResponse}
                                    onFailure={err => { console.log(err); alert("Google login error") }}
                                    render={renderProps => (<GoogleButton onClick={renderProps.onClick}></GoogleButton>)
                                    }
                                ></GoogleLogin>
                                <div>

                                </div>
                                <FacebookLogin
                                    appId="315641319935168"
                                    autoLoad={false}
                                    fields="name,email,picture"
                                    callback={responseFacebook} />
                            </div>

                            <div className="d-flex align-self-center mt-2 mt-xl-6">
                                <p className="font-weight-bold">¿No tienes cuenta? </p>
                                <Link to="/register">Regístrate</Link>
                            </div>
                            {/* Popup que se muestra tras realizar el Login por Google */}
                            <SelectZoneGoogleUser idUser={userId} token={token} show={show} userName={userName}></SelectZoneGoogleUser>

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