import { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import '../Navbar.css'

export interface createPostProps {

}

const CreatePost: React.JSXElementConstructor<createPostProps> = () => {

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
                <div className="mt-4">
                    <textarea id="TextArea" className="form-control" placeholder="Escriba el cuerpo del post..." required></textarea>
                </div>
                <div className="row justify-content-center">
                    <div className="col d-grid gap-2 d-md-flex justify-content-md-center">
                        <button type="submit" className="btn navbar-azul text-light text-decoration-none mt-4">
                            Añadir post<i className="fas fa-plus ms-2"></i>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CreatePost;
