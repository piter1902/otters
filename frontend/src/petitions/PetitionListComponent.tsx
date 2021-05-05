import React, { JSXElementConstructor, useState } from 'react'
import { Link } from 'react-router-dom';

interface PetitionListComponentProps {
    petitionsInfo: any[];
}

const PetitionListComponent: JSXElementConstructor<PetitionListComponentProps> = ({ petitionsInfo }) => {
    return (
        <div>
            { petitionsInfo && petitionsInfo.map((petitionInfo: any) => (
                <Link to={"/peticionDetalle/" + petitionInfo._id} className="custom-card" key={petitionInfo._id}>

                    <div className="container-fluid d-flex justify-content-center card mb-4" key={petitionInfo._id} >

                        <h2 className="ms-3 mt-3"><b>{petitionInfo.title}</b></h2>
                        <div className="row row justify-content-between">
                            <div className="col">
                                <p className="ms-3">Creado por {petitionInfo.userInfo.userName}</p>
                            </div>
                            <div className="col-1 sm-12">
                                {petitionInfo.status == "COMPLETED"
                                    ? <i className="fas fa-check"></i>
                                    : "COMPLETED" && <i className="fas fa-times"></i>}
                            </div>
                        </div>
                        <p className="ms-3 mt-3"> {petitionInfo.body} -- {petitionInfo.place} </p>
                    </div>
                </Link>
            ))
            }
        </div>
    )
}

export default PetitionListComponent;