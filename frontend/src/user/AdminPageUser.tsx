import React, { JSXElementConstructor, useEffect, useState } from 'react'

interface AdminPageUserProps {
    registrados: number;
    verificados: number;
}

const AdminPageUser: JSXElementConstructor<AdminPageUserProps> = ({ registrados, verificados }) => {

    // Cadena de busqueda
    const [searchUsername, setSearchUsername] = useState<string>("");

    // Resultados de la búsqueda
    const [listUsers, setListUsers] = useState<any[]>([]);

    // Busqueda de los usuarios
    const searchForUsers = async () => {
        const usersResponse = await fetch(`${process.env.REACT_APP_BASEURL}/user`);
        const users = await usersResponse.json();
        setListUsers((users as any[]).filter((user) => user.name.match(searchUsername)));
    }

    // Ban user
    const banUser = async (userId: string) => {
        console.log("Banning user with id = " + userId);

    }

    return (
        <div className="row card mt-md-3 mt-4">
            <div className="card-header">
                <p className="display-5">
                    Usuarios
                </p>
            </div>
            <div className="card-body">
                <div className="row">
                    <ul className="list-group">
                        <li className="list-group-item">
                            <span className="fw-bold">Usuarios registrados: </span>
                            {registrados}
                        </li>
                        <li className="list-group-item">
                            <span className="fw-bold">Usuarios verificados: </span>
                            {verificados}
                        </li>
                    </ul>
                </div>
                {/* Búsqueda de usuario para banear */}
                <div className="row mt-3">
                    <ul className="list-group">
                        <li className="list-group-item">
                            <div className="input-group">
                                <input type="text" placeholder="username" id="usernamesearch" className="form-control"
                                    aria-label="Recipient's username" aria-describedby="usernamesearch-button"
                                    onChange={(e) => setSearchUsername(e.target.value)} />
                                <button className="btn btn-outline-primary" id="usernamesearch-button" onClick={searchForUsers}>
                                    <i className="fa fa-search" aria-hidden="true"></i>
                                </button>
                            </div>
                        </li>
                        <li className="list-group-item">
                            <ul className="list-group" style={{ overflowY: "scroll", height: "500px" }}>
                                {
                                    listUsers.length != 0 &&
                                    listUsers.map((user) => (
                                        <li className="list-group-item d-flex justify-content-between" key={user._id}>
                                            <div className="fw-bold">{user.name}</div>
                                            <div className="d-flex justify-content-end">
                                                <button className="btn btn-danger" onClick={() => banUser(user._id)}>
                                                    Banear
                                                </button>
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default AdminPageUser;
