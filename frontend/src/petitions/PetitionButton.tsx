import React, { JSXElementConstructor, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import useToken from '../auth/Token/useToken';

interface PetitionButtonProps {
    userAsigned: string;
    userQueue: [string];
    petitionId: string;
    userCreator: string;
    status: string;
}

const PetitionButton: JSXElementConstructor<PetitionButtonProps> = ({ userAsigned , userQueue, petitionId, userCreator, status}) => {
    // Token
    const { token } = useToken();
    
    
    const [bgColorClass, setBgColorClass] = useState<string>("bg-primary");
    const [userStatus, setUserStatus] = useState<string>("No asignado");
    const [userAssign, setUserAssign] = useState<boolean>(true);
    console.log("tamaño cola "+userQueue.length)
    console.log("status "+status)
    // Selección del color del badge
    
    useEffect(() => {
        
        //const fetchRemote = async () => {
            if (token != null && token.userId){
                
                console.log("userAsigned"+userAsigned)
                console.log("userId"+token?.userId)
                if(userAsigned === token?.userId) {
                    setBgColorClass("bg-success");
                    setUserStatus("Asignado")
                    setUserAssign(false)
                    
                } else if (userQueue.includes(token?.userId)) {
                    setBgColorClass("bg-secondary");
                    setUserStatus("En cola")
                    setUserAssign(false)
                    
                } else {
                    setBgColorClass("bg-danger");
                    setUserAssign(true)
                    
                }
            }
        //}
        //fetchRemote();
        return () => {}
    }, [token]);

    // Log out
    const assign = async () => {
        // Cerrar sesión y recargar
        console.log("user "+token?.userId+" asigned to petitionId "+petitionId)

        await fetch(`${process.env.REACT_APP_BASEURL}/petitions/${petitionId}/assign/${token?.userId}`,
                {
                    method: "PUT",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `${token?.type} ${token?.token}`
                    },
                    body: JSON.stringify({
                    })
                }) 
        window.location.reload();
    }


    return (
        <div>
            {/* Boton para asignarse */}
            {userAssign && userCreator!=token?.userId && (userQueue.length<5) && (status.toUpperCase() == "OPEN" || status.toUpperCase() == "ASSIGNED") &&
                <button className="btn btn-danger mx-2"  onClick={assign}>
                Asignarme
            </button>}
            {/* Texto estado */}
            {!userAssign  && userCreator!=token?.userId&& (userQueue.length<5) && 
                <span className={"badge " + bgColorClass}>
                {userStatus}
            </span>}
        </div>
    )
}

export default PetitionButton
