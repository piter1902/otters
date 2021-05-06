import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import useGetFetch from '../useGetFetch';
import Comentario from './Comentario';
import './Post.css'

interface PostDetalleProps {

}

const PostDetalle: React.JSXElementConstructor<PostDetalleProps> = () => {
    const { id } = useParams<{ id: string }>();
    // const [mainPost, setPosts] = useState([
    //     { title: 'Titulo del post', body: 'jvbc asijvb ajsdnv kasdkvns aaaa aaa aaaaaa.', author: 'ElJosé', id: 1, likes: 17 },
    // ])

    // const [comentarios, setComents] = useState([
    //     { body: 'lorem ipsum...', author: 'ElJosé', id: 1 },
    //     { body: 'lorem ipsum...', author: 'ElJosé', id: 2 },
    //     { body: 'lorem ipsum...', author: 'ElJosé', id: 3 }
    // ])

    const { data: mainPost, isPending, error } = useGetFetch(`${process.env.REACT_APP_BASEURL}/post/` + id);

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
                                    <i className="fas fa-chevron-up" ></i>
                                </div>
                            </div>

                            <div className="row row justify-content-between">
                                <div className="col">
                                    <p className="lead ms-3 texto">{mainPost.publisher}</p>
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
                                    <i className="fas fa-chevron-down" ></i>
                                </div>
                            </div>
                            
                              
                        </div>
                    <p className="lead texto">Comentarios</p>
                    
                </div>
                <Comentario />
                <Comentario />
                <Comentario />
            </div>
        
        )}
    </div>
    )
}

export default PostDetalle;