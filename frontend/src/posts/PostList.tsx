import { useEffect, useState } from "react";
import '../Navbar.css'
import { Link } from 'react-router-dom';
import './Post.css'
import PostListComponent from "./PostListComponent";

export interface PostListProps {

}

const PostList: React.JSXElementConstructor<PostListProps> = () => {

    const [posts, setPosts] = useState([])

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch(`${process.env.REACT_APP_BASEURL!}/post`, { method: "GET" });
            if (response.status == 200) {
                // Respuesta correcta, cargamos los datos
                const jsonData = await response.json();
                setPosts(jsonData);
                console.log("se cogen los post fde la base de datos")
            }
        }
        fetchPosts();
        return () => { }
    }, []);

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