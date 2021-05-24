import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import useToken from '../auth/Token/useToken';
import useGetFetch from '../useGetFetch';
import ComentarioList from './Comentario';
import './Post.css'
import { Link } from 'react-router-dom';

interface PostDetalleProps {

}

const PostDetalle: React.JSXElementConstructor<PostDetalleProps> = () => {
    const { id } = useParams<{ id: string }>();

    const { data: mainPost, isPending, error } = useGetFetch(`${process.env.REACT_APP_BASEURL}/post/` + id);


    // Token
    const { token } = useToken();

    // Navegación
    const history = useHistory();

    const [userInfo, setUserInfo] = useState<any>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (token != null && token.userId) {
                const response = await fetch(`${process.env.REACT_APP_BASEURL!}/user/${token?.userId}`, { method: "GET" });
                if (response.status === 200) {
                    setUserInfo(await response.json());
                }
            }
        }
        fetchUserInfo();
        return () => { }
    }, [token]);

    // Redirección en caso de error en la carga
    useEffect(() => {
        if (error != null) {
            // Hay error
            history.replace("/error");
        }
        return () => { }
    }, [error, history]);

    const deletePost = async () => {
        // Cerrar sesión y recargar
        console.log("delete post: "+id)

        await fetch(`${process.env.REACT_APP_BASEURL}/post/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `${token?.type} ${token?.token}`
                    },
                    body: JSON.stringify({
                    })
                }) 
    }

    // Cuerpo del comentario
    const [body, setBody] = useState('');

    const handleLike = () => {
        const valoration = { userId: token?.userId };
        fetch(`${process.env.REACT_APP_BASEURL!}/post/` + id + "/possitivevaloration", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `${token?.type} ${token?.token}`
            },
            body: JSON.stringify(valoration)
        }).then(() => {
            console.log("nueva valoración añadida creado")
            console.log(valoration)
        })
    }

    const handleDislike = () => {
        const valoration = { userId: token?.userId };
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
                                    
                                    {mainPost.publisher.userId==token?.userId && 
                                        <Link to={"/cuenta"} className="custom-card" >
                                            <p className="lead texto">{mainPost.publisher.userName}</p>
                                        </Link>
                                    }
                                    {mainPost.publisher.userId!=token?.userId && 
                                        <Link to={"/perfil/" + mainPost.publisher.userId} className="custom-card" >
                                        <p className="lead ms-3 texto">{mainPost.publisher.userName}</p>
                                    </Link>}
                                </div>
                                <div className="col-lg-1 col-md-2 col-3 sm-12">
                                    <p className=" lead texto">{mainPost.possitive_valorations.length - mainPost.negative_valorations.length}</p>
                                </div>
                            </div>

                            <div className="row row justify-content-between">
                                <div className="col">
                                    <p className="ms-3 mt-3 texto">{new Date(mainPost.date).toLocaleDateString("es-ES")} {new Date(mainPost.date).getHours()}:{new Date(mainPost.date).getMinutes()}</p>
                                </div>
                                <div className="col-lg-1 col-md-2 col-3 sm-12 align-self-center">
                                    <i className="fas fa-chevron-down" onClick={handleDislike}></i>
                                </div>
                            </div>
                            <p className="ms-3 mt-3 texto">{mainPost.body}</p>
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
                    {(mainPost.publisher.userId==token?.userId || (userInfo && userInfo.isAdmin))  &&
                    <p className="h2 fw-bold d-flex justify-content-center">
                    <Link to={"/foro"} className="div" >
                        <button className="btn btn-danger mx-2"  onClick={deletePost}>
                            Borrar post
                        </button>
                    </Link>    
                    </p>}
                    <p className="lead texto">Comentarios</p>
                    <ComentarioList mainPost={mainPost} userId={token?.userId} />
                </div>

            )}
        </div>
    )
}

export default PostDetalle;