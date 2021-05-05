import React, { JSXElementConstructor } from 'react'
import PetitionListComponent from '../petitions/PetitionListComponent';
import PostListComponent from '../posts/PostListComponent';
import ChangeUserData from './ChangeUserData';
import useGetFetch from '../useGetFetch';


interface UserProfileProps {

}

const UserProfile: JSXElementConstructor<UserProfileProps> = () => {

    // Variables del usuario

    //Cambiar por id de usuario
    const id = "608ee32beb584f654c7dea6d";
    const { data: user } = useGetFetch(`${process.env.REACT_APP_BASEURL}/user/` + id);

    const username = (user as any).name;
    console.log('username' + username);
    const email = (user as any).email;
    const zonaSanitariaID = (user as any).sanitaryZone;
    console.log("ZS1 " + zonaSanitariaID);
    const picture = (user as any).picture;


    const picture2 = `data:image/jpeg;base64,${picture}`;


    //const { data: zona, error:error2, isPending:isPending2 } = useGetFetch(`${process.env.REACT_APP_BASEURL}/zone/` + zonaSanitariaID);
    var { data: dataPosts } = useGetFetch(`${process.env.REACT_APP_BASEURL}/user/` + id + `/posts`);

    console.log(dataPosts);


    const { data: dataPetitions } = useGetFetch(`${process.env.REACT_APP_BASEURL}/user/` + id + `/petitions`);

    //const zonaSanitaria = (zona as any).name;


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

                        {/*<img src="http://www.battelldentureclinic.com/app/webroot/images/userImages/8.jpg"
                            alt="user" className="rounded-circle w-50 border border-secondary border-2" />*/}
                        <img src={picture2} alt="user" className="rounded-circle w-50 border border-secondary border-2" />
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
                    <PetitionListComponent petitions={dataPetitions} />
                </div>
            </div>
        </div>
    )
}

export default UserProfile;