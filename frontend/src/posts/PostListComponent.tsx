import React, { JSXElementConstructor, useState } from 'react'
import { Link } from 'react-router-dom'

interface PostListComponentProps {
    posts: any[];
}


const PostListComponent: JSXElementConstructor<PostListComponentProps> = ({ posts }) => {

    const [user, setAuthor] = useState('60747f8611ac7b1cc4e45528');

    const handleLike = (id:any) => {
        const valoration = { user };
        fetch(`${process.env.REACT_APP_BASEURL!}/post/` + id + "/posititivevaloration", { 
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(valoration)
        }).then(() => {
            console.log("nueva valoración añadida creado")
          })   
    }

    const handleDislike = (id:any) => {
        const valoration = { user };
        fetch(`${process.env.REACT_APP_BASEURL!}/post/` + id + "/negativevaloration", { 
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(valoration)
        }).then(() => {
            console.log("nueva valoración añadida creado")
          })   
    }

    return (
        <div>
            { posts && posts.map((post: any) => (
                <Link to={"/postDetalle/" + post._id} className="custom-card" key={post._id}>
                    <div className="container-fluid d-flex justify-content-center card mb-4" key={post._id} >
                        <div className="row row justify-content-between">
                            <div className="col">
                                <h2 className="ms-3 mt-3"><b>{post.title}</b></h2>
                            </div>
                            <div className="col-1 sm-12 align-self-center">
                                <i className="fas fa-chevron-up" onClick={() => handleLike(post._id)}></i>
                            </div>
                        </div>
                        <div className="row row justify-content-between">
                            <div className="col">
                                <p className="ms-3">Creado por {post.publisher}</p>
                            </div>
                            <div className="col-1 sm-12">
                                <p> {post.possitive_valorations.length - post.negative_valorations.length}</p>
                            </div>
                        </div>
                        <div className="row row justify-content-between">
                            <div className="col">
                                <p className="ms-3 mt-3"> {post.body} </p>
                            </div>
                            <div className="col-1 sm-12 align-self-start">
                                <i className="fas fa-chevron-down" onClick={() => handleDislike(post._id)}></i>
                            </div>
                        </div>
                    </div>
                </Link>
            ))
            }
        </div>
    )
}

export default PostListComponent
