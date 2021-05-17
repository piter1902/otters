import React, { JSXElementConstructor, useEffect, useState } from 'react';
import { useHistory,useParams } from 'react-router';
import { ClipLoader } from 'react-spinners';
import useToken from '../auth/Token/useToken';
import CasosPorFecha from '../estadisticas/CasosPorFecha';
import GraficaCasos from '../estadisticas/GraficaCasos';
import useZBS from '../estadisticas/useZBS';

interface ZbsData {
    _id: string;
    date: Date;
    possitives: number;
}


interface UserProfileProps {

}

const UserProfile: JSXElementConstructor<UserProfileProps> = () => {
    const { id } = useParams<{ id: string }>();

    // Token
    const { token, saveToken } = useToken();

    // Navegacion
    const history = useHistory();

    const [user, setUser] = useState<any>(null);
    const [isPending, setIsPending] = useState<boolean>(true);
    const [zone, setZone] = useState<any>(null);

    

    // Datos de la zona de salud selecionada
    const [datos, setDatos] = useState<ZbsData[]>([]);

     

    console.log("id: "+id);
    
    // Datos del usuario; peticiones; posts;
    useEffect(() => {
        const fetchRemote = async () => {
            const fetchInfo = async (url: string, setFunction: (p: any) => void) => {
                //if (token != null && token.userId) {
                    
                    setIsPending(true);
                    const response = await fetch(url, { method: "GET" });
                    if (response.status === 200) {
                        const dataJson = await response.json();
                        console.log("Para " + url + " el resultado es ");
                        console.log(dataJson);
                        setFunction(dataJson);
                    }
                //}
            }
            setIsPending(true);
            console.log("user")
            await fetchInfo(`${process.env.REACT_APP_BASEURL!}/user/${id}`, setUser);
            setIsPending(false);
            
            
        }
        fetchRemote();
        return () => { }
    }, [id]);

    // Carga de la info de la zona
    useEffect(() => {
        console.log("zona");
        const fetchZone = async () => {
            const fetchInfo = async (url: string, setFunction: (p: any) => void) => {
                if (token != null && token.userId) {
                    setIsPending(true);
                    const response = await fetch(url, { method: "GET" });
                    if (response.status === 200) {
                        const dataJson = await response.json();
                        console.log("Para " + url + " el resultado es ");
                        console.log(dataJson);
                        setFunction(dataJson);
                    }
                }
            }
            setIsPending(true);
            if (user !== null) {
                
                console.log("Buscando info de la zona:" +user.sanitaryZone)
                await fetchInfo(`${process.env.REACT_APP_BASEURL!}/zone/${user.sanitaryZone}`, setZone);
                
            }
            setIsPending(false);
        }
        fetchZone();
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
                    <input type="text" id="useremail" className="form-control" value={"aaa"} disabled />
                </div>
            }
            {!isPending && user && zone && 
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
                            {/* Zona sanitaria */}
                            <div className="input-group mt-md-4 mt-3">
                                <label htmlFor="useremail" className="input-group-text">
                                    Zona sanitaria
                                </label>
                                <input type="text" id="useremail" className="form-control" value={zone.name} disabled />
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
                    
                    {/* Columna de la zona sanitaria seleccionada */}
                    <div className="col-md px-md-3 mt-2">
                        <div className="container-fluid d-flex flex-column justify-content-center">
                            
                            {/* Selector de casos por día y visualizar */}
                            <CasosPorFecha idZona={user.sanitaryZone} setDataFunction={setDatos} />
                        </div>
                        {/* Gráficas */}
                        <GraficaCasos data={datos} />
                    </div>

                    
                    
                </div>
                
            }
        </div>)

}

export default UserProfile;