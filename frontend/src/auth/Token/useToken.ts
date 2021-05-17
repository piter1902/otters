import { useEffect, useState } from "react";
import Token from "./Token";

const useToken = () => {

    // const [firstTime, setFirstTime] = useState<boolean>(true);

    const [token, setToken] = useState<Token | undefined | null>(undefined);

    // Save token to localstorage
    const saveToken = (t: Token | null) => {
        // Modificación del localstorage dependiendo del valor de token
        console.log("Almacenando token con valor = ")
        // console.log(t);
        setToken(t);
        if (t == null) {
            // Se borra todo el almacenamiento
            localStorage.clear();
            // setFirstTime(true);
        } else {
            // Se guarda el token en el almacenamiento
            localStorage.setItem("token", JSON.stringify(t));
        }
    }

    useEffect(() => {
        console.log("Cargando token...")
        // Carga de los datos
        const tokenString = localStorage.getItem("token");
        console.log(tokenString)
        if (tokenString !== null) {
            setToken(JSON.parse(tokenString) as Token);
            // setFirstTime(false);
        }else{
            setToken(null)
        }

        return () => { }
    }, []);

    return { token, saveToken };
}

export default useToken;