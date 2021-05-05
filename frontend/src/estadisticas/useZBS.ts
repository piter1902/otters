import { useEffect, useState } from "react";

interface ZbsWithoutData {
    _id: string;
    name: string;
    updatedAt: Date;
}

const useZBS = (baseURL: string) => {
    const [zones, setZones] = useState<ZbsWithoutData[]>([]);

    useEffect(() => {
        const fetchZones = async () => {
            const response = await fetch(`${baseURL}/zone`, { method: "GET" });
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

        fetchZones();
        return () => { }
    }, [baseURL]);

    return zones;
}

export default useZBS;