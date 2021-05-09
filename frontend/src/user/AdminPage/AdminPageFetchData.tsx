import React, { useState } from 'react'

const AdminPageFetchData = () => {

    const [isFetching, setisFetching] = useState<boolean>(false);

    const reloadDataSource = () => {
        console.log("Recargando la fuente de datos");
        fetch(`${process.env.REACT_APP_BASEURL}/zone/fetchData`);
        setisFetching(true);
    }

    return (
        <div className="row card mt-md-3 mt-4">
            <div className="card-header">
                <p className="display-5">
                    Fuente de datos
                </p>
            </div>
            <div className="card-body">
                <div className="d-flex justify-content-center">
                    <button className="btn btn-primary rounded-pill" onClick={reloadDataSource}
                        disabled={isFetching}>
                        <p className="text-light mb-0 px-md-4 px-2">
                            Obtener datos
                            <i className="fa fa-refresh ms-3" aria-hidden="true"></i>
                        </p>
                    </button>
                    {isFetching && (
                        <p className="text-light">Se ha enviado la petición de actualización de datos</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminPageFetchData;
