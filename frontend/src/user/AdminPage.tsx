import React, { JSXElementConstructor } from 'react'
import { ClipLoader } from 'react-spinners';
import useGetFetch from '../useGetFetch';
import AdminPageFetchData from './AdminPageFetchData';
import AdminPageUser from './AdminPageUser';

interface AdminPageProps {

}

const AdminPage: JSXElementConstructor<AdminPageProps> = () => {

    // Datos de ayuda
    const { data: stats, isPending, error } = useGetFetch(`${process.env.REACT_APP_BASEURL}/stats`)

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
                <AdminPageUser registrados={stats.usuarios.registrados} verificados={stats.usuarios.verificados} />
                {/* Fuenta de datos */}
                <AdminPageFetchData />
            </div>}
        </div>
    )
}

export default AdminPage;