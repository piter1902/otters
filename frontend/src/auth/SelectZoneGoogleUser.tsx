import { JSXElementConstructor, useState } from 'react';
import useZBS from '../estadisticas/useZBS';
import Token from '../auth/Token/Token';
import { useHistory } from 'react-router-dom';

interface SelectZoneGoogleUserProps {
    token?: Token | null,
    idUser: String | undefined,
    show: boolean,
    userName: String
}


const SelectZoneGoogleUser: JSXElementConstructor<SelectZoneGoogleUserProps> = ({ idUser, token, show, userName }) => {

    const [zone, setZone] = useState("");

    const zonasSalud = useZBS(process.env.REACT_APP_BASEURL!);

    // Navegation
    const history = useHistory();

    // Indica si el popup se muestra o no
    const showHideClassName = show ? "show d-block" : "d-none";


    // Accion de cambiar la contraseña
    const changeDataButtonClicked = async () => {
        console.log("Zona seleccionada" + zone);
        console.log("User: " + idUser);
        const result = await fetch(`${process.env.REACT_APP_BASEURL}/user/${token?.userId}`,
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `${token?.type} ${token?.token}`
                },
                body: JSON.stringify({
                    sanitaryZone: zone
                })
            });

        if (result.ok) {
            // Vamos al feed
            history.push("/");
            window.location.reload();
        }

    }

    return (
        <div className={"modal fade " + showHideClassName} id="selectZone" data-bs-show="true" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} role="dialog" aria-labelledby="selectZoneLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title" id="selectZoneLabel">Bienvenido, {userName}</h4>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-header">
                        <h6 className="modal-title" id="selectZoneLabel">Seleccione su zona básica de salud</h6>
                    </div>
                    <div className="modal-body">
                        {/* Cambio de zona sanitaria */}
                        <div className="card mt-3">
                            <div className="card-body">
                                <div className="input-group">
                                    <label htmlFor="zonasanitariaselect" className="input-group-text">
                                        Zona sanitaria
                                                </label>
                                    <select id="zonasanitariaselect" className="form-control" onChange={e => setZone(e.target.value)}>
                                        {
                                            zonasSalud.sort((zbs1, zbs2) => zbs1.name < zbs2.name ? -1 : 1).map((zbs) => (
                                                <option value={zbs._id} key={zbs._id}>{zbs.name}</option>
                                            ))
                                        }
                                    </select>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" className="btn btn-success" onClick={changeDataButtonClicked} data-bs-dismiss="modal" >Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectZoneGoogleUser;