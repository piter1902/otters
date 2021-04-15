import React, { useState } from 'react';
import Comentario from './Comentario';
import './Post.css'

interface PostDetalleProps {

}

const PostDetalle: React.JSXElementConstructor<PostDetalleProps> = () => {

    const [mainPost, setPosts] = useState([
        { title: 'Titulo del post', body: 'jvbc asijvb ajsdnv kasdkvns aaaa aaa aaaaaa.', author: 'ElJosé', id: 1, likes: 17 },
    ])

    const [comentarios, setComents] = useState([
        { body: 'lorem ipsum...', author: 'ElJosé', id: 1 },
        { body: 'lorem ipsum...', author: 'ElJosé', id: 2 },
        { body: 'lorem ipsum...', author: 'ElJosé', id: 3 }
    ])



    return (
        <div className="row card ">
        
        
            <div className="card-body px-3 py-3">
                <div className="row">
                    {mainPost.map(post => (
                        <div className="container-fluid d-flex justify-content-center card border-white mb-4" key={post.id} >

                            <div className="row row justify-content-between">
                                <div className="col">
                                    <h2 className="ms-3 mt-3 texto">{post.title}</h2>
                                </div>
                                <div className="col-lg-1 col-md-2 col-3 sm-12 align-self-center">
                                    <i className="fas fa-chevron-up" ></i>
                                </div>
                            </div>

                            <div className="row row justify-content-between">
                                <div className="col">
                                    <p className="lead ms-3 texto">{post.author}</p>
                                </div>
                                <div className="col-lg-1 col-md-2 col-3 sm-12">
                                    <p className=" lead texto">17</p>
                                </div>
                            </div>

                            <div className="row row justify-content-between">
                                <div className="col">
                                    <p className="ms-3 mt-3 texto">{post.body}</p>
                                </div>
                                <div className="col-lg-1 col-md-2 col-3 sm-12 align-self-center">
                                    <i className="fas fa-chevron-down" ></i>
                                </div>
                            </div>

                            

                            
                            
                            
                              
                        </div>
                    ))}  
                    <p className="lead texto">Comentarios</p>
                    
                </div>
                <Comentario />
                <Comentario />
                <Comentario />
            </div>
        
        
    </div>
    )
}

export default PostDetalle;