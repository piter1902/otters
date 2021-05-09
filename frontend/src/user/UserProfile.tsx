import React, { JSXElementConstructor, useEffect, useMemo, useState } from 'react'
import { ClipLoader } from 'react-spinners';
import useToken from '../auth/Token/useToken';
import PetitionListComponent from '../petitions/PetitionListComponent';
import PostListComponent from '../posts/PostListComponent';
import useGetFetch from '../useGetFetch';
import ChangeUserData from './ChangeUserData';


interface UserProfileProps {

}

const UserProfile: JSXElementConstructor<UserProfileProps> = () => {

    // Token
    const { token } = useToken();

    const [user, setUser] = useState<any>(null);
    const [isPending, setIsPending] = useState<boolean>(true);

    // Datos sobre las peticiones y los posts
    const [dataPosts, setDataPosts] = useState<any[]>([]);
    const [dataPetitions, setDataPetitions] = useState<any[]>([]);

    // Datos del usuario; peticiones; posts;
    useEffect(() => {
        const fetchRemote = async () => {
            const fetchInfo = async (url: string, setFunction: (p: any) => void) => {
                if (token != null && token.userId) {
                    setIsPending(true);
                    const response = await fetch(url, { method: "GET" });
                    if (response.status == 200) {
                        const dataJson = await response.json();
                        console.log("Para " + url + " el resultado es ");
                        console.log(dataJson);
                        setFunction(dataJson);
                    }
                }
            }
            setIsPending(true);
            await fetchInfo(`${process.env.REACT_APP_BASEURL!}/user/${token?.userId}`, setUser);
            setIsPending(false);
        }
        fetchRemote();
        return () => { }
    }, [token]);

    // Carga de la lista de posts y peticiones
    useEffect(() => {
        const fetchUserPetitionsAndPosts = async () => {
            const fetchInfo = async (url: string, setFunction: (p: any) => void) => {
                if (token != null && token.userId) {
                    setIsPending(true);
                    const response = await fetch(url, { method: "GET" });
                    if (response.status == 200) {
                        const dataJson = await response.json();
                        console.log("Para " + url + " el resultado es ");
                        console.log(dataJson);
                        setFunction(dataJson);
                    }
                }
            }
            setIsPending(true);
            if (user !== null) {
                if (user.posts != []) {
                    console.log("La lista de peticiones no es vacia")
                    await fetchInfo(`${process.env.REACT_APP_BASEURL!}/user/${token?.userId}/posts`, setDataPosts);
                }
                if (user.petitions != []) {
                    console.log("La lista de posts no es vacia")
                    await fetchInfo(`${process.env.REACT_APP_BASEURL!}/user/${token?.userId}/petitions`, setDataPetitions);
                }
            }
            setIsPending(false);
        }
        fetchUserPetitionsAndPosts();
        return () => { }
    }, [user])

    // Imagen del usuario
    const [picture, setPicture] = useState<string>("");
    useEffect(() => {
        if (user) {
            setPicture(`data:image/jpeg;base64,${user.picture}`);
        }
        return () => { }
    }, [user]);

    return (
        <div className="container-fluid d-flex justify-content-center card">
            {isPending &&
                <div style={{ textAlign: "center", verticalAlign: "middle" }}>
                    <ClipLoader color="#172c48" loading={isPending} size={50} />
                </div>
            }
            {!isPending && user &&
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
                        <ChangeUserData user={user} token={token ?? undefined} />
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