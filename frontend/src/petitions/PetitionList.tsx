import { useState } from "react";
import '../Navbar.css'
import { Link } from 'react-router-dom';
import './Petition.css'
import PetitionListComponent from "./PetitionListComponent";
import useGetFetch from '../useGetFetch';
import ClipLoader from "react-spinners/ClipLoader";

export interface PetitionListProps {

}

const PetitionList: React.JSXElementConstructor<PetitionListProps> = () => {

    const { data, isPending, error } = useGetFetch(`${process.env.REACT_APP_BASEURL!}/petitions`);

    return (
        <div>
            <div className="container-fluid mb-4 mt-4">
                <div className="row justify-content-between">
                    <div className="col-4">
                        <Link to="/createPetition" >
                            <button className="btn navbar-azul text-light text-decoration-none">
                                Añadir peticion <i className="fas fa-plus ms-2"></i>
                            </button>
                        </Link>
                    </div>
                    <div className="col-4 d-grid gap-2 d-md-flex justify-content-md-end">
                        <button className="btn navbar-azul text-light text-decoration-none ">
                            Filtrar <i className="fas fa-sort-down ms-2"></i>
                        </button>
                    </div>
                </div>
            </div>
            {/* To show error on fetching data */}
            { error && <div style={{ textAlign: "center", verticalAlign: "middle" }}>{error}</div>}
            <div style={{ textAlign: "center", verticalAlign: "middle" }}>
                <ClipLoader color="#172c48" loading={isPending} size={50} />
            </div>
            <div className="container">
                {isPending ? <div style={{ textAlign: "center", verticalAlign: "middle" }}>Loading ...</div>
                    : <PetitionListComponent petitionsInfo={data} />}
            </div>
        </div>
    );
}

export default PetitionList;