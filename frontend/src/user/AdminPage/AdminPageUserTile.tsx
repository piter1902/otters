import React, { JSXElementConstructor, useState } from 'react'

interface AdminPageUserTileProps {
    user: {
        _id: string;
        name: string;
        bannedObject: {
            banned: boolean;
        }
    }
}

const AdminPageUserTile: JSXElementConstructor<AdminPageUserTileProps> = ({ user }) => {

    // Estado del usuario
    const [isBanned, setIsBanned] = useState<boolean>(user.bannedObject.banned);

    // Ban user
    const banUser = async () => {
        console.log("Banning user with id = " + user._id);
        if (!isBanned) {
            // TODO: Esta URI puede cambiar ya que no tiene tampoco mucho sentido
            await fetch(`${process.env.REACT_APP_BASEURL}/user/${user._id}`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({
                        banned: true,
                        // Se banea al usuario por 100 días
                        bannedUntil: new Date(Date.now() + (86400000 * 100))
                    })
                }
            )
            setIsBanned(true);
        }
    }

    return (
        <li className="list-group-item d-flex justify-content-between">
            <div className="fw-bold">{user.name}</div>
            <div className="d-flex justify-content-end">
                <button className="btn btn-danger" onClick={() => banUser()} disabled={isBanned}>
                    Banear
                </button>
            </div>
        </li>
    )
}

export default AdminPageUserTile;
