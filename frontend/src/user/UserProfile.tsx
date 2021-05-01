import React, { JSXElementConstructor } from 'react'
import PetitionListComponent from '../petitions/PetitionListComponent';
import PostListComponent from '../posts/PostListComponent';
import useGetFetch from '../useGetFetch';
import ChangeUserData from './ChangeUserData';

interface UserProfileProps {

}

const UserProfile: JSXElementConstructor<UserProfileProps> = () => {

    // Variables del usuario
    const username = "elPepe";
    const email = "elpepe@unizar.es";
    const zonaSanitaria = "El Arrabal";

    // TODO: el id de usuario debe ser en función del user loggeado
    const { data: petitions, isPending, error } = useGetFetch(`${process.env.REACT_APP_BASEURL}/user/608973ba40f1db3b48fc1044/petitions`);
    
    const posts = [
        { title: 'Titulo del post', body: 'lorem ipsum...', author: 'ElJosé', id: 1, likes: 17 },
        { title: 'Titulo del post', body: 'lorem ipsum...', author: 'ElJosé', id: 2, likes: 17 },
        { title: 'Titulo del post', body: 'lorem ipsum...', author: 'ElJosé', id: 3, likes: 17 }
    ];

    return (
        <div className="container-fluid d-flex justify-content-center card">
            <div className="card-body">
                <div className="row">
                    {/* Columna de datos de usuario */}
                    <div className="col-9">
                        {/* Nombre de usuario */}
                        <div className="input-group">
                            <label htmlFor="username" className="input-group-text">
                                Nombre de usuario
                            </label>
                            <input type="text" id="username" className="form-control" value={username} disabled />
                        </div>
                        {/* Correo del usuario */}
                        <div className="input-group mt-md-4 mt-3">
                            <label htmlFor="useremail" className="input-group-text">
                                Correo electrónico
                            </label>
                            <input type="text" id="useremail" className="form-control" value={email} disabled />
                        </div>
                    </div>
                    {/* Columna de la imagen del usuario */}
                    <div className="col-3 d-flex justify-content-end">
                        <img src="http://www.battelldentureclinic.com/app/webroot/images/userImages/8.jpg"
                            alt="user" className="rounded-circle w-50 border border-secondary border-2" />
                    </div>
                </div>
                <div className="container-fluid px-md-5 px-3 mt-md-4 mt-3 d-flex justify-content-center">
                    {/* Boton de cambio de contraseña */}
                    <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                        Cambiar datos
                    </button>
                    {/* Modal de cambio */}
                    <ChangeUserData />
                </div>
                {/* Lista de Posts */}
                <div className="container-fluid mt-md-4 mt-3">
                    <p className="display-6">Posts:</p>
                    <PostListComponent posts={posts} />
                </div>
                {/* Lista de Peticiones de ayuda */}
                <div className="container-fluid mt-md-4 mt-3">
                    <p className="display-6">Peticiones de ayuda:</p>
                    <PetitionListComponent petitionsInfo={petitions} />
                </div>
            </div>
        </div>
    )
}

export default UserProfile;