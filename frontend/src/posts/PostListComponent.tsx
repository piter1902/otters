import React, { JSXElementConstructor } from 'react'
import { Link } from 'react-router-dom'

interface PostListComponentProps {
    posts: any[];
}


const PostListComponent: JSXElementConstructor<PostListComponentProps> = ({ posts }) => {

    const handleDislike = (post: any) => {
        console.log("Dislike");
    }

    const handleLike = () => {
        console.log("Like");
    }

    return (
        <div>
            {
                posts.map((post: any) => (
                    <Link to="/postDetalle" className="custom-card" key={post.id}>
                        <div className="container-fluid d-flex justify-content-center card mb-4" key={post.id} >
                            <div className="row row justify-content-between">
                                <div className="col">
                                    <h2 className="ms-3 mt-3"><b>{post.title}</b></h2>
                                </div>
                                <div className="col-1 sm-12 align-self-center">
                                    <i className="fas fa-chevron-up" onClick={() => handleLike()}></i>
                                </div>
                            </div>
                            <div className="row row justify-content-between">
                                <div className="col">
                                    <p className="ms-3">Creado por {post.author}</p>
                                </div>
                                <div className="col-1 sm-12">
                                    <p> {post.likes}</p>
                                </div>
                            </div>
                            <div className="row row justify-content-between">
                                <div className="col">
                                    <p className="ms-3 mt-3"> {post.body} </p>
                                </div>
                                <div className="col-1 sm-12 align-self-start">
                                    <i className="fas fa-chevron-down" onClick={() => handleDislike(post)}></i>
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