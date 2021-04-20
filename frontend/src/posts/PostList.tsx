import { useState } from "react";
import '../Navbar.css'
import { Link } from 'react-router-dom';
import './Post.css'
import PostListComponent from "./PostListComponent";

export interface PostListProps {

}

const PostList: React.JSXElementConstructor<PostListProps> = () => {

    const [posts, setPosts] = useState([
        { title: 'Titulo del post', body: 'lorem ipsum...', author: 'ElJosé', id: 1, likes: 17 },
        { title: 'Titulo del post', body: 'lorem ipsum...', author: 'ElJosé', id: 2, likes: 17 },
        { title: 'Titulo del post', body: 'lorem ipsum...', author: 'ElJosé', id: 3, likes: 17 }
    ])

    return (
        <div >
            <div className="container-fluid mb-4 mt-4">
                <div className="row justify-content-between">
                    <div className="col-4">
                        <Link to="/createPost" >
                            <button className="btn navbar-azul text-light text-decoration-none">
                                Añadir post <i className="fas fa-plus ms-2"></i>
                            </button>
                        </Link>
                    </div>
                    <div className="col-4 d-grid gap-2 d-md-flex justify-content-md-end">
                        <button className="btn navbar-azul text-light text-decoration-none">
                            Filtrar <i className="fas fa-sort-down ms-2"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="container">
                <PostListComponent posts={posts} />
            </div>
        </div>
    );
}

export default PostList;