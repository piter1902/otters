import React, { useState } from 'react';
import useGetFetch from '../useGetFetch';
import './Post.css'

interface ComentarioProps {
    mainPost: any
}

const Comentario: React.JSXElementConstructor<ComentarioProps> = ({mainPost}) => {

    const { data: comments, isPending, error } = useGetFetch(`${process.env.REACT_APP_BASEURL}/post/` + mainPost._id + "/comment");



    return (
        
        <div className="row card mt-md-4 mt-3">
            { comments && comments.map((comment: any) => (
            <div className="card-body px-3 py-3">
                
            <p className="lead texto">{comment.publisher.userName}</p>
            <p className="texto">{comment.body}</p>
                
                    
            </div>
            ))}
        </div>
        
    
    )
}

export default Comentario;