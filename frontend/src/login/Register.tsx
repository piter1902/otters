import React, { useState } from 'react';
import './Login.css';

export interface RegisterProps {

}

const Register: React.JSXElementConstructor<RegisterProps> = () => {

    // Zona de salud elegida
    const [zonaSalud, setZonaSalud] = useState<string>("0");

    // Información introducida del usuario
    const [userName, setUsername] = useState("");
    const [userMail, setUserMail] = useState("");
    const [userConfirmMail, setUserConfirmMail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [userConfirmPassword, setUserConfirmPassword] = useState("");

    // Cambio de la zona de salud a visualizar
    const zonaSaludChanged = (event: { target: { value: string; }; }) => {
        setZonaSalud(event.target.value);
    }

    // Realiza el registro del usuario
    const register = async () => {
        await fetch(`http://localhost:8080/auth/register`,
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: userName,
                    password: userPassword,
                    email: userMail,
                    sanitaryZone: zonaSalud
                })
            }).then(async (res) => console.log(await res));
        
    };

    return (
        <div className="row fondo d-flex justify-content-center" style={{ marginLeft: "0" }}>
            <div className="d-flex flex-column justify-content-center align-items-center col-md-4 col-10 mx-sm-5 my-sm-4 mx-3 my-3 grupoInput">
                <div className="d-grid gap-1 gap-sm-2 gap-md-2 gap-xl-4 mt-sm-6 mt-3 w-md-75">
                    <div className="input-group">
                        <input type="text" className="form-control p-xl-3 p-md-1 mx-md-3 p-0 rounded-pill"
                            placeholder="Nombre de usuario" onChange={e => setUsername(e.target.value)}></input>
                    </div>
                    <div className="input-group">
                        <input type="text" className="form-control p-xl-3 p-md-1 mx-md-3  p-0 rounded-pill"
                            placeholder="Correo" onChange={e => setUserMail(e.target.value)}></input>
                    </div>
                    <div className="input-group">
                        <input type="text" className="form-control p-xl-3 p-md-1 mx-md-3  p-0 rounded-pill"
                            placeholder="Confirmar correo" onChange={e => setUserConfirmMail(e.target.value)}></input>
                    </div>
                    <div className="input-group">
                        <label className="input-group-text p-xl-3 p-md-1 mx-md-3  p-0" htmlFor="zonasaludselect">
                            Zona sanitaria
                            </label>
                        <select id="zonasaludselect" className="form-select" value={zonaSalud} onChange={zonaSaludChanged}>
                            <option value="0" disabled>Elige una zona sanitaria</option>
                            <option value="1">zona 1</option>
                            <option value="2">zona 2</option>
                            <option value="3">zona 3</option>
                            <option value="4">zona 4</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <input type="password" className="form-control p-xl-3 p-md-1 mx-md-3  p-0 rounded-pill"
                            placeholder="Contraseña" onChange={e => setUserPassword(e.target.value)}></input>
                    </div>
                    <div className="input-group">
                        <input type="password" className="form-control p-xl-3 p-md-1 mx-md-3  p-0 rounded-pill"
                            placeholder="Confirmar contraseña" onChange={e => setUserConfirmPassword(e.target.value)}></input>
                    </div>
                </div>
                <div className="text-center pt-2 pt-md-3 mb-3">
                    <button type="button" className="btn rounded-pill registerButton" onClick={register}>Crear cuenta</button>
                </div>


            </div>
            <div className="col px-md-3 mt-2">

            </div>
        </div>);
}

export default Register;