import React from 'react'

const NotFoundComponent = () => {
    return (
        <div className="container-fluid d-flex justify-content-center card">
            <div className="card-body">
                <h1>Error 404</h1>
                <p style={{ justifyContent: "true" }}>
                    No se ha encontrado el recurso que buscabas
                </p>
                <img src={"./otter-background.png"} alt="Otter image" style={{width: "500px"}} />
            </div>
        </div>
    )
}

export default NotFoundComponent
