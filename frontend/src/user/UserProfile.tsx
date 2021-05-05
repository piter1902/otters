import React, { JSXElementConstructor, useEffect, useMemo, useState } from 'react'
import PetitionListComponent from '../petitions/PetitionListComponent';
import PostListComponent from '../posts/PostListComponent';
import useGetFetch from '../useGetFetch';
import ChangeUserData from './ChangeUserData';


interface UserProfileProps {

}

const UserProfile: JSXElementConstructor<UserProfileProps> = () => {

    // TODO: Cambiar por id de usuario
    const id = "6092b83ce4ac3e3f9662343b";
    const { data: user, isPending } = useGetFetch(`${process.env.REACT_APP_BASEURL}/user/` + id);

    // Imagen del usuario
    const [picture, setPicture] = useState<string>("");
    useEffect(() => {
        if (user) {
            setPicture(`data:image/jpeg;base64,${user.picture}`);
        }
        return () => { }
    }, [user]);


    // Datos sobre las peticiones y los posts
    const { data: dataPosts } = useGetFetch(`${process.env.REACT_APP_BASEURL}/user/` + id + `/posts`);

    const { data: dataPetitions } = useGetFetch(`${process.env.REACT_APP_BASEURL}/user/` + id + `/petitions`);

    return (
        <div className="container-fluid d-flex justify-content-center card">
            {isPending && <div> </div>}
            {!isPending &&
                <div className="card-body">
                    <div className="row">
                        {/* Columna de datos de usuario */}
                        <div className="col-9">
                            {/* Nombre de usuario */}
                            <div className="input-group">
                                <label htmlFor="username" className="input-group-text">
                                    Nombre de usuario
                            </label>
                                <input type="text" id="username" className="form-control" value={user.name} disabled />
                            </div>
                            {/* Correo del usuario */}
                            <div className="input-group mt-md-4 mt-3">
                                <label htmlFor="useremail" className="input-group-text">
                                    Correo electrónico
                            </label>
                                <input type="text" id="useremail" className="form-control" value={user.email} disabled />
                            </div>
                        </div>
                        {/* Columna de la imagen del usuario */}
                        <div className="col-3 d-flex justify-content-end">

                            {/*<img src="http://www.battelldentureclinic.com/app/webroot/images/userImages/8.jpg"
                            alt="user" className="rounded-circle w-50 border border-secondary border-2" />*/}
                            <img src={picture} alt="user" className="rounded-circle w-50 border border-secondary border-2" />
                            {/*<img src={data}
                            alt="user" className="rounded-circle w-50 border border-secondary border-2" />*/}

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
                        <PostListComponent posts={dataPosts} />
                    </div>
                    {/* Lista de Peticiones de ayuda */}
                    <div className="container-fluid mt-md-4 mt-3">
                        <p className="display-6">Peticiones de ayuda:</p>
                        <PetitionListComponent petitionsInfo={dataPetitions} />
                    </div>
                </div>
            }
        </div>)

}

export default UserProfile;