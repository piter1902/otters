import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import useToken from '../auth/Token/useToken';
import '../Navbar.css'

export interface createPetitionProps {

}
const createPetition = () => {

}

const CreatePetition: React.JSXElementConstructor<createPetitionProps> = () => {

    // Form variables
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [place, setPlace] = useState("");
    const [expTime, setExpTime] = useState("");
    const [isUrgent, setIsUrgent] = useState(false);
    const [description, setDescription] = useState("");
    const [isPending, setIsPending] = useState(false);
    // TODO: Esta variable debe obtener el id del usuario logeado
    //const [userId, setUserId] = useState("");
    const userId = "608973ba40f1db3b48fc1044";
    //Token
    const { token } = useToken();
    const history = useHistory();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        setIsPending(true);
        const result = await fetch(`${process.env.REACT_APP_BASEURL}/petitions`,
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token?.token
                },
                body: JSON.stringify({
                    title: title,
                    userId: userId,
                    body: description,
                    place: place,
                    targetDate: new Date(date),
                    isUrgent: isUrgent,
                    expTime: expTime
                })
            });

        if (result) {
            setIsPending(false);
            history.push('/peticionesayuda');
        }

        console.log("Result: " + await result.text());

    }
    return (
        <div className="container-fluid">
            <form onSubmit={handleSubmit}>
                <div className="mt-4">
                    <input type="text" id="disabledTextInput" className="form-control" placeholder="Titulo..."
                        onChange={e => setTitle(e.target.value)} required></input>
                </div>
                <div className=" row mt-4">
                    <div className="col-6">
                        <input type="date" id="disabledTextInput" className="form-control" placeholder="Fecha"
                            onChange={e => setDate(e.target.value)} required></input>
                    </div>
                    <div className="col-6">
                        <input type="text" id="disabledTextInput" className="form-control" placeholder="Lugar"
                            onChange={e => setPlace(e.target.value)} required></input>
                    </div>
                </div>
                <div className="row mt-4 justify-content-center">
                    <div className="col-6">
                        <input type="time" id="disabledTextInput" className="form-control" placeholder="Hora"
                            onChange={e => setExpTime(e.target.value)}></input>
                    </div>
                    {/* <div className="col-6">
                        <input type="email" id="disabledTextInput" className="form-control" placeholder="Correo electrónico"
                            onChange={e => setMail(e.target.value)} required></input>
                    </div> */}
                </div>
                <div className=" row mt-4">
                    <div className="col">
                        <input type="checkbox" id="disabledTextInput" className="form-check-input" placeholder="Urgente"
                            onChange={e => setIsUrgent(e.target.checked)}></input>
                        <label className="form-check-label ms-3">
                            Urgente
                        </label>
                    </div>
                </div>
                <div className="mt-4">
                    <textarea id="TextArea" className="form-control" placeholder="Añadir descripción"
                        onChange={e => setDescription(e.target.value)} required></textarea>
                </div>
                <div className="row justify-content-center">
                    <div className="col d-grid gap-2 d-md-flex justify-content-md-center">
                        {!isPending &&
                            <button type="submit" className="btn navbar-azul text-light text-decoration-none mt-4">
                                Añadir petición<i className="fas fa-plus ms-2"></i>
                            </button>
                        }
                        {isPending &&
                            <button type="submit" className="btn navbar-azul text-light text-decoration-none mt-4">
                                Añadiendo petición ...
                            </button>
                        }
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CreatePetition;
