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
                posts.map((posts: any) => (
                    <Link to={"/postDetalle/" + posts.id} className="custom-card" key={posts.id}>
                        <div className="container-fluid d-flex justify-content-center card mb-4" key={posts.id} >
                            <div className="row row justify-content-between">
                                <div className="col">
                                    <h2 className="ms-3 mt-3"><b>{posts.title}</b></h2>
                                </div>
                                <div className="col-1 sm-12 align-self-center">
                                    <i className="fas fa-chevron-up" onClick={() => handleLike()}></i>
                                </div>
                            </div>
                            <div className="row row justify-content-between">
                                <div className="col">
                                    <p className="ms-3">Creado por {posts.publisher}</p>
                                </div>
                                <div className="col-1 sm-12">
                                    <p> {posts.possitive_valorations.length - posts.negative_valorations.length}</p>
                                </div>
                            </div>
                            <div className="row row justify-content-between">
                                <div className="col">
                                    <p className="ms-3 mt-3"> {posts.body} </p>
                                </div>
                                <div className="col-1 sm-12 align-self-start">
                                    <i className="fas fa-chevron-down" onClick={() => handleDislike(posts)}></i>
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
