import { useEffect, useState } from "react";
import useToken from "../auth/Token/useToken";

interface ZbsWithoutData {
    _id: string;
    name: string;
    updatedAt: Date;
}

const useZBS = (baseURL: string) => {
    const [zones, setZones] = useState<ZbsWithoutData[]>([]);

    // Token
    const { token } = useToken();

    useEffect(() => {
        const fetchZones = async () => {
            const response =
                await fetch(`${baseURL}/zone`,
                    {
                        method: "GET",
                        headers: { 'Authorization': `${token?.type} ${token?.token}` }
                    });
            if (response.status === 200) {
                // Nos devuelve las zonas sanitarias
                let jsonBody = await response.json();

                // Busqueda de nombres duplicados
                const zbsArray: any[] = [];
                jsonBody.forEach((element: { name: string; }) => {
                    const matched = zbsArray.find((value) => value.name === element.name);
                    if (matched === undefined) {
                        // El elemento no existe, lo añadimos
                        zbsArray.push(element);
                    }
                });

                setZones(zbsArray.sort((zbs1, zbs2) => zbs1.name < zbs2.name ? -1 : 1));
            }
        };
        if (token !== null && token !== undefined) {
            fetchZones();
        }
        return () => { }
    }, [baseURL, token]);

    return zones;
}

export default useZBS;