import React, { JSXElementConstructor } from 'react'
import { ClipLoader } from 'react-spinners';
import useGetFetch from '../useGetFetch';

interface AdminPageProps {

}

const AdminPage: JSXElementConstructor<AdminPageProps> = () => {

    // Datos de ayuda
    const { data: stats, isPending, error } = useGetFetch(`${process.env.REACT_APP_BASEURL}/stats`)

    const reloadDataSource = () => {
        console.log("Recargando la fuente de datos");
    }

    return (
        <div className="container-fluid d-flex justify-content-center card">
            {isPending &&
                <div style={{ textAlign: "center", verticalAlign: "middle" }}>
                    <ClipLoader color="#172c48" loading={isPending} size={50} />
                </div>
            }
            {!isPending && <div className="card-body">
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
                                        {stats.peticiones.realizadas}
                                    </li>
                                    <li className="list-group-item">
                                        <span className="fw-bold">Peticiones atendidas: </span>
                                        {stats.peticiones.atendidas}
                                    </li>
                                    <li className="list-group-item">
                                        <span className="fw-bold">Peticiones canceladas: </span>
                                        {stats.peticiones.canceladas}
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
                                        {stats.foro.escritos}
                                    </li>
                                    <li className="list-group-item">
                                        <span className="fw-bold">Día con más publicaciones: </span>
                                        {stats.foro.diaConMasPublicaciones}
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
                                    {stats.usuarios.registrados}
                                </li>
                                <li className="list-group-item">
                                    <span className="fw-bold">Usuarios verificados: </span>
                                    {stats.usuarios.verificados}
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
            </div>}
        </div>
    )
}

export default AdminPage;