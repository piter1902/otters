import React, { useState } from 'react';
import { useHistory } from 'react-router';
import useZBS from '../estadisticas/useZBS';
import ReCAPTCHA from 'react-google-recaptcha';
import './Login.css';

export interface RegisterProps {

}

const Register: React.JSXElementConstructor<RegisterProps> = () => {

    // Navegacion
    const history = useHistory();

    // Zona de salud elegida
    const [zonaSalud, setZonaSalud] = useState<string>("0");

    // Zonas de salud
    const zbs = useZBS(process.env.REACT_APP_BASEURL!);

    // Información introducida del usuario
    const [userName, setUsername] = useState("");
    const [userMail, setUserMail] = useState("");
    const [userConfirmMail, setUserConfirmMail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [userConfirmPassword, setUserConfirmPassword] = useState("");

    // Control del captcha
    const [enableRegister, setEnableRegister] = useState<boolean>(false);

    // Cambio de la zona de salud a visualizar
    const zonaSaludChanged = (event: { target: { value: string; }; }) => {
        setZonaSalud(event.target.value);
    }

    // Handle captcha
    const handleCaptcha = (token: string | null) => {
        if (token != null) {
            // El captcha es válido
            setEnableRegister(true);
        } else {
            // El captcha es inválido (ha caducado)
            setEnableRegister(false);
        }
    }


    // Realiza el registro del usuario
    const register = async (credentials: any) => {
        // TODO: más comprobaciones de los campos y la seguridad de las contraseñas aqui
        const response = await fetch(`${process.env.REACT_APP_BASEURL}/auth/register`,
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: credentials.userName,
                    password: credentials.userPassword,
                    email: credentials.userMail,
                    sanitaryZone: credentials.zonaSalud
                })
            });
        if (response.status === 201) {
            // Ha ido bien
            //const json = await response.json();
            // Recargamos la página y navegamos al login
            history.push("/login");
            window.location.reload();
        }
    };


    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (enableRegister) {
            // Si se ha verificado el captcha
            register({
                userName,
                userPassword,
                userMail,
                zonaSalud
            });
        }
    }

    return (
        <div className="row fondo d-flex justify-content-center" style={{ marginLeft: "0" }}>
            <form onSubmit={handleSubmit}>
                <div className="d-flex flex-column justify-content-center align-items-center col-md-4 col-10 mx-sm-5 my-sm-4 mx-3 my-3 grupoInput">
                    <div className="d-grid gap-1 gap-sm-2 gap-md-2 gap-xl-4 mt-sm-6 mt-3 w-md-75">
                        <div className="input-group">
                            <input type="text" className="form-control p-xl-3 p-md-1 mx-md-3 p-0 rounded-pill"
                                placeholder="Nombre de usuario" onChange={e => setUsername(e.target.value)} required></input>
                        </div>
                        <div className="input-group">
                            <input type="text" className="form-control p-xl-3 p-md-1 mx-md-3  p-0 rounded-pill"
                                placeholder="Correo" onChange={e => setUserMail(e.target.value)} required></input>
                        </div>
                        <div className="input-group">
                            <input type="text" className="form-control p-xl-3 p-md-1 mx-md-3  p-0 rounded-pill"
                                placeholder="Confirmar correo" onChange={e => setUserConfirmMail(e.target.value)} required></input>
                        </div>
                        <div className="input-group">
                            <label className="input-group-text p-xl-3 p-md-1 mx-md-3  p-0" htmlFor="zonasaludselect">
                                Zona sanitaria
                            </label>
                            <select id="zonasaludselect" className="form-select" value={zonaSalud} onChange={zonaSaludChanged} required>
                                <option value="0" disabled>Elige una zona sanitaria</option>
                                {
                                    zbs.map(z => (
                                        <option value={z._id} key={z._id}>{z.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="input-group">
                            <input type="password" className="form-control p-xl-3 p-md-1 mx-md-3  p-0 rounded-pill"
                                placeholder="Contraseña" onChange={e => setUserPassword(e.target.value)} required></input>
                        </div>
                        <div className="input-group">
                            <input type="password" className="form-control p-xl-3 p-md-1 mx-md-3  p-0 rounded-pill"
                                placeholder="Confirmar contraseña" onChange={e => setUserConfirmPassword(e.target.value)} required></input>
                        </div>
                    </div>
                    {/* Verificacion con captcha */}
                    <div className="pt-md-3 pt-2 mb-2">
                        <ReCAPTCHA
                            sitekey={process.env.REACT_APP_RECAPTCHA_CLIENT_KEY!}
                            onChange={handleCaptcha}
                        />
                    </div>
                    <div className="text-center pt-2 pt-md-3 mb-3">
                        <button type="submit" className="btn rounded-pill registerButton"
                            disabled={!enableRegister}>
                            Crear cuenta
                        </button>
                    </div>
                </div>
            </form>
            <div className="col px-md-3 mt-2">
            </div>
        </div>);
}

export default Register;