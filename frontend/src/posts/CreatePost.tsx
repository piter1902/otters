import { group } from "d3";
import '../Navbar.css' 

export interface createPostProps {
    
}
 
const CreatePost: React.JSXElementConstructor<createPostProps> = () => {

    return(
        <div className="container-fluid">
            <div className="mt-4">
                <input type="text" id="disabledTextInput" className="form-control" placeholder="Titulo..."></input>
            </div>
            <div className="mt-4">
                <textarea id="TextArea" className="form-control"  placeholder="Escriba el cuerpo del post..."></textarea>
            </div>
            <div className="row justify-content-center">
                <div className="col d-grid gap-2 d-md-flex justify-content-md-center">
                    <button className="btn navbar-azul text-light text-decoration-none mt-4" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                    Añadir post<i className="fas fa-plus ms-2"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;
