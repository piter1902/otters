import React, { JSXElementConstructor } from 'react'
import { Link } from 'react-router-dom';
import './Petition'
import Petition from './Petition';
import StatusBadge from './StatusBadge';

interface PetitionListComponentProps {
    petitionsInfo: Petition[];
}

const PetitionListComponent: JSXElementConstructor<PetitionListComponentProps> = ({ petitionsInfo }) => {
    return (
        <div>
            { petitionsInfo && petitionsInfo.length > 0 ? petitionsInfo.map((petitionInfo: Petition) => (
                <Link to={"/peticionDetalle/" + petitionInfo._id} className="custom-card" key={petitionInfo._id}>

                    <div className="container-fluid d-flex justify-content-center card mb-4" key={petitionInfo._id} >

                        <h2 className="ms-3 mt-3"><b>{petitionInfo.title}</b></h2>
                        <div className=" d-flex justify-content-between">
                            <p className="ms-3">Creado por {petitionInfo.userInfo.userName}</p>
                            <div className="h5 fw-bold">
                                <StatusBadge status={petitionInfo.status} />
                            </div>
                        </div>
                        <div className="d-flex justify-content-between">
                            <div className="p2">
                                <p className="ms-3 mt-3"> {petitionInfo.body} -- {petitionInfo.place} <i className="fas fa-map-marker-alt"></i></p>
                            </div>
                            <div className="p2 ml-auto">
                                <p className="ms-3 mt-3"> {new Date(petitionInfo.targetDate).toLocaleDateString("es-ES")} <i className="far fa-clock"></i></p>
                            </div>
                        </div>
                    </div>
                </Link>
            ))
                : <div style={{ textAlign: "center", verticalAlign: "middle" }}>No se ha encontrado ninguna petición ...</div>
            }
        </div>
    )
}

export default PetitionListComponent;