import { useEffect, useState } from "react";
import '../Navbar.css'
import { Link } from 'react-router-dom';
import './Petition.css'
import './Petition'
import PetitionListComponent from "./PetitionListComponent";
import useGetFetch from '../useGetFetch';
import ClipLoader from "react-spinners/ClipLoader";
import Petition from "./Petition";

export interface PetitionListProps {

}

const PetitionList: React.JSXElementConstructor<PetitionListProps> = () => {

    const { data, isPending, error } = useGetFetch(`${process.env.REACT_APP_BASEURL!}/petitions`);

    // Peticiones filtradas
    const [filteredPetitions, setFilteredPetitions] = useState<Petition[]>([]);
    // Filtro seleccionado
    const [filter, setFilter] = useState<string>("0");

    // Cambio del filtro a aplicar
    const filterChanged = (event: { target: { value: string; }; }) => {
        setFilter(event.target.value);
    }

    useEffect(() => {
        if (filter === "Open") {
            console.log(filteredPetitions)
            setFilteredPetitions(
                data.filter((petition: Petition) =>
                    petition.status.toUpperCase() === "OPEN"
                )
            )
        } else if (filter === "Recent") {
            setFilteredPetitions(
                data.sort((a: Petition,b: Petition) => (a.targetDate > b.targetDate) ? 1 : -1 )
            )
        } else {
            setFilteredPetitions(data)
        }
    }, [filter, data])

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
                    <div className="col-4 d-grid gap-2 d-md-flex justify-content-md-end dropdown">
                        <select id="petitionFilter" className="navbar-azul text-light btn" value={filter} onChange={filterChanged}>
                            <option value="0" style={{ backgroundColor: "white" }} disabled>Filtrar</option>
                            <option value="Recent" className="text-dark" style={{ backgroundColor: "white" }}>Más reciente</option>
                            <option value="Open" className="text-dark" style={{ backgroundColor: "white" }}>Peticiones abiertas</option>

                        </select>
                    </div>
                </div>
            </div>
            {/* To show error on fetching data */}
            { error && <div style={{ textAlign: "center", verticalAlign: "middle" }}>{error}</div>}
            <div style={{ textAlign: "center", verticalAlign: "middle" }}>
                <ClipLoader color="#172c48" loading={isPending} size={50} />
            </div>
            <div className="container">
                {/* {data && setPetitions(data)} */}
                {isPending ? <div style={{ textAlign: "center", verticalAlign: "middle" }}>Loading ...</div>
                    : <PetitionListComponent petitionsInfo={filteredPetitions} />}
            </div>
        </div>
    );
}

export default PetitionList;