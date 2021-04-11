import React, { JSXElementConstructor, useState } from 'react'

interface CasosPorFechaProps {
    idZona: string;
}

const CasosPorFecha: JSXElementConstructor<CasosPorFechaProps> = ({ idZona }) => {

    // Fecha de los datos
    const [date, setDate] = useState<Date>(new Date());

    const [hasData, setHasData] = useState<boolean>(false);

    const dateChange = (event: { target: { value: string; }; }) => {
        console.log(event.target.value);
        if (!hasData) {
            setHasData(true);
        }
        setDate(new Date(Date.parse(event.target.value)));
    }

    return (
        <div className="row card mt-md-4 mt-3">
            <div className="card-body px-3 py-3">
                {/* Selector de fechas */}
                <div className="input-group">
                    <label htmlFor="fechacasos" className="input-group-text">
                        Casos a día
                    </label>
                    <input type="date" id="fechacasos" className="form-control" onChange={dateChange} />
                </div>
                {/* Casos */}
                <div className="container-fluid d-flex justify-content-center mt-3">
                    {/* Hay datos */}
                    {hasData && (
                        <p className="display-4 fw-bold">
                            55
                        </p>
                    )
                    }
                    {/* No hay datos */}
                    {!hasData && (
                        <p className="text-danger fw-bold">Seleccione una fecha</p>
                    )
                    }
                </div>
            </div>
        </div>
    )
}

export default CasosPorFecha;