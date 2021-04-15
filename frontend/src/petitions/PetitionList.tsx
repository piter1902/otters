import { useState } from "react";
import '../Navbar.css'

export interface PetitionListProps {

}

const PetitionList: React.JSXElementConstructor<PetitionListProps> = () => {

    const [petitions, setPetitions] = useState([
        { title: 'Titulo de peticion', task: 'Comprar cerveza', address: 'Calle Alfonso Artero', author: 'ElJosé', id: 1, done: false },
        { title: 'Titulo de peticion', task: 'Comprar cerveza', address: 'Calle Alfonso Artero', author: 'ElJosé', id: 2, done: true },
        { title: 'Titulo de peticion', task: 'Comprar cerveza', address: 'Calle Alfonso Artero', author: 'ElJosé', id: 3, done: false }
    ])

    return (
        <div>
            <div className="container-fluid mb-4 mt-4">
                <div className="row justify-content-between">
                    <div className="col-4">
                        <button className="btn navbar-azul text-light text-decoration-none">
                            Añadir peticion <i className="fas fa-plus ms-2"></i>
                        </button>
                    </div>
                    <div className="col-4 d-grid gap-2 d-md-flex justify-content-md-end">
                        <button className="btn navbar-azul text-light text-decoration-none ">
                            Filtrar <i className="fas fa-sort-down ms-2"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="container">
                {petitions.map(petition => (
                    <div className="container-fluid d-flex justify-content-center card mb-4" key={petition.id} >
                        <h2 className="ms-3 mt-3"><b>{petition.title}</b></h2>
                        <div className="row row justify-content-between">
                            <div className="col">
                                <p className="ms-3">Creado por {petition.author}</p>
                            </div>
                            <div className="col-1 sm-12">
                                {petition.done && <i className="fas fa-check"></i>}
                                {!petition.done && <i className="fas fa-times"></i>}
                            </div>
                        </div>
                        <p className="ms-3 mt-3"> {petition.task} -- {petition.address} </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PetitionList;