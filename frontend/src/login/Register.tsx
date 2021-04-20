import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

export interface RegisterProps {

}

const Register: React.JSXElementConstructor<RegisterProps> = () => {

    // Zona de salud elegida
    const [zonaSalud, setZonaSalud] = useState<string>("0");

    // Cambio de la zona de salud a visualizar
    const zonaSaludChanged = (event: { target: { value: string; }; }) => {
        setZonaSalud(event.target.value);
    }

    return (
        <div className="row fondo">
            <div className="d-flex flex-column justify-content-center align-items-center col-md-4 col mx-md-5 my-sm-3 mx-5 my-1 h-75 grupoInput">
                
                    <div className="d-grid gap-1 gap-sm-2 gap-md-2 gap-xl-4 mt-sm-6 mt-3 w-md-75">

                        <div className="input-group">
                            <input type="text" className="form-control p-xl-4 p-md-2 p-0 rounded-pill" placeholder="Nombre de usuario"></input>
                        </div>
                        <div className="input-group">
                            <input type="text" className="form-control p-xl-4 p-md-2 p-0 rounded-pill" placeholder="Correo"></input>
                        </div>
                        <div className="input-group">
                            <input type="text" className="form-control p-xl-4 p-md-2 p-0 rounded-pill" placeholder="Confirmar correo"></input>
                        </div>
                        <div className="input-group">
                            <label className="input-group-text p-xl-4 p-md-2 p-0" htmlFor="zonasaludselect">
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
                            <input type="text" className="form-control p-xl-4 p-md-2 p-0 rounded-pill" placeholder="Contraseña"></input>
                        </div>
                        <div className="input-group">
                            <input type="text" className="form-control p-xl-4 p-md-2 p-0 rounded-pill" placeholder="Confirmar contraseña"></input>
                        </div>
                    </div>
                    <div className="text-center pt-2 pt-md-3 mb-3">
                        <button type="button" className="btn rounded-pill registerButton">Crear cuenta</button>
                    </div>

                
            </div>
            <div className="col px-md-3 mt-2">

            </div>
        </div>);
}

export default Register;