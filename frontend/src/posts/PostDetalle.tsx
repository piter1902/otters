import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import useToken from '../auth/Token/useToken';
import useGetFetch from '../useGetFetch';
import Comentario from './Comentario';
import './Post.css'

interface PostDetalleProps {

}

const PostDetalle: React.JSXElementConstructor<PostDetalleProps> = () => {
    const { id } = useParams<{ id: string }>();

    const { data: mainPost, isPending, error } = useGetFetch(`${process.env.REACT_APP_BASEURL}/post/` + id);

    // Token
    const { token } = useToken();

    // Navegación
    const history = useHistory();

    // Redirección en caso de error en la carga
    useEffect(() => {
        if (error != null) {
            // Hay error
            history.replace("/error");
        }
        return () => { }
    }, [error]);

    // Cuerpo del comentario
    const [body, setBody] = useState('');

    const handleLike = () => {
        const valoration = { user: token?.userId };
        fetch(`${process.env.REACT_APP_BASEURL!}/post/` + id + "/positivevaloration", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `${token?.type} ${token?.token}`
            },
            body: JSON.stringify(valoration)
        }).then(() => {
            console.log("nueva valoración añadida creado")
        })
    }

    const handleDislike = () => {
        const valoration = { user: token?.userId };
        fetch(`${process.env.REACT_APP_BASEURL!}/post/` + id + "/negativevaloration", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `${token?.type} ${token?.token}`
            },
            body: JSON.stringify(valoration)
        }).then(() => {
            console.log("nueva valoración añadida creado")
        })
    }

    const handleComment = () => {
        const comment_complete = {
            publisherId: token?.userId,
            body,
            date: new Date()
        };
        fetch(`${process.env.REACT_APP_BASEURL!}/post/` + id + "/comment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `${token?.type} ${token?.token}`
            },
            body: JSON.stringify(comment_complete)
        }).then(() => {
            console.log("nuevo comentario añadida creado")
        })
    }

    return (
        <div className="row card ">
            <div style={{ textAlign: "center", verticalAlign: "middle" }}>
                <ClipLoader color="#172c48" loading={isPending} size={50} />
            </div>
            {/* Loading text */}
            {isPending && <div style={{ textAlign: "center", verticalAlign: "middle" }}>Loading ...</div>}
            {/* Show error if exists */}
            { error && <div style={{ textAlign: "center", verticalAlign: "middle" }}>{error}</div>}
            {!isPending && (
                <div className="card-body px-3 py-3">
                    <div className="row">
                        <div className="container-fluid d-flex justify-content-center card border-white mb-4" >

                            <div className="row row justify-content-between">
                                <div className="col">
                                    <h2 className="ms-3 mt-3 texto fw-bold">{mainPost.title}</h2>
                                </div>
                                <div className="col-lg-1 col-md-2 col-3 sm-12 align-self-center">
                                    <i className="fas fa-chevron-up" onClick={handleLike}></i>
                                </div>
                            </div>

                            <div className="row row justify-content-between">
                                <div className="col">
                                    <p className="lead ms-3 texto">{mainPost.publisher.userName}</p>
                                </div>
                                <div className="col-lg-1 col-md-2 col-3 sm-12">
                                    <p className=" lead texto">{mainPost.possitive_valorations.length - mainPost.negative_valorations.length}</p>
                                </div>
                            </div>

                            <div className="row row justify-content-between">
                                <div className="col">
                                    <p className="ms-3 mt-3 texto">{mainPost.body}</p>
                                </div>
                                <div className="col-lg-1 col-md-2 col-3 sm-12 align-self-center">
                                    <i className="fas fa-chevron-down" onClick={handleDislike}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    {token != null &&
                        <form onSubmit={handleComment}>
                            <div className="mt-4">
                                <textarea id="TextArea" className="form-control" placeholder="Escriba el comentario..." required value={body} onChange={(e) => setBody(e.target.value)}></textarea>
                            </div>
                            <div className="row justify-content-center">
                                <div className="col d-grid gap-2 d-md-flex justify-content-md-center">
                                    <button type="submit" className="btn navbar-azul text-light text-decoration-none mt-4">
                                        Añadir comentario<i className="fas fa-plus ms-2"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                    }
                    <p className="lead texto">Comentarios</p>
                    <Comentario mainPost={mainPost} />
                </div>

            )}
        </div>
    )
}

export default PostDetalle;