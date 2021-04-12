import React, { useRef } from 'react'

const ChangeUserData = () => {

    // Accion de cambiar la contraseña
    const changeDataButtonClicked = () => {
        console.log("Cambiar la contraseña");
    }

    return (
        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Cambiar datos</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {/* Cambio de contraseña */}
                        <div className="card">
                            <div className="card-header">
                                Cambio de contraseña
                                        </div>
                            <div className="card-body">
                                {/* Contraseña vieja */}
                                <div className="input-group">
                                    <label htmlFor="oldPass" className="input-group-text">
                                        Contraseña actual
                                                </label>
                                    <input type="password" id="oldPass" className="form-control" />
                                </div>
                                {/* Contraseña nueva */}
                                <div className="input-group mt-3">
                                    <label htmlFor="newPass" className="input-group-text">
                                        Contraseña nueva
                                                </label>
                                    <input type="password" id="newPass" className="form-control" />
                                </div>
                            </div>
                        </div>
                        {/* Cambio de zona sanitaria */}
                        <div className="card mt-3">
                            <div className="card-body">
                                <div className="input-group">
                                    <label htmlFor="zonasanitariaselect" className="input-group-text">
                                        Zona sanitaria
                                                </label>
                                    <select id="zonasanitariaselect" className="form-control" value="id1">
                                        <option value="id1">El Arrabal</option>
                                        <option value="id2">Huesca</option>
                                        <option value="id3">Ejea</option>
                                        <option value="id4">Huesca Rural</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" className="btn btn-success" onClick={changeDataButtonClicked} data-bs-dismiss="modal">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangeUserData;