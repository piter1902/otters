import React, { JSXElementConstructor, useState } from 'react'
import { Link } from 'react-router-dom';

interface PetitionListComponentProps {
    petitionsInfo: any[];
}

const PetitionListComponent: JSXElementConstructor<PetitionListComponentProps> = ({ petitionsInfo }) => {
    return (
        <div>
            {
                petitionsInfo.map((petitionInfo: any) => (
                    <Link to={"/peticionDetalle/" + petitionInfo.petition._id} className="custom-card" key={petitionInfo.petition._id}>
                        
                        <div className="container-fluid d-flex justify-content-center card mb-4" key={petitionInfo.petition._id} >

                            <h2 className="ms-3 mt-3"><b>{petitionInfo.petition.title}</b></h2>
                            <div className="row row justify-content-between">
                                <div className="col">
                                    <p className="ms-3">Creado por {petitionInfo.userName}</p>
                                </div>
                                <div className="col-1 sm-12">
                                    {petitionInfo.petition.status == "Done" && <i className="fas fa-check"></i>}
                                    {petitionInfo.petition.status != "Done" && <i className="fas fa-times"></i>}
                                </div>
                            </div>
                            <p className="ms-3 mt-3"> {petitionInfo.petition.body} -- {petitionInfo.petition.place} </p>
                        </div>
                    </Link>
                ))
            }
        </div>
    )
}

export default PetitionListComponent;