import React, { JSXElementConstructor } from 'react'
import { Link } from 'react-router-dom';

interface PetitionListComponentProps {
    petitions: any[];
}

const PetitionListComponent: JSXElementConstructor<PetitionListComponentProps> = ({ petitions }) => {
    return (
        <div>
            {
                petitions.map((petition: any) => (
                    <Link to={"/peticionDetalle/" + petition._id } className="custom-card" key={petition._id}>
                        <div className="container-fluid d-flex justify-content-center card mb-4" key={petition._id} >
                            <h2 className="ms-3 mt-3"><b>{petition.title}</b></h2>
                            <div className="row row justify-content-between">
                                <div className="col">
                                    <p className="ms-3">Creado por {petition.userId}</p>
                                </div>
                                <div className="col-1 sm-12">
                                    {petition.status=="Done"  && <i className="fas fa-check"></i>}
                                    {petition.status!="Done" && <i className="fas fa-times"></i>}
                                </div>
                            </div>
                            <p className="ms-3 mt-3"> {petition.body} -- {petition.place} </p>
                        </div>
                    </Link>
                ))
            }
        </div>
    )
}

export default PetitionListComponent;