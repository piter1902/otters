import React, { useEffect, useState } from 'react';
import { useParams } from "react-router";
import useGetFetch from '../useGetFetch';
import ClipLoader from "react-spinners/ClipLoader";

interface PeticionDetalleProps {
}

const PeticionDetalle: React.JSXElementConstructor<PeticionDetalleProps> = () => {
    const { id } = useParams<{ id: string }>();

    // Obtenemos la información de la peticion
    const { data: petition, error, isPending } = useGetFetch(`${process.env.REACT_APP_BASEURL}/petitions/` + id);

    // Variables a mostrar
    const userId = (petition as any).userId;
    const title = (petition as any).title;
    const place = (petition as any).place;
    const targetDate = new Date((petition as any).targetDate);
    const isUrgent = (petition as any).isUrgent;
    const expTime = (petition as any).expTime;
    return (
        <div className="row card mt-md-4 mt-3">
            <div style={{ textAlign: "center", verticalAlign: "middle" }}>
                <ClipLoader color="#172c48" loading={isPending} size={50} />
            </div>

            {/* Loading text */}
            {isPending && <div style={{ textAlign: "center", verticalAlign: "middle" }}>Loading ...</div>}
            {/* Show error if exists */}
            { error && <div style={{ textAlign: "center", verticalAlign: "middle" }}>{error}</div>}
            {petition.length != 0 && (
                < div className="card-body px-3 py-3">
                    <p className="h2 fw-bold">{title}</p>
                    {/* TODO: Deberiamos mostrar el Id del usuario */}
                    <p className="lead ">Creado por {userId}</p>

                    <p >{(petition as any).body}</p>

                    <p className="lead ">Lugar: {place}</p>
                    <p className="lead ">Fecha: {targetDate.toLocaleDateString('en-ES')}</p>
                    {expTime != ""
                        ? <p className="lead ">Hora de expiración: {expTime}</p>
                        : <p className="lead ">Hora de expiración: --:--</p>
                    }
                    {isUrgent &&
                        <p className="lead ">Urgente: Sí</p>
                    }
                    {!isUrgent &&
                        <p className="lead ">Urgente: No</p>
                    }
                    <p className="lead ">Correo electrónico: La petition no tiene correo directamente...</p>
                </div>)
            }

        </div >


    )
}

export default PeticionDetalle;