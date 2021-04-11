import React, { JSXElementConstructor } from 'react'

interface AdminPageProps {

}

const AdminPage: JSXElementConstructor<AdminPageProps> = () => {

    const reloadDataSource = () => {
        console.log("Recargando la fuente de datos");
    }

    return (
        <div className="container-fluid d-flex justify-content-center card">
            <div className="card-body">
                <div className="row">
                    {/* Columna de ayuda */}
                    <div className="col">
                        <div className="card">
                            <div className="card-header">
                                <p className="display-6">
                                    Ayuda
                                </p>
                            </div>
                            <div className="card-body">
                                <ul className="list-group">
                                    <li className="list-group-item">
                                        <span className="fw-bold">Peticiones realizadas: </span>
                                        298
                                    </li>
                                    <li className="list-group-item">
                                        <span className="fw-bold">Peticiones atendidas: </span>
                                        201
                                    </li>
                                    <li className="list-group-item">
                                        <span className="fw-bold">Peticiones canceladas: </span>
                                        97
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                    {/* Columna de Foro */}
                    <div className="col">
                        <div className="card mt-md-0 mt-4">
                            <div className="card-header">
                                <p className="display-6">
                                    Foro
                                </p>
                            </div>
                            <div className="card-body">
                                <ul className="list-group">
                                    <li className="list-group-item">
                                        <span className="fw-bold">Posts escritos: </span>
                                        567
                                    </li>
                                    <li className="list-group-item">
                                        <span className="fw-bold">Día con más publicaciones: </span>
                                        25/04/2021
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Usuarios */}
                <div className="row card mt-md-3 mt-4">
                    <div className="card-header">
                        <p className="display-5">
                            Usuarios
                        </p>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <ul className="list-group">
                                <li className="list-group-item">
                                    <span className="fw-bold">Usuarios registrados: </span>
                                    345
                                </li>
                                <li className="list-group-item">
                                    <span className="fw-bold">Usuarios verificados: </span>
                                        278
                                </li>
                            </ul>
                        </div>
                        {/* Búsqueda de usuario para banear */}
                        <div className="row mt-3">
                            <ul className="list-group">
                                <li className="list-group-item">
                                    <div className="input-group">
                                        <input type="text" placeholder="username" id="usernamesearch" className="form-control"
                                            aria-label="Recipient's username" aria-describedby="usernamesearch-button" />
                                        <button className="btn btn-outline-primary" id="usernamesearch-button">
                                            <i className="fa fa-search" aria-hidden="true"></i>
                                        </button>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    Resultados de la búsqueda en una lista
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Fuenta de datos */}
                <div className="row card mt-md-3 mt-4">
                    <div className="card-header">
                        <p className="display-5">
                            Fuente de datos
                        </p>
                    </div>
                    <div className="card-body">
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-primary rounded-pill" onClick={reloadDataSource}>
                                <p className="text-light mb-0 px-md-4 px-2">
                                    Obtener datos
                                    <i className="fa fa-refresh ms-3" aria-hidden="true"></i>
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminPage;