import React, { useState } from 'react';

interface PeticionDetalleProps {
    
}

const PeticionDetalle: React.JSXElementConstructor<PeticionDetalleProps> = () => {

    



    return (
        <div className="row card mt-md-4 mt-3">
        {/* Columna de la zona sanitaria seleccionada */}
        
            <div className="card-body px-3 py-3">
                <p className="h2 fw-bold">Titulo de petición</p>
                <p className="lead ">Creado por ElJosé</p>

                <p >jvbcasijvbajsdnvkasdkvnsakvnkasnkvnaskvnksavnkasdnvkasnvksandvknsadv aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.</p>
                
                <p className="lead ">Lugar: Alrededores de calle Pepito</p>
                <p className="lead ">Fecha: 24/03/21</p>
                <p className="lead ">Hora: 10:00-12:00</p>
                <p className="lead ">Urgente: Si</p>
                <p className="lead ">Correo electrónico: pepe@unizar.es</p>
            </div>
        </div>
        
  
    )
}

export default PeticionDetalle;