import React, { JSXElementConstructor } from 'react'

interface UserProfileProps {

}

const UserProfile: JSXElementConstructor<UserProfileProps> = () => {

    // Variables del usuario
    const username = "elPepe";
    const email = "elpepe@unizar.es";
    const zonaSanitaria = "El Arrabal";

    // Accion de cambiar la contraseña
    const changeDataButtonClicked = () => {
        console.log("Cambiar la contraseña");
    }

    return (
        <div className="container-fluid d-flex justify-content-center card">
            <div className="card-body">
                <div className="row">
                    {/* Columna de datos de usuario */}
                    <div className="col-9">
                        {/* Nombre de usuario */}
                        <div className="input-group">
                            <label htmlFor="username" className="input-group-text">
                                Nombre de usuario
                            </label>
                            <input type="text" id="username" className="form-control" value={username} disabled />
                        </div>
                        {/* Correo del usuario */}
                        <div className="input-group mt-md-4 mt-3">
                            <label htmlFor="useremail" className="input-group-text">
                                Correo electrónico
                            </label>
                            <input type="text" id="useremail" className="form-control" value={email} disabled />
                        </div>
                    </div>
                    {/* Columna de la imagen del usuario */}
                    <div className="col-3 d-flex justify-content-end">
                        <img src="http://www.battelldentureclinic.com/app/webroot/images/userImages/8.jpg"
                            alt="user" className="rounded-circle w-50" />
                    </div>
                </div>
                <div className="container-fluid px-md-5 px-3 mt-md-4 mt-3 d-flex justify-content-center">
                    {/* Boton de cambio de contraseña */}
                    <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                        Cambiar datos
                    </button>
                    {/* Modal de cambio */}
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
                                    <button type="button" className="btn btn-success" onClick={changeDataButtonClicked}>Guardar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Lista de Posts */}
                <div className="container-fluid mt-md-4 mt-3">
                    <p className="display-6">Posts:</p>
                    <p className="display-3 text-danger card bg-secondary">Incluir aqui el componente de lista de posts con datos personalizados</p>
                </div>
                {/* Lista de Peticiones de ayuda */}
                <div className="container-fluid mt-md-4 mt-3">
                    <p className="display-6">Peticiones de ayuda:</p>
                    <p className="display-3 text-danger card bg-secondary">Incluir aqui el componente de lista de peticiones con datos personalizados</p>
                </div>
            </div>
        </div>
    )
}

export default UserProfile;