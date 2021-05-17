import React, { JSXElementConstructor, useState } from 'react'
import useToken from '../../auth/Token/useToken';

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

    // Token
    const { token } = useToken();
    
    // Ban user
    const banUser = async () => {
        console.log("Banning user with id = " + user._id);
        if (!isBanned) {
            // TODO: Esta URI puede cambiar ya que no tiene tampoco mucho sentido
            await fetch(`${process.env.REACT_APP_BASEURL}/user/${user._id}/ban`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': "application/json",
                        'Authorization': `${token?.type} ${token?.token}`
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

    // Unban user
    const unBanUser = async () => {
        console.log("Un banning user with id = " + user._id);
        if (isBanned) {
            // TODO: Esta URI puede cambiar ya que no tiene tampoco mucho sentido
            await fetch(`${process.env.REACT_APP_BASEURL}/user/${user._id}/ban`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': "application/json",
                        'Authorization': `${token?.type} ${token?.token}`
                    },
                    body: JSON.stringify({
                        banned: false,
                        bannedUntil: new Date(Date.now())
                    })
                }
            )
            setIsBanned(false);
        }
    }

    return (
        <li className="list-group-item d-flex justify-content-between">
            <div className="fw-bold">{user.name}</div>
            <div className="d-flex justify-content-end">
                {!isBanned &&
                    <button className="btn btn-danger" onClick={() => banUser()} disabled={isBanned}>
                        Banear
                    </button>
                }
                {isBanned &&
                    <button className="btn btn-success" onClick={() => unBanUser()} disabled={!isBanned}>
                        Perdonar Ban
                    </button>
                }
            </div>
        </li>
    )
}

export default AdminPageUserTile;
