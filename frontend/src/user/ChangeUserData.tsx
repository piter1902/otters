import React, { JSXElementConstructor, useState } from 'react'
import useGetFetch from '../useGetFetch';
import useZBS from '../estadisticas/useZBS';
import Token from '../auth/Token/Token';

interface ChangeUserDataProps {
    token?: Token,
    user: any
}


const ChangeUserData: JSXElementConstructor<ChangeUserDataProps> = ({ user, token }) => {

    const [passwordAct, setPasswordAct] = useState("");
    const [passwordNue, setPasswordNue] = useState("");
    const [zone, setZone] = useState("");

    // Datos sobre la foto
    let picData: any;

    const zonasSalud = useZBS(process.env.REACT_APP_BASEURL!);

    function getBase64(file: any) {
        //console.log("pic "+file);
        var reader = new FileReader();
        reader.readAsDataURL(file[0]);
        reader.onload = function () {
            console.log("reader" + reader.result);
            picData = reader.result;
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }


    // Accion de cambiar la contraseña
    const changeDataButtonClicked = async () => {
        console.log("Cambiar datos");
        /*console.log("contraseña actual "+passwordActual);
        console.log("contraseña por user "+passwordAct);
        console.log("contraseña nueva "+passwordNue);
        console.log("pic "+picture);*/
        //var file = new File([picture], picture, {type: 'image/jpeg'});
        //const { data: picData, error, isPending } = await getBase64(file);
        console.log("zona " + zone);
        let data = picData && picData || "";
        data = data.split("data:image/jpeg;base64,").pop();
        data = data.split("data:image/jpg;base64,").pop();
        data = data.split("data:image/png;base64,").pop();
        console.log("picData " + picData);
        console.log("data " + data);
        if (user.password === passwordAct) {
            console.log("Las contraseñas coinciden");
            const result = await fetch(`${process.env.REACT_APP_BASEURL}/user/${token?.userId}`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `${token?.type} ${token?.token}`
                    },
                    body: JSON.stringify({
                        password: passwordNue,
                        picture: data,
                        sanitaryZone: zone
                    })
                })
        } else {
            console.log("Las contraseñas no coinciden");
        }

    }

    return (
        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Cambiar datos</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {/* Cambio de contraseña */}
                        <div className="card">
                            <div className="card-header">
                                Cambio de contraseña
                                        </div>
                            <div className="card-body">
                                {/* Contraseña vieja */}
                                <div className="input-group">
                                    <label htmlFor="oldPass" className="input-group-text">
                                        Contraseña actual
                                                </label>
                                    <input type="password" id="oldPass" className="form-control" onChange={e => setPasswordAct(e.target.value)} required />
                                    <div className="invalid-feedback">
                                        Looks good!
                                    </div>

                                </div>
                                {/* Contraseña nueva */}
                                <div className="input-group mt-3">
                                    <label htmlFor="newPass" className="input-group-text">
                                        Contraseña nueva
                                                </label>
                                    <input type="password" id="newPass" className="form-control" onChange={e => setPasswordNue(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        {/* Cambio de zona sanitaria */}
                        <div className="card mt-3">
                            <div className="card-body">
                                <div className="input-group">
                                    <label htmlFor="zonasanitariaselect" className="input-group-text">
                                        Zona sanitaria
                                                </label>
                                    {/*<select id="zonasanitariaselect" className="form-control" value="id1">
                                                    <option value="id1">El Arrabal</option>
                                                    <option value="id2">Huesca</option>
                                                    <option value="id3">Ejea</option>
                                                    <option value="id4">Huesca Rural</option>
                                                </select>*/}
                                    <select id="zonasanitariaselect" className="form-control" onChange={e => setZone(e.target.value)}>
                                        {
                                            zonasSalud.sort((zbs1, zbs2) => zbs1.name < zbs2.name ? -1 : 1).map((zbs) => (
                                                <option value={zbs._id} key={zbs._id}>{zbs.name}</option>
                                            ))
                                        }
                                    </select>

                                </div>
                            </div>
                        </div>
                        {/* Cambio de zona imagen */}
                        <div className="card mt-3">
                            <div className="card-header">
                                Cambio de imagen
                            </div>
                            <div className="card-body">
                                <div className="input-group">
                                    <input type="file" name="image" id="formFile" className="form-control-file" accept=".jpg, .jpeg, .png" onChange={e => getBase64(e.target.files)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" className="btn btn-success" onClick={changeDataButtonClicked} data-bs-dismiss="modal" >Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangeUserData;