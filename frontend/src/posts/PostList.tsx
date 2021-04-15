import { useState } from "react";
import '../Navbar.css'
import { Link } from 'react-router-dom';

export interface PostListProps {

}

const PostList: React.JSXElementConstructor<PostListProps> = () => {

    const [posts, setPosts] = useState([
        { title: 'Titulo del post', body: 'lorem ipsum...', author: 'ElJosé', id: 1, likes: 17 },
        { title: 'Titulo del post', body: 'lorem ipsum...', author: 'ElJosé', id: 2, likes: 17 },
        { title: 'Titulo del post', body: 'lorem ipsum...', author: 'ElJosé', id: 3, likes: 17 }
    ])

    const handleDislike = (post: any) => {
        console.log("Dislike");
    }
    const handleLike = () => {
        console.log("Like");
    }

    return (
        <div >
            <div className="container-fluid mb-4 mt-4">
                <div className="row justify-content-between">
                    <div className="col-4">
                        <Link to="/createPost" >
                            <button className="btn navbar-azul text-light text-decoration-none" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                Añadir post <i className="fas fa-plus ms-2"></i>
                            </button>
                        </Link>
                    </div>
                    <div className="col-4 d-grid gap-2 d-md-flex justify-content-md-end">
                        <button className="btn navbar-azul text-light text-decoration-none " data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                            Filtrar <i className="fas fa-sort-down ms-2"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="container">
                {posts.map(post => (
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
                ))}
            </div>
        </div>
    );
}

export default PostList;