import React, { JSXElementConstructor, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useToken from '../auth/Token/useToken'
import Post from './Post';

interface PostListComponentProps {
    posts: Post[];
}


const PostListComponent: JSXElementConstructor<PostListComponentProps> = ({ posts }) => {

    // Token
    const { token } = useToken();

    const handleLike = (id: any) => {
        const valoration = { user: token?.userId };
        fetch(`${process.env.REACT_APP_BASEURL!}/post/` + id + "/possitivevaloration", {
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

    const handleDislike = (id: any) => {
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

    useEffect(() => {
        console.log("Mi estado cambia!")
        return () => { }
    }, [posts]);

    return (
        <div>
            { posts.length > 0 ? posts.map((post: any) => (
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
                                <p className="ms-3">Creado por {post.publisher.userName}</p>
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
                :
                <div style={{ textAlign: "center", verticalAlign: "middle" }}>No se han encontrado posts...</div>
            }
        </div>
    )
}

export default PostListComponent
