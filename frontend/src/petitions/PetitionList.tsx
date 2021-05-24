import { useEffect, useState } from "react";
import '../Navbar.css'
import { Link } from 'react-router-dom';
import './Petition.css'
import './Petition'
import PetitionListComponent from "./PetitionListComponent";
import useGetFetch from '../useGetFetch';
import ClipLoader from "react-spinners/ClipLoader";
import Petition from "./Petition";
import useToken from "../auth/Token/useToken";

export interface PetitionListProps {

}

const PetitionList: React.JSXElementConstructor<PetitionListProps> = () => {
    // Token
    const { token } = useToken();
    
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
        console.log(filter);
        if (filter === "Open") {
            console.log(filteredPetitions)
            setFilteredPetitions(
                data.filter((petition: Petition) =>
                    petition.status.toUpperCase() === "OPEN"
                )
            )
        } else if (filter === "Urgent") {
            setFilteredPetitions(
                [].concat(
                data.sort((a: Petition, b: Petition) =>{
                    return +new Date(b.targetDate) - +new Date(a.targetDate)  
                }
                ).reverse()));
            setFilteredPetitions(
                [].concat(
                data.filter((petition: Petition) =>
                    (petition.status.toUpperCase() === "OPEN") || (petition.status.toUpperCase() === "ASSIGNED")
                )))
        }
        else if (filter === "MeAssigned") {
            setFilteredPetitions(
                [].concat(
                data.filter((petition: Petition) =>
                    petition.userIdAsigned == token?.userId
                )))
                console.log(data)
                console.log(token?.userId)
                
        }
        else {
            if(data !== null){
                setFilteredPetitions([].concat(
                    data.sort((a: Petition, b: Petition) =>{
                        return +new Date(b.creationDate) - +new Date(a.creationDate)
                    }
                    )))
                setFilteredPetitions(
                    [].concat(
                    data.filter((petition: Petition) =>
                        (petition.status.toUpperCase() === "OPEN") || (petition.status.toUpperCase() === "ASSIGNED")
                    )))
            }
            setFilter("0")
            console.log(data)
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
                    <div className="col-4 d-grid gap-2 justify-content-md-end">
                        <select id="petitionFilter" className="navbar-azul text-light btn form-select" value={filter} onChange={filterChanged}>
                            <option value="0" style={{ backgroundColor: "white" }} disabled>Filtrar</option>
                            <option value="Urgent" className="text-dark" style={{ backgroundColor: "white" }}>Más urgente</option>
                            <option value="Open" className="text-dark" style={{ backgroundColor: "white" }}>Peticiones abiertas</option>
                            <option value="MeAssigned" className="text-dark" style={{ backgroundColor: "white" }}>Peticiones asignadas a mí</option>
                            <option style={{ backgroundColor: "white", textAlign: "center" }} disabled value="">_______________</option>
                            <option value="Reset" className="text-dark" style={{ backgroundColor: "white" }}>Limpiar filtro</option>
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