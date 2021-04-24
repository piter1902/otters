import { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import '../Navbar.css'

export interface createPetitionProps {

}

const CreatePetition: React.JSXElementConstructor<createPetitionProps> = () => {

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log("Submit");
    }

    return (
        <div className="container-fluid">
            <form onSubmit={handleSubmit}>
                <div className="mt-4">
                    <input type="text" id="disabledTextInput" className="form-control" placeholder="Titulo..." required></input>
                </div>
                <div className=" row mt-4">
                    <div className="col-6">
                        <input type="date" id="disabledTextInput" className="form-control" placeholder="Fecha" required></input>
                    </div>
                    <div className="col-6">
                        <input type="text" id="disabledTextInput" className="form-control" placeholder="Lugar" required></input>
                    </div>
                </div>
                <div className=" row mt-4">
                    <div className="col-6">
                        <input type="time" id="disabledTextInput" className="form-control" placeholder="Hora" required></input>
                    </div>
                    <div className="col-6">
                        <input type="email" id="disabledTextInput" className="form-control" placeholder="Correo electrónico" required></input>
                    </div>
                </div>
                <div className=" row mt-4">
                    <div className="col">
                        <input type="checkbox" id="disabledTextInput" className="form-check-input" placeholder="Urgente" required></input>
                        <label className="form-check-label ms-3">
                            Urgente
                        </label>
                    </div>
                </div>
                <div className="mt-4">
                    <textarea id="TextArea" className="form-control" placeholder="Añadir descripción" required></textarea>
                </div>
                <div className="row justify-content-center">
                    <div className="col d-grid gap-2 d-md-flex justify-content-md-center">
                        <button type="submit" className="btn navbar-azul text-light text-decoration-none mt-4">
                            Añadir petición<i className="fas fa-plus ms-2"></i>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CreatePetition;
