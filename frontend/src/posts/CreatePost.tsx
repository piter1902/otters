import { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useToken from '../auth/Token/useToken';
import '../Navbar.css'

export interface createPostProps {

}

const CreatePost: React.JSXElementConstructor<createPostProps> = () => {

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const { token } = useToken();

    const publisher = useMemo(() => {
        if (token != null) {
            return token.userId;
        } else {
            return null;
        }
    }, [token]);

    const history = useHistory();


    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log("Submit");
        const post = { title, body, publisher, date: new Date() };
        fetch(`${process.env.REACT_APP_BASEURL!}/post`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `${token?.type} ${token?.token}` },
            body: JSON.stringify(post)
        }).then(() => {
            history.push('/foro');
            console.log("nuevo post creado")
        })
    }

    return (
        <div className="container-fluid">
            <form onSubmit={handleSubmit}>
                <div className="mt-4">
                    <input type="text" id="disabledTextInput" className="form-control" placeholder="Titulo..." required value={title} onChange={(e) => setTitle(e.target.value)}></input>
                </div>
                <div className="mt-4">
                    <textarea id="TextArea" className="form-control" placeholder="Escriba el cuerpo del post..." required value={body} onChange={(e) => setBody(e.target.value)}></textarea>
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
