import React, { useState } from 'react';
import CasosPorFecha from './CasosPorFecha';
import GraficaCasos from './GraficaCasos';

interface EstadisticasCovidProps {

}

const EstadisticasCovid: React.JSXElementConstructor<EstadisticasCovidProps> = () => {

    // Zona de salud elegida
    const [zonaSalud, setZonaSalud] = useState<string>("0");

    // Cambio de la zona de salud a visualizar
    const zonaSaludChanged = (event: { target: { value: string; }; }) => {
        setZonaSalud(event.target.value);
    }

    return (
        <div className="container row">
            {/* Columna de la zona sanitaria seleccionada */}
            <div className="col-md px-md-3 mt-2">
                <div className="container-fluid d-flex flex-column justify-content-center">
                    {/* Selector zbs */}
                    <div className="input-group">
                        <label className="input-group-text" htmlFor="zonasaludselect">
                            Zona de Salud
                        </label>
                        <select id="zonasaludselect" className="form-select" value={zonaSalud} onChange={zonaSaludChanged}>
                            <option value="0" disabled>Elige una zona sanitaria</option>
                            <option value="1">zona 1</option>
                            <option value="2">zona 2</option>
                            <option value="3">zona 3</option>
                            <option value="4">zona 4</option>
                        </select>
                    </div>
                    {/* Selector de casos por día y visualizar */}
                    <CasosPorFecha idZona="1234" />
                </div>
                {/* Gráficas */}
                <GraficaCasos />
            </div>
            {/* Columna de Aragón */}
            <div className="col-md px-md-3 mt-md-2 mt-5">
                <div className="container-fluid d-flex flex-column justify-content-center">
                    {/* Selector zbs */}
                    <div className="input-group">
                        <label className="input-group-text" htmlFor="aragontext">
                            Zona de Salud
                        </label>
                        <input type="text" id="aragontext" className="form-control" value="Aragón" disabled />
                    </div>
                    {/* Selector de casos por día y visualizar */}
                    <CasosPorFecha idZona="aragon" />
                </div>
                {/* Gráficas */}
                <GraficaCasos />
            </div>
        </div>
    )
}

export default EstadisticasCovid;