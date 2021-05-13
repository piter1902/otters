import React, { useEffect } from 'react';
import { useHistory, useParams } from "react-router";
import useGetFetch from '../useGetFetch';
import ClipLoader from "react-spinners/ClipLoader";
import StatusBadge from './StatusBadge';

interface PeticionDetalleProps {
}

const PeticionDetalle: React.JSXElementConstructor<PeticionDetalleProps> = () => {
    const { id } = useParams<{ id: string }>();

    // Obtenemos la información de la peticion
    const { data: petition, isPending, error } = useGetFetch(`${process.env.REACT_APP_BASEURL}/petitions/` + id);

    // Navegación
    const history = useHistory();

    // Redirección en caso de error en la carga
    useEffect(() => {
        if (error != null) {
            // Hay error
            history.replace("/error");
        }
        return () => { }
    }, [error, history]);

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
                < div className="card-body px-3 py-3">
                    <p className="h2 fw-bold d-flex justify-content-between">
                        {petition.title}
                        <StatusBadge status={petition.status} />
                    </p>

                    <p className="lead ">Creado por {petition.userInfo.userName}</p>

                    <p >{(petition as any).body}</p>

                    <p className="lead ">Lugar: {petition.place}</p>
                    <p className="lead ">Fecha: {new Date(petition.targetDate).toLocaleDateString("en-ES")}</p>
                    {petition.expTime !== ""
                        ? <p className="lead ">Hora de expiración: {petition.expTime}</p>
                        : <p className="lead ">Hora de expiración: --:--</p>
                    }
                    {petition.isUrgent &&
                        <p className="lead ">Urgente: Sí</p>
                    }
                    {!petition.isUrgent &&
                        <p className="lead ">Urgente: No</p>
                    }
                </div>)
            }

        </div >


    )
}

export default PeticionDetalle;