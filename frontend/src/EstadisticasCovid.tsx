import React from 'react';

interface EstadisticasCovidProps {

}

const EstadisticasCovid: React.JSXElementConstructor<EstadisticasCovidProps> = () => {
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
                        <select id="zonasaludselect" className="form-select">
                            <option selected disabled>Elige una zona sanitaria</option>
                            <option value="1">zona 1</option>
                            <option value="2">zona 2</option>
                            <option value="3">zona 3</option>
                            <option value="4">zona 4</option>
                        </select>
                    </div>
                    {/* Selector de casos por día y visualizar */}
                    <div className="row card mt-md-4 mt-3">
                        <div className="card-body px-3 py-3">
                            {/* Selector de fechas */}
                            <div className="input-group">
                                <label htmlFor="fechacasosselect" className="input-group-text">
                                    Casos a día
                                </label>
                                <select id="fechacasosselect" className="form-select">
                                    <option selected disabled>Elige la fecha</option>
                                    <option value="1">fecha 1</option>
                                    <option value="2">fecha 2</option>
                                    <option value="3">fecha 3</option>
                                    <option value="4">fecha 4</option>
                                </select>
                            </div>
                            {/* Casos */}
                            <div className="container-fluid d-flex justify-content-center mt-3">
                                <p className="display-4 fw-bold">
                                    55
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Gráficas */}
                    <div className="card mt-4">
                        <div className="card-body">
                            <p className="display-1">
                                Gráfica aquí
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Columna de Aragón */}
            <div className="col-md px-md-3 mt-md-2 mt-5">
                <div className="container-fluid d-flex flex-column justify-content-center">
                    {/* Selector zbs */}
                    <div className="input-group">
                        <label className="input-group-text" htmlFor="aragontext">
                            Zona de Salud
                        </label>
                        <input type="text" id="aragontext" className="form-control" value="Aragón" disabled/>
                    </div>
                    {/* Selector de casos por día y visualizar */}
                    <div className="row card mt-md-4 mt-3">
                        <div className="card-body px-3 py-3">
                            {/* Selector de fechas */}
                            <div className="input-group">
                                <label htmlFor="fechacasosselect" className="input-group-text">
                                    Casos a día
                                </label>
                                <select id="fechacasosselect" className="form-select">
                                    <option selected disabled>Elige la fecha</option>
                                    <option value="1">fecha 1</option>
                                    <option value="2">fecha 2</option>
                                    <option value="3">fecha 3</option>
                                    <option value="4">fecha 4</option>
                                </select>
                            </div>
                            {/* Casos */}
                            <div className="container-fluid d-flex justify-content-center mt-3">
                                <p className="display-4 fw-bold">
                                    55
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Gráficas */}
                    <div className="card mt-4">
                        <div className="card-body">
                            <p className="display-1">
                                Gráfica aquí
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EstadisticasCovid;