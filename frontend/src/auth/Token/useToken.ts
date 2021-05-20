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
        } else {
            setToken(null)
        }
    }, []);

    // Resuscripción a los eventos de localStorage en cada renderizado
    useEffect(() => {
        const localStorageChangeHandler = (e: StorageEvent) => {
            console.log("holii")
            console.log(e);
            if (e.storageArea === localStorage && e.key === "token" && e.newValue !== null) {
                console.log("El token se recarga");
                setToken(JSON.parse(e.newValue));
            } else if (e.newValue == null) {
                // Es null -> borramos
                console.log("LocalStorageEventHandler -> e.newValue soy null")
                setToken(null);
            }
        }
        // Suscripción a los eventos del localStorage
        window.addEventListener('storage', localStorageChangeHandler);
        return () => {
            window.removeEventListener('storage', localStorageChangeHandler);
        };
    })

    return { token, saveToken };
}

export default useToken;