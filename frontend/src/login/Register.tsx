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

    return (<div className="container-fluid row fondo">
        <div className="col-4 mx-lg-5 my-5 img-rounded grupoInput">
            <form>
                <div className="input-group mt-4 pt-1 px-sm-5">
                    <input type="text" className="form-control rounded-pill" placeholder="Nombre de usuario"></input>
                </div>
                <div className="input-group py-1 mt-3 px-sm-5">
                    <input type="text" className="form-control rounded-pill" placeholder="Correo"></input>
                </div>
                <div className="input-group py-1 mt-3 px-sm-5">
                    <input type="text" className="form-control rounded-pill" placeholder="Confirmar correo"></input>
                </div>
                <div className="input-group py-1 mt-3 px-sm-5">
                    <label className="input-group-text" htmlFor="zonasaludselect">
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
                <div className="input-group py-1 mt-3 px-sm-5">
                    <input type="text" className="form-control rounded-pill" placeholder="Contraseña"></input>
                </div>
                <div className="input-group py-1 mt-3 px-sm-5">
                    <input type="text" className="form-control rounded-pill" placeholder="Confirmar contraseña"></input>
                </div>
                <div className="text-center pt-5 mb-3">
                    <button type="button" className="btn rounded-pill registerButton">Crear cuenta</button>
                </div>

            </form>
        </div>
        <div className="col px-md-3 mt-2">

        </div>
    </div>);
}

export default Register;