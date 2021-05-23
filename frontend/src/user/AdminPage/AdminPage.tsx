import React, { JSXElementConstructor, useEffect } from 'react'
import { useHistory } from 'react-router';
import { ClipLoader } from 'react-spinners';
import useToken from '../../auth/Token/useToken';
import useGetFetch from '../../useGetFetch';
import AdminPageFetchData from './AdminPageFetchData';
import AdminPageUser from './AdminPageUser';

interface AdminPageProps {

}

const AdminPage: JSXElementConstructor<AdminPageProps> = () => {

    // Datos de ayuda
    const { data: stats, isPending } = useGetFetch(`${process.env.REACT_APP_BASEURL!}/stats`)

    // Token
    const { token } = useToken();

    // Navegacion
    const history = useHistory();

    // Comprobacion de rutas privadas
    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`${process.env.REACT_APP_BASEURL}/user/${token?.userId}`, {
                method: "GET"
            });
            if (response.status === 200) {
                // Set zone to zonaSalud by default
                const isAdmin = ((await response.json()).isAdmin);
                if (!isAdmin) {
                    console.log("El usuario no es admin");
                    history.push("/");
                }
            } else {
                console.log("Error en la peticion del usuario");
                history.push("/");
            }
        }
        if (token != null) {
            fetchUser();
        } else {
            console.log("No hay token ??");
            // history.push("/");
        }
        return () => { }
    }, [token, history]);

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
                <AdminPageUser registrados={stats.usuarios.registrados} verificados={stats.usuarios.verificados} idAdmin={token?.userId}/>
                {/* Fuenta de datos */}
                <AdminPageFetchData />
            </div>}
        </div>
    )
}

export default AdminPage;