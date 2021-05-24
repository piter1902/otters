import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router";
import useGetFetch from '../useGetFetch';
import ClipLoader from "react-spinners/ClipLoader";
import StatusBadge from './StatusBadge';
import PetitionButton from './PetitionButton';
import useToken from '../auth/Token/useToken';
import { Link } from 'react-router-dom';

interface PeticionDetalleProps {
}

const PeticionDetalle: React.JSXElementConstructor<PeticionDetalleProps> = () => {
    const { id } = useParams<{ id: string }>();

    // Token
    const { token } = useToken();

    // Obtenemos la información de la peticion
    const { data: petition, isPending, error } = useGetFetch(`${process.env.REACT_APP_BASEURL}/petitions/` + id);

    // Navegación
    const history = useHistory();

    const [userInfo, setUserInfo] = useState<any>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (token != null && token.userId) {
                const response = await fetch(`${process.env.REACT_APP_BASEURL!}/user/${token?.userId}`, {
                    method: "GET",
                    headers: {
                        'Authorization': `${token?.type} ${token?.token}`
                    }
                });
                if (response.status === 200) {
                    setUserInfo(await response.json());
                }
            }
        }
        fetchUserInfo();
        return () => { }
    }, [token]);

    // Redirección en caso de error en la carga
    useEffect(() => {
        if (error != null) {
            // Hay error
            history.replace("/error");
        }
        return () => { }
    }, [error, history]);

    const deletePet = async () => {
        // Cerrar sesión y recargar
        console.log("delete petition:" + id)

        await fetch(`${process.env.REACT_APP_BASEURL}/petitions/${id}`,
            {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `${token?.type} ${token?.token}`
                },
                body: JSON.stringify({
                })
            })
    }

    const strikeUser = async () => {
        // Cerrar sesión y recargar
        console.log("strike user:" + id)

        await fetch(`${process.env.REACT_APP_BASEURL}/user/${petition.userIdAsigned}/strike/${petition._id}`,
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `${token?.type} ${token?.token}`
                },
                body: JSON.stringify({
                })
            })
        window.location.reload();
    }

    const unassign = async () => {
        // Cerrar sesión y recargar
        console.log("user " + token?.userId + " unasigned to petitionId " + petition._id)

        await fetch(`${process.env.REACT_APP_BASEURL}/petitions/${petition._id}/cancel/${token?.userId}`,
            {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `${token?.type} ${token?.token}`
                },
                body: JSON.stringify({
                })
            })
        window.location.reload();
    }


    return (
        <div className="row card mt-md-4 mt-3">
            <div style={{ textAlign: "center", verticalAlign: "middle" }}>
                <ClipLoader color="#172c48" loading={isPending} size={50} />
            </div>

            {/* Loading text */}
            {isPending && <div style={{ textAlign: "center", verticalAlign: "middle" }}>Loading ...</div>}
            {/* Show error if exists */}
            { error && <div style={{ textAlign: "center", verticalAlign: "middle" }}>{error}</div>}
            {!isPending && (
                <div className="card-body px-3 py-3">
                    <p className="h2 fw-bold d-flex justify-content-between">
                        {petition.title}
                        <StatusBadge status={petition.status} />
                    </p>
                    <p className="h2 fw-bold d-flex justify-content-between">

                        {petition.userInfo.userId == token?.userId &&
                            <Link to={"/cuenta"} className="custom-card" >
                                <p className="lead texto">{petition.userInfo.userName}</p>
                            </Link>
                        }
                        {petition.userInfo.userId != token?.userId &&
                            <Link to={"/perfil/" + petition.userInfo.userId} className="custom-card" >
                                <p className="lead ">Creado por {petition.userInfo.userName}</p>
                            </Link>}
                        <PetitionButton userAsigned={petition.userIdAsigned} userQueue={petition.userQueueAsigned} petitionId={petition._id} userCreator={petition.userInfo.userId} status={petition.status} />
                    </p>



                    <p >{(petition as any).body}</p>

                    <p className="lead ">Lugar: {petition.place}</p>
                    <p className="lead ">Fecha: {new Date(petition.targetDate).toLocaleDateString("es-ES")}</p>
                    {
                        petition.expTime != ""
                            ? <p className="lead ">Hora de expiración: {petition.expTime}</p>
                            : <p className="lead ">Hora de expiración: --:--</p>
                    }
                    {
                        petition.isUrgent &&
                        <p className="lead ">Urgente: Sí</p>
                    }
                    {
                        !petition.isUrgent &&
                        <p className="lead ">Urgente: No</p>
                    }
                    {
                        (petition.userInfo.userId == token?.userId || (userInfo && userInfo.isAdmin)) &&
                        <p className="h2 fw-bold d-flex justify-content-center">
                            <Link to={"/peticionesayuda"} className="div" >
                                <button className="btn btn-danger mx-2" onClick={deletePet}>
                                    Borrar petición
                                </button>
                            </Link>
                        </p>
                    }
                    {
                        (petition.userInfo.userId == token?.userId) && (petition.status == "COMPLETED") && 
                        <p className="h2 fw-bold d-flex justify-content-center">
                            <button className="btn btn-danger mx-2" onClick={strikeUser}>
                                El usuario no ha realizado la petición
                            </button>
                        </p>
                    }
                    {
                        (petition.userInfo.userId != token?.userId) && (petition.status != "COMPLETED") && (petition.status != "CANCELED") && (petition.userIdAsigned == token?.userId || petition.userQueueAsigned.includes(token?.userId)) &&
                        <p className="h2 fw-bold d-flex justify-content-center">
                            <button className="btn btn-danger mx-2" onClick={unassign}>
                                Desasignarme de la petición
                            </button>
                        </p>
                    }
                </div>)
            }

        </div >
    )
}

export default PeticionDetalle;