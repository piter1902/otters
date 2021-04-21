import React, { JSXElementConstructor, useEffect, useState } from 'react'

// Modelos
interface ZbsData {
    _id: string;
    date: Date;
    possitives: number;
}

interface ZbsWithData {
    _id: string;
    name: string;
    updatedAt: Date;
    data: ZbsData[];
}

// Props
interface CasosPorFechaProps {
    idZona: string;
    setDataFunction: (d: ZbsData[]) => void;
}

const CasosPorFecha: JSXElementConstructor<CasosPorFechaProps> = ({ idZona, setDataFunction }) => {

    // Datos para la zona sanitaria
    const [datos, setDatos] = useState<ZbsWithData>();

    // Fecha de los datos
    const [date, setDate] = useState<Date>(new Date());

    // Casos para la fecha (date) seleccionada
    const [casos, setCasos] = useState<number>(0);

    // Para ver si se tienen datos de la fecha
    const [hasStarted, setHasStarted] = useState<boolean>(false);

    // Obtención de los casos por la zona de salud seleccionada
    useEffect(() => {
        const fetchDataForSelectedZBS = async () => {
            const response = await fetch(`http://localhost:8080/zone/${idZona}`, { method: "GET" });
            if (response.status == 200) {
                // Respuesta correcta, cargamos los datos
                const jsonData = await response.json();
                setDatos(jsonData);
                // Se devuelven los datos al estado del componente padre
                setDataFunction(jsonData.data);
            }
        }
        if (idZona != "0") {
            // Si se ha escogido una zona -> en caso de no es 0
            fetchDataForSelectedZBS();
        }
        return () => { }
    }, [idZona]);

    // Control del cambio de fecha
    const dateChange = (event: { target: { value: string; }; }) => {
        const selected = new Date(Date.parse(event.target.value));
        console.log(selected.toString());
        if (datos !== undefined) {
            const casos = datos.data.filter((d) =>
                (new Date(Date.parse(d.date.toString().substr(0, 10)))).getTime() == selected.getTime()
            );
            setDate(selected);
            setHasStarted(true);
            if (casos.length !== 0) {
                // console.log("Hay casos. Numero de positivos " + casos[0].possitives);
                // Hay casos -> Nos quedamos con el primero
                setCasos(casos[0].possitives);
            } else {
                // No hay coincidencias -> 0 casos
                setCasos(0);
            }
        }
    }

    return (
        <div className="row card mt-md-4 mt-3">
            <div className="card-body px-3 py-3">
                {/* Selector de fechas */}
                <div className="input-group">
                    <label htmlFor="fechacasos" className="input-group-text">
                        Casos a día
                    </label>
                    <input type="date" id="fechacasos" className="form-control" onChange={dateChange} 
                    disabled={datos == undefined}/>
                </div>
                {/* Casos */}
                <div className="container-fluid d-flex justify-content-center mt-3">
                    {/* Hay datos */}
                    {hasStarted && (
                        <p className="display-4 fw-bold">
                            {casos}
                        </p>
                    )
                    }
                </div>
            </div>
        </div>
    )
}

export default CasosPorFecha;