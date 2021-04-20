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
            const response = await fetch(`${baseURL}/zone`, {method: "GET"});
            if (response.status == 200) {
                // Nos devuelve las zonas sanitarias
                const jsonBody = await response.json();
                setZones(jsonBody);
            }
        };

        fetchZones();
        return () => {}
    }, [])

    return zones;
}

export default useZBS;